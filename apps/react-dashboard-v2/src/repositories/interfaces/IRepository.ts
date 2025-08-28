import { Result } from '../../types/Result';

/**
 * Base repository interface with generic CRUD operations
 */
export interface IRepository<T> {
  /**
   * Find an entity by its ID
   */
  findById(id: string): Promise<Result<T | null>>;

  /**
   * Find all entities
   */
  findAll(): Promise<Result<T[]>>;

  /**
   * Create a new entity
   */
  create(entity: Omit<T, 'id'>): Promise<Result<T>>;

  /**
   * Update an existing entity
   */
  update(id: string, entity: Partial<T>): Promise<Result<T>>;

  /**
   * Delete an entity by its ID
   */
  delete(id: string): Promise<Result<boolean>>;

  /**
   * Check if an entity exists by its ID
   */
  exists(id: string): Promise<Result<boolean>>;

  /**
   * Get total count of entities
   */
  count(): Promise<Result<number>>;
}