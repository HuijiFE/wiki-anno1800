export type AppPlatform = 'csr' | 'gh-pages' | 'hj-pages';

const APP_PLATFORM: AppPlatform = (
  process.env.VUE_APP_PLATFORM || 'csr'
).toLowerCase() as AppPlatform;

export interface Environments {
  readonly APP_PLATFORM: AppPlatform;
}

export const ENV: Environments = {
  APP_PLATFORM,
};
