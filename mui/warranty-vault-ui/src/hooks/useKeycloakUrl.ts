import axiosApi from '../config/axiosApiConfig';
import { API_BASE_URL, ENDPOINTS } from '../constants/apiConstants';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

const useKeycloakUrl = (): string | null => {
  const navigate = useNavigate();
  const [keycloakUrl, setKeycloakUrl] = useState<string | null>(null);
  const isNative = Capacitor.isNativePlatform();
 
  useEffect(() => {
    if (sessionStorage.getItem("jwt")) {
      navigate("/home");
      return;
    }
    
    const fetchUrl = async () => {
      try {
        // Generate a unique state parameter
        const stateParam = 'keycloak_state_' + Date.now() + '_' + Math.random().toString(36).substring(2);
        sessionStorage.setItem('keycloak_state', stateParam);
        
        const endpoint = ENDPOINTS.CODE_URL;
        const response = await axiosApi({
          method: endpoint.method,
          url: `${API_BASE_URL}${endpoint.path}`,
          responseType: "text",
        });
        
        let url = response.data;
        
        // Add or modify parameters in the URL
        try {
          const urlObj = new URL(url);
          const params = new URLSearchParams(urlObj.search);
          
          // If in native app, modify redirect_uri to use custom scheme
          if (isNative) {
            const currentRedirectUri = params.get('redirect_uri');
            
            // Only modify if not already using our custom scheme
            if (currentRedirectUri && !currentRedirectUri.startsWith('vaultapp://')) {
              params.set('redirect_uri', 'vaultapp://callback');
            }
          }
          
          // Always add state parameter
          params.set('state', stateParam);
          
          // Rebuild URL with updated parameters
          urlObj.search = params.toString();
          url = urlObj.toString();
        } catch (e) {
          console.error('Error modifying Keycloak URL:', e);
          
          // Fallback: just add state parameter
          if (!url.includes('state=')) {
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}state=${encodeURIComponent(stateParam)}`;
          }
        }
        
        setKeycloakUrl(url);
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
  }, [navigate, isNative]);
 
  return keycloakUrl;
};
 
export default useKeycloakUrl;