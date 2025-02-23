import { db } from "@/api";

export async function getUserVersionChunithm(userId: unknown): Promise<string> {
	if (typeof userId !== "number") {
		throw new Error("userId must be a number");
	}

	try {
		const [versionResult] = await db.query(
			`SELECT value 
       FROM daphnis_user_option 
       WHERE user = ? AND \`key\` = 'chunithm_version'`,
			[userId]
		);
		return versionResult?.value || "No chunithm";
	} catch (error) {
		console.error("Error fetching user version:", error);
		throw error;
	}
}

export async function getUserVersionOngeki(userId: unknown): Promise<string> {
	try {
		const [versionResult] = await db.query(
			`SELECT value 
       FROM daphnis_user_option 
       WHERE user = ? AND \`key\` = 'ongeki_version'`,
			[userId]
		);
		return versionResult?.value || "No ongeki";
	} catch (error) {
		console.error("Error fetching user version:", error);
		throw error;
	}
}
