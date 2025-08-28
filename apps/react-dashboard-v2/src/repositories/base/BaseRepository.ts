import { Result, Success, Failure } from '../../types/Result';
import { IRepository } from '../interfaces/IRepository';

/**
 * Configuration for HTTP requests
 */
export interface HttpConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  retryAttempts?: number;
}

/**
 * Base repository implementation with generic CRUD operations using Fetch API
 */
export abstract class BaseRepository<T extends { id: string }> implements IRepository<T> {
  protected readonly config: HttpConfig;
  protected readonly resourcePath: string;

  constructor(resourcePath: string, config: HttpConfig) {
    this.resourcePath = resourcePath;
    this.config = {
      timeout: 10000,
      retryAttempts: 3,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      ...config
    };
  }

  /**
   * Find an entity by its ID
   */
  async findById(id: string): Promise<Result<T | null>> {
    try {
      const url = `${this.config.baseUrl}/${this.resourcePath}/${id}`;
      const response = await this.fetchWithRetry(url, {
        method: 'GET',
        headers: this.config.headers,
        signal: this.createTimeoutSignal()
      });

      if (response.status === 404) {
        return Success(null);
      }

      if (!response.ok) {
        return Failure(`HTTP Error: ${response.status} - ${response.statusText}`, `HTTP_${response.status}`);
      }

      const data = await response.json();
      return Success(data);
    } catch (error) {
      return this.handleError(error, 'findById');
    }
  }

  /**
   * Find all entities
   */
  async findAll(): Promise<Result<T[]>> {
    try {
      const url = `${this.config.baseUrl}/${this.resourcePath}`;
      const response = await this.fetchWithRetry(url, {
        method: 'GET',
        headers: this.config.headers,
        signal: this.createTimeoutSignal()
      });

      if (!response.ok) {
        return Failure(`HTTP Error: ${response.status} - ${response.statusText}`, `HTTP_${response.status}`);
      }

      const data = await response.json();
      return Success(Array.isArray(data) ? data : []);
    } catch (error) {
      return this.handleError(error, 'findAll');
    }
  }

  /**
   * Create a new entity
   */
  async create(entity: Omit<T, 'id'>): Promise<Result<T>> {
    try {
      const url = `${this.config.baseUrl}/${this.resourcePath}`;
      const response = await this.fetchWithRetry(url, {
        method: 'POST',
        headers: this.config.headers,
        body: JSON.stringify(entity),
        signal: this.createTimeoutSignal()
      });

      if (!response.ok) {
        return Failure(`HTTP Error: ${response.status} - ${response.statusText}`, `HTTP_${response.status}`);
      }

      const data = await response.json();
      return Success(data);
    } catch (error) {
      return this.handleError(error, 'create');
    }
  }

  /**
   * Update an existing entity
   */
  async update(id: string, entity: Partial<T>): Promise<Result<T>> {
    try {
      const url = `${this.config.baseUrl}/${this.resourcePath}/${id}`;
      const response = await this.fetchWithRetry(url, {
        method: 'PUT',
        headers: this.config.headers,
        body: JSON.stringify(entity),
        signal: this.createTimeoutSignal()
      });

      if (!response.ok) {
        return Failure(`HTTP Error: ${response.status} - ${response.statusText}`, `HTTP_${response.status}`);
      }

      const data = await response.json();
      return Success(data);
    } catch (error) {
      return this.handleError(error, 'update');
    }
  }

  /**
   * Delete an entity by its ID
   */
  async delete(id: string): Promise<Result<boolean>> {
    try {
      const url = `${this.config.baseUrl}/${this.resourcePath}/${id}`;
      const response = await this.fetchWithRetry(url, {
        method: 'DELETE',
        headers: this.config.headers,
        signal: this.createTimeoutSignal()
      });

      if (!response.ok) {
        return Failure(`HTTP Error: ${response.status} - ${response.statusText}`, `HTTP_${response.status}`);
      }

      return Success(true);
    } catch (error) {
      return this.handleError(error, 'delete');
    }
  }

  /**
   * Check if an entity exists by its ID
   */
  async exists(id: string): Promise<Result<boolean>> {
    try {
      const result = await this.findById(id);
      if (!result.success) {
        return result as Result<boolean>;
      }
      return Success(result.data !== null);
    } catch (error) {
      return this.handleError(error, 'exists');
    }
  }

  /**
   * Get total count of entities
   */
  async count(): Promise<Result<number>> {
    try {
      const url = `${this.config.baseUrl}/${this.resourcePath}/count`;
      const response = await this.fetchWithRetry(url, {
        method: 'GET',
        headers: this.config.headers,
        signal: this.createTimeoutSignal()
      });

      if (!response.ok) {
        return Failure(`HTTP Error: ${response.status} - ${response.statusText}`, `HTTP_${response.status}`);
      }

      const data = await response.json();
      return Success(typeof data === 'number' ? data : data.count || 0);
    } catch (error) {
      return this.handleError(error, 'count');
    }
  }

  /**
   * Protected method for custom queries with parameters
   */
  protected async fetchWithQuery<R>(
    endpoint: string,
    queryParams: Record<string, any> = {},
    options: RequestInit = {}
  ): Promise<Result<R>> {
    try {
      const url = new URL(`${this.config.baseUrl}/${this.resourcePath}/${endpoint}`);
      
      // Add query parameters
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });

      const response = await this.fetchWithRetry(url.toString(), {
        method: 'GET',
        headers: this.config.headers,
        signal: this.createTimeoutSignal(),
        ...options
      });

      if (!response.ok) {
        return Failure(`HTTP Error: ${response.status} - ${response.statusText}`, `HTTP_${response.status}`);
      }

      const data = await response.json();
      return Success(data);
    } catch (error) {
      return this.handleError(error, 'fetchWithQuery');
    }
  }

  /**
   * Create timeout signal for requests
   */
  private createTimeoutSignal(): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.config.timeout);
    return controller.signal;
  }

  /**
   * Fetch with retry logic
   */
  private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= (this.config.retryAttempts || 1); attempt++) {
      try {
        const response = await fetch(url, options);
        
        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          return response;
        }
        
        // Retry on server errors (5xx) and network errors
        if (response.ok || attempt === this.config.retryAttempts) {
          return response;
        }
        
        // Wait before retry with exponential backoff
        await this.delay(Math.pow(2, attempt - 1) * 1000);
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === this.config.retryAttempts) {
          throw error;
        }
        
        // Wait before retry
        await this.delay(Math.pow(2, attempt - 1) * 1000);
      }
    }
    
    throw lastError || new Error('Max retry attempts reached');
  }

  /**
   * Handle errors consistently
   */
  private handleError(error: any, operation: string): Result<any> {
    if (error.name === 'AbortError') {
      return Failure(`Request timeout for operation: ${operation}`, 'TIMEOUT');
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return Failure(`Network error for operation: ${operation}`, 'NETWORK_ERROR');
    }
    
    return Failure(
      `Unexpected error in ${operation}: ${error.message}`,
      'UNKNOWN_ERROR'
    );
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}