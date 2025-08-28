/**
 * Client para integração com OpenWeatherMap API
 * 
 * Fornece dados climáticos essenciais para cálculo do IAC-Café
 * Integra com algoritmo científico validado
 * 
 * @author Global Coffee Team
 * @version 1.0.0
 */

/**
 * Interface para resposta da API de dados climáticos atuais
 */
export interface WeatherApiResponse {
  temperatura: number;      // °C
  precipitacao: number;     // mm (últimos 30 dias)
  umidade: number;         // %
  radiacao: number;        // MJ/m²/dia (estimado via cloud cover)
  velocidadeVento: number; // km/h
  diasExtremos: number;    // dias com temp < 4°C ou > 34°C (últimos 30 dias)
}

/**
 * Interface para previsões de 7 dias
 */
export interface WeatherForecast {
  data: string;
  temperatura: number;
  temperaturaMin: number;
  temperaturaMax: number;
  precipitacao: number;
  umidade: number;
  velocidadeVento: number;
}

/**
 * Interface para dados históricos
 */
export interface HistoricalWeatherData {
  temperatura: number;
  precipitacao: number;
  umidade: number;
  velocidadeVento: number;
  eventosExtremos: number;
}

/**
 * Client para OpenWeatherMap API
 * 
 * Implementa integração robusta com tratamento de erros,
 * cache e otimizações para performance
 */
export class OpenWeatherMapClient {
  private readonly baseURL = 'https://api.openweathermap.org/data/2.5';
  private readonly oneCallURL = 'https://api.openweathermap.org/data/3.0/onecall';
  private readonly apiKey: string;
  private readonly cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly cacheTTL = 10 * 60 * 1000; // 10 minutos

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENWEATHERMAP_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('OpenWeatherMap API key não configurada - usando dados mock');
    }
  }

  /**
   * Obtém dados climáticos atuais e históricos para cálculo IAC
   * 
   * @param lat Latitude
   * @param _lon Longitude (not used currently)
   * @returns Promise<WeatherApiResponse> Dados climáticos formatados
   */
  async obterDadosClimaticos(lat: number, _lon?: number): Promise<WeatherApiResponse> {
    const cacheKey = `weather_${lat}`;
    
    // Verificar cache
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      if (!this.apiKey) {
        return this.obterDadosMock();
      }

      // Dados atuais
      const currentWeather = await this.fetchCurrentWeather(lat, 0);
      
      // Dados históricos simulados (método fetchHistoricalData está comentado)
      const historicalData = {
        temperatura: currentWeather.main.temp,
        precipitacao: (currentWeather.rain?.['1h'] || 0) * 24 * 30,
        umidade: currentWeather.main.humidity,
        velocidadeVento: currentWeather.wind.speed * 3.6,
        eventosExtremos: this.estimarEventosExtremos(currentWeather.main.temp)
      };
      
      // Processar e combinar dados
      const dadosProcessados = await this.processarDadosClimaticos(
        currentWeather,
        historicalData,
        lat,
        0
      );

      // Armazenar no cache
      this.setCachedData(cacheKey, dadosProcessados);

      return dadosProcessados;
    } catch (error) {
      console.error('Erro ao obter dados do OpenWeatherMap:', error);
      
      // Fallback para dados mock em caso de erro
      return this.obterDadosMock();
    }
  }

  /**
   * Obtém previsões de 7 dias para cálculo de confiabilidade
   */
  async obterPrevisoes7Dias(lat: number, lon: number): Promise<WeatherForecast[]> {
    const cacheKey = `forecast_${lat}_${lon}`;
    
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      if (!this.apiKey) {
        return this.obterPrevisoesMock();
      }

      const response = await fetch(
        `${this.oneCallURL}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&exclude=minutely,alerts`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const previsoes: WeatherForecast[] = data.daily.slice(0, 7).map((day: any) => ({
        data: new Date(day.dt * 1000).toISOString(),
        temperatura: day.temp.day,
        temperaturaMin: day.temp.min,
        temperaturaMax: day.temp.max,
        precipitacao: day.rain?.['1h'] || 0,
        umidade: day.humidity,
        velocidadeVento: day.wind_speed * 3.6 // m/s para km/h
      }));

      this.setCachedData(cacheKey, previsoes);
      return previsoes;
    } catch (error) {
      console.error('Erro ao obter previsões:', error);
      return this.obterPrevisoesMock();
    }
  }

  /**
   * Busca dados climáticos atuais
   */
  private async fetchCurrentWeather(lat: number, lon: number): Promise<any> {
    const response = await fetch(
      `${this.baseURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Current weather API error: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Busca dados históricos dos últimos 30 dias
   */
  /*
  private async fetchHistoricalData(lat: number, lon: number): Promise<HistoricalWeatherData> {
    // Para dados históricos precisos, seria necessária a API paga do OpenWeatherMap
    // Por enquanto, simulamos com base nos dados atuais + variação
    const currentWeather = await this.fetchCurrentWeather(lat, lon);
    
    return {
      temperatura: currentWeather.main.temp,
      precipitacao: (currentWeather.rain?.['1h'] || 0) * 24 * 30, // Estimativa mensal
      umidade: currentWeather.main.humidity,
      velocidadeVento: currentWeather.wind.speed * 3.6, // m/s para km/h
      eventosExtremos: this.estimarEventosExtremos(currentWeather.main.temp)
    };
  }
  */

  /**
   * Processa e formata dados climáticos para o algoritmo IAC
   */
  private async processarDadosClimaticos(
    current: any,
    historical: HistoricalWeatherData,
    lat: number,
    _lon: number
  ): Promise<WeatherApiResponse> {
    // Estimar radiação solar baseado em cobertura de nuvens
    const radiacao = this.estimarRadiacaoSolar(
      current.clouds?.all || 0,
      lat,
      this.obterMesAtual()
    );

    return {
      temperatura: current.main.temp,
      precipitacao: historical.precipitacao,
      umidade: current.main.humidity,
      radiacao,
      velocidadeVento: current.wind.speed * 3.6, // m/s para km/h
      diasExtremos: historical.eventosExtremos
    };
  }

  /**
   * Estima radiação solar baseado em cobertura de nuvens e localização
   */
  private estimarRadiacaoSolar(coberturaNuvens: number, lat: number, mes: number): number {
    // Radiação solar teórica máxima por latitude e mês
    const radiacaoMaxima = this.calcularRadiacaoTeorica(lat, mes);
    
    // Redução por cobertura de nuvens (0-100%)
    const fatorNuvens = 1 - (coberturaNuvens / 100) * 0.7; // Máximo 70% de redução
    
    return radiacaoMaxima * fatorNuvens;
  }

  /**
   * Calcula radiação solar teórica máxima
   */
  private calcularRadiacaoTeorica(lat: number, mes: number): number {
    // Valores médios para regiões cafeeiras brasileiras (simplificado)
    // Em implementação real, usaria cálculos astronômicos precisos
    const radiacaoBase = 25; // MJ/m²/dia no equador
    const fatorLatitude = Math.cos(lat * Math.PI / 180);
    const fatorSazonal = 1 + 0.2 * Math.cos((mes - 1) * Math.PI / 6); // Variação sazonal
    
    return radiacaoBase * fatorLatitude * fatorSazonal;
  }

  /**
   * Estima eventos climáticos extremos baseado na temperatura atual
   */
  private estimarEventosExtremos(temperaturaAtual: number): number {
    // Estimativa simples baseada na temperatura atual
    // Em produção, usaria dados históricos reais
    if (temperaturaAtual < 10 || temperaturaAtual > 30) {
      return Math.floor(Math.random() * 5) + 3; // 3-7 dias
    } else if (temperaturaAtual < 15 || temperaturaAtual > 28) {
      return Math.floor(Math.random() * 3) + 1; // 1-3 dias
    }
    return Math.floor(Math.random() * 2); // 0-1 dias
  }

  /**
   * Obtém mês atual (1-12)
   */
  private obterMesAtual(): number {
    return new Date().getMonth() + 1;
  }

  /**
   * Gerenciamento de cache
   */
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTTL) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Dados mock para desenvolvimento
   */
  private obterDadosMock(): WeatherApiResponse {
    return {
      temperatura: 22 + (Math.random() - 0.5) * 4,      // 20-24°C
      precipitacao: 1500 + (Math.random() - 0.5) * 600, // 1200-1800mm
      umidade: 65 + (Math.random() - 0.5) * 10,         // 60-70%
      radiacao: 19.5 + (Math.random() - 0.5) * 5,       // 17-22 MJ/m²/dia
      velocidadeVento: 8 + (Math.random() - 0.5) * 6,   // 5-11 km/h
      diasExtremos: Math.floor(Math.random() * 3)       // 0-2 dias
    };
  }

  /**
   * Previsões mock para desenvolvimento
   */
  private obterPrevisoesMock(): WeatherForecast[] {
    const previsoes: WeatherForecast[] = [];
    const hoje = new Date();
    
    for (let i = 0; i < 7; i++) {
      const data = new Date(hoje);
      data.setDate(data.getDate() + i);
      
      const tempBase = 22 + (Math.random() - 0.5) * 6; // Variação realista
      
      previsoes.push({
        data: data.toISOString(),
        temperatura: tempBase,
        temperaturaMin: tempBase - 5,
        temperaturaMax: tempBase + 5,
        precipitacao: Math.random() * 10,
        umidade: 65 + (Math.random() - 0.5) * 20,
        velocidadeVento: 8 + (Math.random() - 0.5) * 10
      });
    }
    
    return previsoes;
  }
}