import axiosApi from '../config/axiosApiConfig';
import { API_BASE_URL, ENDPOINTS } from '../constants/apiConstants';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const useKeycloakUrl = (): string | null => {
  const navigate = useNavigate();
  const [keycloakUrl, setKeycloakUrl] = useState<string | null>(null);
 
  useEffect(() => {
    if (sessionStorage.getItem("jwt")) {
      navigate("/home");
      return;
    }
   
    const fetchUrl = async () => {
      try {
        const endpoint = ENDPOINTS.CODE_URL;
        
        const response = await axiosApi({
          method: endpoint.method,
          url: `${API_BASE_URL}${endpoint.path}`,
          responseType: 'text',
          transformResponse: [(data) => data],
          headers: {
            'Accept': 'text/plain'
          }
        });
        
        const url = response.data;
        setKeycloakUrl(url);
      } catch (error: any) {
        console.error("Error fetching Keycloak URL:", error);
        if (error.response?.status === 401) {
          navigate("/unauthorized");
        } else {
          navigate("/error");
        }
      }
    };
   
    fetchUrl();
  }, [navigate]);
 
  return keycloakUrl;
};
 
export default useKeycloakUrl;