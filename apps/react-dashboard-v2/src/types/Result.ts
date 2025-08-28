/**
 * Result type for consistent error handling across repositories
 */
export type Result<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
  code?: string;
};

export const Success = <T>(data: T): Result<T> => ({
  success: true,
  data
});

export const Failure = <T>(error: string, code?: string): Result<T> => ({
  success: false,
  error,
  code
});

export const isSuccess = <T>(result: Result<T>): result is { success: true; data: T } => 
  result.success;

export const isFailure = <T>(result: Result<T>): result is { success: false; error: string; code?: string } => 
  !result.success;