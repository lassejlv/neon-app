import { AccountView } from "@neondatabase/auth-ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/$pathname")({
	component: AccountPage,
});

function AccountPage() {
	const { pathname } = Route.useParams();

	return (
		<div className="flex min-h-[calc(100dvh-3.5rem-4rem)] items-center justify-center py-8">
			<AccountView pathname={pathname} />
		</div>
	);
}
