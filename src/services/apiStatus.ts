const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENV_HEALTH_PATH = import.meta.env.VITE_API_HEALTH_PATH as string | undefined;

const DEFAULT_HEALTH_PATHS = ['/actuator/health', '/health', '/api/health', '/api/status', '/'];

const buildHealthPathList = (): string[] => {
  const envPaths = ENV_HEALTH_PATH
    ? ENV_HEALTH_PATH.split(',').map((path) => path.trim()).filter(Boolean)
    : [];
  return Array.from(new Set([...envPaths, ...DEFAULT_HEALTH_PATHS]));
};

export const checkApiStatus = async (signal?: AbortSignal): Promise<{
  online: boolean;
  checkedUrl?: string;
}> => {
  if (!API_BASE_URL) {
    return { online: false };
  }

  const paths = buildHealthPathList();

  for (const path of paths) {
    try {
      const url = new URL(path, API_BASE_URL);
      const response = await fetch(url.toString(), {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        signal,
      });

      if (response.ok) {
        return { online: true, checkedUrl: url.toString() };
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw error;
      }
      // ignore and continue trying other paths
    }
  }

  return { online: false };
};
