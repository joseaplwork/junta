/** `GET /api/health`. Public, so clients can check that the API is reachable. */
export interface HealthResponse {
  status: 'ok'
}
