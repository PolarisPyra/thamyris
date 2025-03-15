import { HTTPException } from "hono/http-exception";

/**
 * Allows rethrowing an error with a wrapper message while preserving the original error's status code.
 * Like catching a rock, putting a sticky note on it, and throwing it at someone else.
 */
export const rethrowWithMessage = (msg: string, error: any) => {
	const httpException = error as HTTPException;
	const status = httpException?.status ?? 500;
	const cause = httpException?.stack ?? error;
	const message = `${msg}` + (httpException.message ? `: ${httpException.message}` : "");
	return new HTTPException(status, { message, cause });
};
