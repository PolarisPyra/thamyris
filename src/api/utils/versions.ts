import { HTTPException } from "hono/http-exception";

import { Connection } from "../db";
import { DB } from "../types";
import { DaphnisUserOptionVersionKey } from "../types/db";
import { GameVersions } from "../types/jwt";

const getInitVersion = async (
	userId: number,
	versionKey: DaphnisUserOptionVersionKey,
	conn: Connection
): Promise<number> => {
	switch (versionKey) {
		case DaphnisUserOptionVersionKey.Chunithm: {
			const result = await conn.select<{ version: number }>(
				`SELECT MAX(version) AS version FROM chuni_profile_data WHERE user = ?`,
				[userId]
			);
			return result[0]?.version ?? -1; // grab the version property from the o
		}
		case DaphnisUserOptionVersionKey.Ongeki: {
			const result = await conn.select<{ version: number }>(
				`SELECT MAX(version) AS version FROM ongeki_profile_data WHERE user = ?`,
				[userId]
			);
			return result[0]?.version ?? -1;
		}
		default:
			throw new HTTPException(500, { message: "Invalid version key. Title not supported" });
	}
};

/**
 * Retrieves the set of user game versions.
 * Defaults a version to -1 if not set.
 */
export const getUserGameVersions = async (userId: number, conn: Connection): Promise<GameVersions> => {
	try {
		const versionKeys = Object.values(DaphnisUserOptionVersionKey);
		const versions = await conn.select<DB.DaphnisUserOption>(
			`
                SELECT \`key\`, value
                FROM daphnis_user_option
                WHERE user = ?
                    AND \`key\` IN (
                        ${versionKeys.map((key) => `'${key}'`).join(",")}
                    )
            `,
			[userId]
		);

		// Ensure we have values for all version keys
		const missingVersionKeys = versionKeys.filter((key) => !versions.some((v) => v.key === key));

		// Insert missing version keys
		for (const key of missingVersionKeys) {
			const version = await getInitVersion(userId, key, conn);
			versions.push({ key, value: version } as DB.DaphnisUserOption);
			await conn.query(
				`
                    INSERT INTO daphnis_user_option (user, \`key\`, value)
                        VALUES (?, ?, ?)
                `,
				[userId, key, version]
			);
		}

		const gameVersions: GameVersions = versionKeys.reduce((acc, title) => {
			const { value } = versions.find((v) => v.key === title) ?? {};
			if (value) {
				acc[title] = value as number;
			}
			return acc;
		}, {} as GameVersions);

		return gameVersions;
	} catch (cause) {
		throw new HTTPException(500, { message: "Failed to fetch user versions", cause });
	}
};
