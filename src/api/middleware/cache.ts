// node-cache
import { MiddlewareHandler } from "hono";
import NodeCache from "node-cache";

const cache = new NodeCache();

type CacheParams = {
	name: string;
	ttl: number;
};

export const createCache = (params: CacheParams): MiddlewareHandler => {
	const { name, ttl } = params;
	return async (c, next) => {
		// TODO: set cache key through options
		const key = `${name}:${c.req.url}`;
		const cached = cache.get(key) as Response | undefined;
		if (cached) {
			console.info(`Cache hit for ${key}`);
			c.res = new Response(cached.body, {
				status: cached.status,
				statusText: cached.statusText,
				headers: cached.headers,
			});
			return;
		}

		await next();

		// Don't cache errors
		if (!c.res.ok) {
			return;
		}

		const res = c.res.clone();
		const body = await res.text();
		const headers = Array.from(res.headers.entries());
		cache.set(
			key,
			{
				body,
				headers,
				status: res.status,
				statusText: res.statusText,
			},
			ttl
		);
	};
};

export const longCache = (name: string) => createCache({ name, ttl: 60 * 60 * 24 * 7 });
export const shortCache = (name: string) => createCache({ name, ttl: 60 * 5 });
