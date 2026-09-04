import { OrganizationView } from "@neondatabase/auth-ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/organization/$pathname")({
	component: OrganizationPage,
});

function OrganizationPage() {
	const { pathname } = Route.useParams();

	return (
		<div className="flex min-h-[calc(100dvh-3.5rem-4rem)] items-center justify-center py-8">
			<OrganizationView pathname={pathname} />
		</div>
	);
}
