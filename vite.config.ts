import { cloudflare } from "@cloudflare/vite-plugin";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function neonAuthWorkerCompat() {
	return {
		name: "neon-auth-worker-compat",
		applyToEnvironment(environment: { name: string }) {
			return environment.name === "ssr";
		},
		renderChunk(code: string) {
			if (!code.includes("CURRENT_TAB_CLIENT_ID = crypto.randomUUID()")) {
				return null;
			}

			return {
				code: code.replaceAll(
					"CURRENT_TAB_CLIENT_ID = crypto.randomUUID()",
					'CURRENT_TAB_CLIENT_ID = "ssr-neon-auth-tab"',
				),
			};
		},
	};
}

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		tailwindcss(),
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tanstackStart(),
		viteReact(),
		neonAuthWorkerCompat(),
	],
});

export default config;
