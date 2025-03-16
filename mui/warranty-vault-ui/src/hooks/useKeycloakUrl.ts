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
    }

    const fetchUrl = async () => {
      try {
        const endpoint = ENDPOINTS.CODE_URL;
        const response = await axiosApi({
          method: endpoint.method,
          url: `${API_BASE_URL}${endpoint.path}`,
          responseType: "text",
        });
        setKeycloakUrl(response.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          navigate("/unauthorized");
        } else {
          navigate("/error");
        }
        console.error("Error fetching Keycloak URL:", error);
      }
    };
   
    fetchUrl();
  }, [navigate]);
 
  return keycloakUrl;
};
 
export default useKeycloakUrl;