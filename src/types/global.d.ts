/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_ICP_NUMBER: string;
  readonly VITE_ICP_LINK: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_BUILD_TIME: string;
  readonly VITE_GIT_HASH: string;
  readonly VITE_API_HEALTH_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
