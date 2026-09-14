export const DEMO_ACCESS_TOKEN = "realconnect-portfolio-demo-token";
export const DEMO_USERNAME = "portfolio-demo";

export interface DemoSession {
  accessToken: typeof DEMO_ACCESS_TOKEN;
  username: typeof DEMO_USERNAME;
}

type DemoAuthSetter = (session: DemoSession) => void;

/**
 * The portfolio build uses local demo data unless API mode is explicitly enabled.
 */
export function isDemoRuntime(): boolean {
  return import.meta.env.VITE_DATA_SOURCE !== "api";
}

export function isDemoAccessToken(
  token: string | null | undefined,
): token is typeof DEMO_ACCESS_TOKEN {
  return token === DEMO_ACCESS_TOKEN;
}

/**
 * Creates the recognizable, non-production session shared by the demo UI and
 * data services. A setter can be passed to persist it in the existing auth store.
 */
export function beginDemoSession(setAuth?: DemoAuthSetter): DemoSession {
  const session = {
    accessToken: DEMO_ACCESS_TOKEN,
    username: DEMO_USERNAME,
  } as const;

  setAuth?.(session);
  return session;
}
