import { env } from "cloudflare:workers";
import { neon } from "@neondatabase/serverless";
import { createServerFn } from "@tanstack/react-start";

export type DbUser = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
	createdAt: string;
	updatedAt: string;
	role: string | null;
};

export const getDbUser = createServerFn({ method: "GET" })
	.validator((data: { userId: string }) => data)
	.handler(async ({ data }) => {
		const databaseUrl = env.DATABASE_URL;

		if (!databaseUrl) {
			throw new Error("Missing DATABASE_URL");
		}

		const sql = neon(databaseUrl);
		const rows = await sql`
			SELECT
				id,
				name,
				email,
				"emailVerified",
				image,
				"createdAt",
				"updatedAt",
				role
			FROM neon_auth."user"
			WHERE id = ${data.userId}
			LIMIT 1
		`;

		const row = rows[0];

		if (!row) {
			return null;
		}

		return {
			id: String(row.id),
			name: String(row.name),
			email: String(row.email),
			emailVerified: Boolean(row.emailVerified),
			image: row.image ? String(row.image) : null,
			createdAt: String(row.createdAt),
			updatedAt: String(row.updatedAt),
			role: row.role ? String(row.role) : null,
		} satisfies DbUser;
	});
