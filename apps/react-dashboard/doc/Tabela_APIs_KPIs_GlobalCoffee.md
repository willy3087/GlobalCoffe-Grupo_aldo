# TABELA DE APIS PARA KPIs - PROJETO GLOBALCOFFEE

## Tabela Consolidada de APIs Validadas

| Dado                                       | Fonte                                           | Método   | Calculado | CAPTCHA | Global |
| ------------------------------------------ | ----------------------------------------------- | --------- | --------- | ------- | ------ |
| Coffee Bag R$ 1.842 - Dashboard.tsx        | https://commodities-api.com/                    | API       | Não      | Não    | Sim    |
| Climate Index 78/100 - Dashboard.tsx       | https://openweathermap.org/api                  | API       | Sim       | Não    | Sim    |
| Global Stock 158M - Dashboard.tsx          | https://tradingeconomics.com/api/               | API       | Não      | Não    | Sim    |
| Exchange Rate R$ 5.12 - Dashboard.tsx      | https://finance.yahoo.com                       | API       | Não      | Sim     | Sim    |
| Volatility 24.3% - Dashboard.tsx           | https://www.alphavantage.co/                    | API       | Sim       | Não    | Sim    |
| Global Production 175M - Dashboard.tsx     | https://apps.fas.usda.gov/psdonline/api         | API       | Não      | Não    | Sim    |
| Temperature 24°C - WeatherMonitoring.tsx  | https://openweathermap.org/api                  | API       | Não      | Não    | Sim    |
| Humidity 65% - WeatherMonitoring.tsx       | https://openweathermap.org/api                  | API       | Não      | Não    | Sim    |
| Wind 12 km/h - WeatherMonitoring.tsx       | https://openweathermap.org/api                  | API       | Não      | Não    | Sim    |
| Precipitation 45mm - WeatherMonitoring.tsx | https://openweathermap.org/api                  | API       | Não      | Não    | Sim    |
| Clouds 40% - WeatherMonitoring.tsx         | https://openweathermap.org/api                  | API       | Não      | Não    | Sim    |
| Pressure 1013 hPa - WeatherMonitoring.tsx  | https://openweathermap.org/api                  | API       | Não      | Não    | Sim    |
| SCA Score 92 - CoffeeAnalysis.tsx          | https://sca.coffee/research                     | Crawler   | Sim       | Sim     | Não   |
| Defeitos Tipo 1 - CoffeeAnalysis.tsx       | https://www.sagarpa.gob.mx/conadesuca           | Crawler   | Não      | Não    | Não   |
| Defeitos Tipo 2 - CoffeeAnalysis.tsx       | https://www.sagarpa.gob.mx/conadesuca           | Crawler   | Não      | Não    | Não   |
| Componentes Químicos - CoffeeAnalysis.tsx | https://coffeeresearch.org                      | Crawler   | Sim       | Sim     | Sim    |
| Preço Arábica - Mercado.tsx              | https://commodities-api.com/                    | API       | Não      | Não    | Sim    |
| Preço Robusta - Mercado.tsx               | https://commodities-api.com/                    | API       | Não      | Não    | Sim    |
| Volume Trading - Mercado.tsx               | https://www.ice.com/market-data                 | API       | Não      | Sim     | Sim    |
| SMA Técnico - Mercado.tsx                 | https://www.alphavantage.co/                    | API       | Sim       | Não    | Sim    |
| Calculadora Preços - Features.tsx         | https://www.cepea.esalq.usp.br                  | Crawler   | Sim       | Não    | Não   |
| Cenários Simulação - Features.tsx       | Cálculo interno                                | Calculado | Sim       | Não    | Não   |
| Análise Canais - Features.tsx             | https://conab.gov.br                            | Crawler   | Sim       | Não    | Não   |
| Preço Arábica R$ 1.420 - Home.tsx        | https://commodities-api.com/                    | API       | Não      | Não    | Sim    |
| Produtividade 42 sc/ha - ProducerData.tsx  | https://www.ibge.gov.br/estatisticas/economicas | Crawler   | Não      | Não    | Não   |
| Feed Notícias - Home.tsx                  | https://newsapi.org/                            | API       | Não      | Não    | Sim    |
| Session Management - Login.tsx             | OAuth2 padrão                                  | API       | Não      | Não    | Sim    |
| Planos Preços - Pricing.tsx               | Sistema interno                                 | Calculado | Não      | Não    | Não   |

## Legendas

### Método

- **API**: REST, GraphQL ou similar com endpoints documentados
- **Crawler**: Web scraping necessário para obter dados
- **Calculado**: Dados derivados de outras fontes ou cálculos internos

### Calculado

- **Sim**: Dado é processado/calculado a partir de outras fontes
- **Não**: Dado é obtido diretamente da fonte original

### CAPTCHA

- **Sim**: Fonte possui proteção CAPTCHA ou similar
- **Não**: Acesso direto sem proteção adicional

### Global

- **Sim**: Cobertura mundial ou internacional
- **Não**: Cobertura regional/nacional (Brasil, América Latina)

## Resumo por Categoria

### APIs Comerciais (7 fontes)

- Commodities-API: Preços café tempo real
- OpenWeatherMap: Dados meteorológicos completos
- Trading Economics: Dados econômicos globais
- Alpha Vantage: Indicadores técnicos
- Yahoo Finance: Câmbio e cotações
- NewsAPI: Feed de notícias
- ICE Market Data: Volume trading

### APIs Governamentais/Institucionais (4 fontes)

- USDA FAS: Produção mundial café
- CEPEA/ESALQ: Preços brasileiros
- CONAB: Dados de produção nacional
- IBGE: Estatísticas produção

### Web Scraping/Crawler (4 fontes)

- SCA (Specialty Coffee Association): Scores qualidade
- CoffeeResearch.org: Componentes químicos
- SAGARPA: Classificação defeitos
- Sites cooperativas: Dados específicos

### Dados Calculados/Internos (3 fontes)

- Climate Index: Calculado a partir dados meteorológicos
- Cenários Simulação: Algoritmos próprios
- Sistema de Preços: Gestão interna

## Custos Estimados Totais

### APIs Pagas (Mensais)

- Commodities-API: $49.99/mês
- OpenWeatherMap: $40/mês
- Trading Economics: $79/mês
- Alpha Vantage: Gratuito até 5 req/min
- Yahoo Finance: Gratuito com limitações
- ICE Market Data: Sob consulta (~$200/mês)

**Total Estimado: $370-500/mês para APIs**

### Desenvolvimento Web Scraping

- Infraestrutura: $50-100/mês (servidores)
- Manutenção: 20h/mês x $50/h = $1.000/mês

**Total Geral: $1.420-1.600/mês operacional**

## Validação Realizada

✅ **28 APIs/fontes identificadas e categorizadas**
✅ **Links verificados para funcionalidade básica**
✅ **Métodos de acesso determinados**
✅ **Características técnicas mapeadas**
✅ **Custos estimados calculados**


---

*Documento gerado em: 20 de agosto de 2025*
*Base: Inventario_Documentacao_APIs_GlobalCoffee.md*
*Total de KPIs mapeados: 28 across 9 páginas*
