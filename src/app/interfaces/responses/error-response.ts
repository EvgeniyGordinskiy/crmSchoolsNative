export interface ErrorResponse {
  error: {
    errors: {
      key: [string]
    },
    message: string
  },
}
