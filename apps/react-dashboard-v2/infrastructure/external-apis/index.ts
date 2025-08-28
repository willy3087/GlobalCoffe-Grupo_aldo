/**
 * External APIs Infrastructure
 * 
 * Centraliza clientes para APIs externas utilizadas
 * no sistema Global Coffee
 */

export { OpenWeatherMapClient } from './OpenWeatherMapClient';
export type { 
  WeatherApiResponse, 
  WeatherForecast, 
  HistoricalWeatherData 
} from './OpenWeatherMapClient';