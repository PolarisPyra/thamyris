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

export const successWithMessage = (msg: string, success: any) => {
	const httpException = success as HTTPException;
	const status = httpException?.status ?? 200;
	const cause = httpException?.stack ?? success;
	const message = `${msg}` + (httpException.message ? `: ${httpException.message}` : "");
	return new HTTPException(status, { message, cause });
};

export const notFoundWithMessage = (msg: string, success: any) => {
	const httpException = success as HTTPException;
	const status = httpException?.status ?? 404;
	const cause = httpException?.stack ?? success;
	const message = `${msg}` + (httpException.message ? `: ${httpException.message}` : "");
	return new HTTPException(status, { message, cause });
};

export const forbbidenWithMessage = (msg: string, success: any) => {
	const httpException = success as HTTPException;
	const status = httpException?.status ?? 403;
	const cause = httpException?.stack ?? success;
	const message = `${msg}` + (httpException.message ? `: ${httpException.message}` : "");
	return new HTTPException(status, { message, cause });
};

export const unauthorizedWithMessage = (msg: string, success: any) => {
	const httpException = success as HTTPException;
	const status = httpException?.status ?? 401;
	const cause = httpException?.stack ?? success;
	const message = `${msg}` + (httpException.message ? `: ${httpException.message}` : "");
	return new HTTPException(status, { message, cause });
};

export const badRequestWithMessage = (msg: string, success: any) => {
	const httpException = success as HTTPException;
	const status = httpException?.status ?? 400;
	const cause = httpException?.stack ?? success;
	const message = `${msg}` + (httpException.message ? `: ${httpException.message}` : "");
	return new HTTPException(status, { message, cause });
};

export const conflictRequestWithMessage = (msg: string, success: any) => {
	const httpException = success as HTTPException;
	const status = httpException?.status ?? 409;
	const cause = httpException?.stack ?? success;
	const message = `${msg}` + (httpException.message ? `: ${httpException.message}` : "");
	return new HTTPException(status, { message, cause });
};
