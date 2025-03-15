import { HTTPException } from "hono/http-exception";

/**
 * Allows rethrowing an error with a wrapper message while preserving the original error's status code.
 */
export const rethrowWithMessage = (msg: string, error: any) => {
	const httpException = error as HTTPException;
	const status = httpException?.status ?? 500;
	const cause = httpException?.stack ?? error;
	const message = `${msg}` + (httpException.message ? `: ${httpException.message}` : "");
	throw new HTTPException(status, { message, cause });
};
