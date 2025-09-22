import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

export default defineNuxtPlugin(async (nuxtApp) => {
  const coinfg = useRuntimeConfig();

  const apiInstance: AxiosInstance = axios.create({
    baseURL: coinfg.public.base_url,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  return {
    provide: {
      axios: apiInstance,
    },
  };
});
