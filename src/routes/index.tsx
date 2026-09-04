import { AuthLoading, SignedIn, SignedOut } from "@neondatabase/auth-ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Database, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardDescription,
	CardPanel,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Separator } from "#/components/ui/separator.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";
import { UserProfile } from "#/components/user-profile.tsx";

export const Route = createFileRoute("/")({ component: Home });

const features = [
	{
		icon: ShieldCheck,
		title: "Neon Auth built in",
		description:
			"Sign-in, sign-up, password reset, and Google OAuth. Sessions sync automatically with the router.",
	},
	{
		icon: Database,
		title: "Postgres out of the box",
		description:
			"Every user lands in neon_auth.user. Query it from a server function with @neondatabase/serverless.",
	},
	{
		icon: Zap,
		title: "Edge-ready on Cloudflare",
		description:
			"TanStack Start renders on Workers. No Node server to manage, deploys with vite build + wrangler.",
	},
];

const steps = [
	{
		n: "01",
		title: "Create an account",
		description: "Sign up with email or Google. No setup, no env juggling.",
	},
	{
		n: "02",
		title: "Get a session",
		description: "Neon Auth issues a session cookie the app reads everywhere.",
	},
	{
		n: "03",
		title: "Read your row",
		description: "The dashboard below queries neon_auth.user for your id.",
	},
];

function Home() {
	return (
		<div className="mx-auto max-w-3xl">
			<AuthLoading>
				<div className="space-y-3">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-64 w-full" />
				</div>
			</AuthLoading>

			<SignedIn>
				<div className="space-y-6">
					<div>
						<h1 className="font-heading font-semibold text-2xl tracking-tight">
							You are signed in
						</h1>
						<p className="mt-1 text-muted-foreground text-sm">
							Session from Neon Auth, profile row from Neon Postgres.
						</p>
					</div>
					<UserProfile />
				</div>
			</SignedIn>

			<SignedOut>
				<div className="space-y-16 py-8">
					{/* Hero */}
					<section className="text-center">
						<Badge variant="secondary">
							TanStack Start · Neon Auth · Cloudflare
						</Badge>
						<h1 className="mx-auto mt-5 max-w-xl font-heading font-semibold text-4xl leading-[1.1] tracking-tight sm:text-5xl">
							Auth + Postgres, running on the edge
						</h1>
						<p className="mx-auto mt-4 max-w-md text-muted-foreground">
							A minimal starter with sign-in, sessions, and a live database row
							— no boilerplate to delete.
						</p>
						<div className="mt-7 flex items-center justify-center gap-2">
							<Button
								render={
									<Link params={{ pathname: "sign-up" }} to="/auth/$pathname" />
								}
								size="lg"
							>
								Get started
								<ArrowRight />
							</Button>
							<Button
								render={
									<Link params={{ pathname: "sign-in" }} to="/auth/$pathname" />
								}
								size="lg"
								variant="outline"
							>
								Sign in
							</Button>
						</div>
						<p className="mt-5 font-mono text-muted-foreground text-xs">
							bun install && bun --bun run dev
						</p>
					</section>

					{/* Features */}
					<section className="grid gap-3 sm:grid-cols-3">
						{features.map((f) => (
							<Card key={f.title}>
								<CardPanel className="space-y-2.5 p-5">
									<f.icon className="size-5 text-muted-foreground" />
									<CardTitle className="text-base">{f.title}</CardTitle>
									<CardDescription>{f.description}</CardDescription>
								</CardPanel>
							</Card>
						))}
					</section>

					{/* How it works */}
					<section>
						<h2 className="font-heading font-semibold text-lg tracking-tight">
							How it works
						</h2>
						<p className="mt-1 text-muted-foreground text-sm">
							Three steps from landing page to live user row.
						</p>
						<div className="mt-5 divide-y rounded-2xl border bg-card">
							{steps.map((s) => (
								<div className="flex gap-4 p-5" key={s.n}>
									<span className="font-mono text-muted-foreground text-sm">
										{s.n}
									</span>
									<div>
										<p className="font-medium text-sm">{s.title}</p>
										<p className="mt-0.5 text-muted-foreground text-sm">
											{s.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</section>

					{/* CTA */}
					<section>
						<Card>
							<CardPanel className="flex flex-col items-center p-8 text-center">
								<CardTitle>Try it with your own account</CardTitle>
								<CardDescription className="mt-1.5 max-w-sm">
									Sign up, land back here, and you'll see your session plus your
									neon_auth.user row.
								</CardDescription>
								<Button
									className="mt-5"
									render={
										<Link
											params={{ pathname: "sign-up" }}
											to="/auth/$pathname"
										/>
									}
								>
									Create an account
									<ArrowRight />
								</Button>
							</CardPanel>
						</Card>
						<div className="mt-10 flex items-center justify-center gap-4 text-muted-foreground text-xs">
							<Link params={{ pathname: "sign-in" }} to="/auth/$pathname">
								Sign in
							</Link>
							<Separator orientation="vertical" />
							<Link params={{ pathname: "settings" }} to="/account/$pathname">
								Account
							</Link>
							<Separator orientation="vertical" />
							<span className="font-mono">neon-app</span>
						</div>
					</section>
				</div>
			</SignedOut>
		</div>
	);
}
