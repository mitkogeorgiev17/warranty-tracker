type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiEndpoint {
  path: string;
  method: HttpMethod;
}

const API_BASE_URL = 'http://localhost:8080/api/v1.0.0';

const ENDPOINTS: Record<string, ApiEndpoint> = {
    // Authentication
  CODE_URL: { path: '/auth/code', method: 'GET' },
  AUTHENTICATE: { path: '/auth/authenticate', method: 'POST' },
  ACCOUNT: { path: '/account/', method: 'POST' },
};

export { API_BASE_URL, ENDPOINTS };
