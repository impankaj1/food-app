import axios from 'axios';

let accessToken: string | null = null;

const axiosInstance = axios.create({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  baseURL: process.env.NEXT_PUBLIC_NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

export const setAccessToken = (token: string) => {
  accessToken = token;
};

axiosInstance.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;

      try {
        const res = await axios.post(
          'http://localhost:3000/auth/refresh',
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.token;
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.log('Refresh token failed', err);
        window.location.href = 'auth/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
