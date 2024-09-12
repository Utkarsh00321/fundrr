
export interface ApiErrorResponse {
  success: boolean;           // Always false for error responses
  message: string;            // Description of the error
  errorCode?: number;         // Optional HTTP status code or custom error code
  errorDetails?: string;      // Optional additional information or stack trace (for debugging)
  fieldErrors?: {             // Optional field-level validation errors (e.g., form validation)
    [field: string]: string;  // Field name and the corresponding error message
  };
  isAuthenticationError?: boolean; // Optional flag indicating an authentication failure
  isAuthorizationError?: boolean;  // Optional flag indicating an authorization failure
  retryable?: boolean;        // Optional flag indicating if the error is retryable
}
