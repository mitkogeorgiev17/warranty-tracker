type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiEndpoint {
  path: string;
  method: HttpMethod;
}
// Local development
const API_BASE_URL = 'http://localhost:8080/api/v1.0.0';
// For emulator
// const API_BASE_URL = 'http://10.0.2.2:8080/api/v1.0.0';
// For physical device
// const API_BASE_URL = 'http://192.168.0.2:8080/api/v1.0.0';

const ENDPOINTS: Record<string, ApiEndpoint> = {
  // Authentication
  CODE_URL: { path: '/auth/code', method: 'GET' },
  AUTHENTICATE: { path: '/auth/authenticate', method: 'POST' },
  ACCOUNT: { path: '/account/', method: 'POST' },
  UPDATE_ACCOUNT: { path: '/account/', method: 'PUT'},
  
  // Warranties
  GET_WARRANTIES: { path: '/warranties/', method: 'GET'},
  CREATE_WARRANTY: { path: '/warranties/', method: 'POST'},
  UPDATE_WARRANTY: { path: '/warranties/', method: 'PUT'},
  DELETE_WARRANTY: { path: '/warranties/', method: 'DELETE'},
  SCAN_WARRANTY: { path: '/warranties/scan', method: 'POST'},
  
  // Warranty Files
  ADD_WARRANTY_FILES: { path: '/warranties/files/', method: 'POST'},
  DELETE_WARRANTY_FILES: { path: '/warranties/files/', method: 'DELETE'},
  
  // Categories
  GET_MOST_USED_CATEGORIES: {path: '/categories/', method: 'GET'},
  GET_USER_CATEGORIES: {path: '/categories/user', method: 'GET'}
};

export { API_BASE_URL, ENDPOINTS };