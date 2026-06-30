import type { AuthPrincipal } from "./index";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPrincipal;
    }
  }
}

export {};
