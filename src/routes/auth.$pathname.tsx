import { AuthView } from "@neondatabase/auth-ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/$pathname")({
	component: AuthPage,
});

function AuthPage() {
	const { pathname } = Route.useParams();

	return (
		<div className="flex min-h-[calc(100dvh-3.5rem-4rem)] items-center justify-center py-8">
			<AuthView pathname={pathname} />
		</div>
	);
}
