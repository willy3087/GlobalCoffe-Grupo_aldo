/**
 * Data Transfer Object for Weather data
 * Used to transfer weather data between service layers
 */

export interface TemperatureDTO {
  current: number;
  min: number;
  max: number;
  feels_like: number;
  unit: 'celsius' | 'fahrenheit';
}

export interface PrecipitationDTO {
  amount: number;
  probability: number; // 0-1
  type: 'rain' | 'drizzle' | 'snow' | 'hail';
  intensity: 'light' | 'moderate' | 'heavy';
  unit: 'mm' | 'inches';
}

export interface WindDTO {
  speed: number;
  direction: number; // degrees 0-360
  gust?: number;
  unit: 'm/s' | 'km/h' | 'mph';
}

export interface AtmosphericDTO {
  pressure: number;
  humidity: number; // percentage
  visibility: number;
  uvIndex: number;
  cloudCover: number; // percentage
}

export interface WeatherConditionDTO {
  code: string;
  description: string;
  icon: string;
  severity?: 'low' | 'medium' | 'high' | 'extreme';
}

export interface AlertDTO {
  id: string;
  type: 'temperature' | 'precipitation' | 'wind' | 'storm' | 'drought' | 'frost';
  severity: 'advisory' | 'watch' | 'warning' | 'emergency';
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  affectedAreas: string[];
  recommendations: string[];
}

export interface ClimateIndexDTO {
  dryBulbTemperature: number;
  wetBulbTemperature: number;
  relativeHumidity: number;
  heatIndex: number;
  windChillIndex: number;
  comfortIndex: number; // 0-100
  stressLevel: 'low' | 'moderate' | 'high' | 'extreme';
}

export interface AgriculturalDTO {
  soilMoisture: number; // percentage
  soilTemperature: number;
  evapotranspiration: number;
  growingDegreeDay: number;
  chillHours: number;
  frostRisk: number; // 0-1
  droughtIndex: number; // 0-1
  cropStressIndex: number; // 0-1
}

export interface ForecastPeriodDTO {
  date: Date;
  temperature: TemperatureDTO;
  precipitation: PrecipitationDTO;
  wind: WindDTO;
  atmospheric: AtmosphericDTO;
  condition: WeatherConditionDTO;
  agricultural?: AgriculturalDTO;
  confidence: number; // 0-1
}

export interface WeatherDTO {
  id: string;
  location: {
    name: string;
    country: string;
    state?: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    elevation?: number;
    timezone: string;
  };
  
  // Current conditions
  current: {
    observedAt: Date;
    temperature: TemperatureDTO;
    precipitation: PrecipitationDTO;
    wind: WindDTO;
    atmospheric: AtmosphericDTO;
    condition: WeatherConditionDTO;
    climateIndex: ClimateIndexDTO;
    agricultural: AgriculturalDTO;
  };
  
  // Forecasts
  hourly: ForecastPeriodDTO[]; // next 48 hours
  daily: ForecastPeriodDTO[]; // next 14 days
  monthly?: ForecastPeriodDTO[]; // next 6 months
  
  // Alerts and warnings
  alerts: AlertDTO[];
  
  // Historical data for trends
  historical?: {
    period: string;
    averageTemp: number;
    totalPrecipitation: number;
    normalValues: {
      temperature: number;
      precipitation: number;
    };
    anomalies: {
      temperature: number;
      precipitation: number;
    };
  };
  
  // Data quality and source
  dataQuality: number; // 0-1
  source: string;
  lastUpdated: Date;
  nextUpdate: Date;
}

export interface WeatherSummaryDTO {
  location: string;
  period: string;
  conditions: string;
  temperature: {
    avg: number;
    min: number;
    max: number;
  };
  precipitation: {
    total: number;
    days: number;
  };
  alerts: number;
  overallImpact: 'positive' | 'neutral' | 'negative';
  coffeeImpact: {
    flowering: 'favorable' | 'neutral' | 'unfavorable';
    growth: 'favorable' | 'neutral' | 'unfavorable';
    harvest: 'favorable' | 'neutral' | 'unfavorable';
    quality: 'favorable' | 'neutral' | 'unfavorable';
  };
}

export interface WeatherAnalysisDTO {
  location: string;
  analysisDate: Date;
  period: {
    start: Date;
    end: Date;
  };
  
  trends: {
    temperature: 'warming' | 'cooling' | 'stable';
    precipitation: 'increasing' | 'decreasing' | 'stable';
    extremeEvents: 'increasing' | 'decreasing' | 'stable';
  };
  
  seasonalOutlook: {
    season: string;
    temperature: 'above' | 'normal' | 'below';
    precipitation: 'above' | 'normal' | 'below';
    confidence: number;
  };
  
  riskAssessment: {
    drought: number; // 0-1
    flood: number; // 0-1
    frost: number; // 0-1
    heatWave: number; // 0-1
    storm: number; // 0-1
  };
  
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

export interface CreateWeatherRequestDTO {
  latitude: number;
  longitude: number;
  includeForecast?: boolean;
  includeHourly?: boolean;
  includeAlerts?: boolean;
  includeAgricultural?: boolean;
  includeHistorical?: boolean;
}

export interface UpdateWeatherDTO {
  alerts?: AlertDTO[];
  agricultural?: Partial<AgriculturalDTO>;
  dataQuality?: number;
}

export interface WeatherFilterDTO {
  location?: string;
  startDate?: Date;
  endDate?: Date;
  alertTypes?: AlertDTO['type'][];
  minDataQuality?: number;
  includeInactive?: boolean;
}

export interface WeatherSubscriptionDTO {
  id: string;
  userId: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  alertTypes: AlertDTO['type'][];
  thresholds: {
    temperature?: { min?: number; max?: number };
    precipitation?: { min?: number; max?: number };
    wind?: { max?: number };
    humidity?: { min?: number; max?: number };
  };
  notificationMethods: ('email' | 'sms' | 'push' | 'webhook')[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}