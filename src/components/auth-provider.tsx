import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { authClient } from "#/lib/auth.ts";

function AuthLink({
	href,
	className,
	children,
}: {
	href: string;
	className?: string;
	children?: ReactNode;
}) {
	const router = useRouter();

	return (
		<a
			className={className}
			href={href}
			onClick={(event) => {
				event.preventDefault();
				router.history.push(href);
			}}
		>
			{children}
		</a>
	);
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const router = useRouter();

	return (
		<NeonAuthUIProvider
			Link={AuthLink}
			authClient={authClient}
			basePath="/auth"
			credentials={{ forgotPassword: true }}
			navigate={(href) => {
				router.history.push(href);
			}}
			onSessionChange={() => {
				void router.invalidate();
			}}
			organization={{}}
			redirectTo="/"
			replace={(href) => {
				router.history.replace(href);
			}}
			social={{ providers: ["google"] }}
		>
			{children}
			<Toaster position="bottom-right" />
		</NeonAuthUIProvider>
	);
}
