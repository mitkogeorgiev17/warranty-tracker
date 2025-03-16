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

  GET_WARRANTIES: { path: '/warranties/', method: 'GET'},
  CREATE_WARRANTY: { path: '/warranties/', method: 'POST'},
  UPDATE_WARRANTY: { path: '/warranties/', method: 'PUT'},
  DELETE_WARRANTY: { path: '/warranties/', method: 'DELETE'},

  ADD_WARRANTY_FILES: { path: '/warranties/files/', method: 'POST'},

  GET_MOST_USED_CATEGORIES: {path: '/categories/', method: 'GET'},
  GET_USER_CATEGORIES: {path: '/categories/user', method: 'GET'}
};

export { API_BASE_URL, ENDPOINTS };
