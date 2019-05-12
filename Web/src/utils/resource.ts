import Axios, { AxiosRequestConfig } from 'axios';

/**
 * Resolve CDN URL for resources in directory 'public'
 * @param path the relative path in directory 'public'
 */
export function resource(path: string): string {
  return `${process.env.BASE_URL}${path}`;
}

const axios = Axios.create({
  baseURL: process.env.BASE_URL,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getResource<T = any>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const { data } = await axios.get<T>(path, config);
  return data;
}
