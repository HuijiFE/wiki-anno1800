export type AppPlatform = 'csr' | 'gh-pages' | 'hj-pages';

const APP_PLATFORM: AppPlatform = (
  process.env.VUE_APP_PLATFORM || 'csr'
).toLowerCase() as AppPlatform;

export type NodeEnv = 'production' | 'development';

const NODE_ENV: NodeEnv = (process.env.NODE_ENV || 'production') as NodeEnv;

export interface Environments {
  readonly APP_PLATFORM: AppPlatform;
  readonly NODE_ENV: NodeEnv;
}

export const ENV: Environments = {
  APP_PLATFORM,
  NODE_ENV,
};
