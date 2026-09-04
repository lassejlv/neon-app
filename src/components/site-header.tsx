import { SignedIn, SignedOut, UserButton } from "@neondatabase/auth-ui";
import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "#/components/ui/button.tsx";

export function SiteHeader() {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	if (pathname.startsWith("/auth")) {
		return null;
	}

	return (
		<header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
			<div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<Button
					className="font-heading font-semibold"
					render={<Link to="/" />}
					variant="ghost"
				>
					Playground
				</Button>
				<div className="flex items-center gap-2">
					<SignedOut>
						<Button
							render={
								<Link params={{ pathname: "sign-in" }} to="/auth/$pathname" />
							}
							variant="ghost"
						>
							Sign in
						</Button>
						<Button
							render={
								<Link params={{ pathname: "sign-up" }} to="/auth/$pathname" />
							}
						>
							Get started
						</Button>
					</SignedOut>
					<SignedIn>
						<UserButton size="icon" />
					</SignedIn>
				</div>
			</div>
		</header>
	);
}
