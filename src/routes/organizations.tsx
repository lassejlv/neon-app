import { SignedIn, SignedOut } from "@neondatabase/auth-ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { authClient } from "#/lib/auth.ts";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardDescription,
	CardPanel,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";

export const Route = createFileRoute("/organizations")({
	component: Organizations,
});

function slugify(name: string) {
	return name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function Organizations() {
	const { data: organizations, isPending } = authClient.useListOrganizations();
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [creating, setCreating] = useState(false);

	async function handleCreate(event: FormEvent) {
		event.preventDefault();
		const trimmed = name.trim();
		if (!trimmed || creating) {
			return;
		}

		setCreating(true);
		setError(null);
		const { error: createError } = await authClient.organization.create({
			name: trimmed,
			slug: slugify(trimmed),
		});
		setCreating(false);

		if (createError) {
			setError(createError.message ?? "Could not create organization");
			return;
		}
		setName("");
	}

	async function handleSwitch(organizationId: string) {
		setError(null);
		const { error: switchError } = await authClient.organization.setActive({
			organizationId,
		});
		if (switchError) {
			setError(switchError.message ?? "Could not switch organization");
		}
	}

	return (
		<div className="mx-auto max-w-3xl space-y-6">
			<div>
				<h1 className="font-heading font-semibold text-2xl tracking-tight">
					Organizations
				</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Create an organization, switch between them, and manage members and
					invitations.
				</p>
			</div>

			<SignedOut>
				<Card>
					<CardPanel className="flex flex-col items-center p-8 text-center">
						<CardTitle>Sign in to manage organizations</CardTitle>
						<CardDescription className="mt-1.5 max-w-sm">
							Organizations belong to signed-in users.
						</CardDescription>
						<Button
							className="mt-5"
							render={
								<Link params={{ pathname: "sign-in" }} to="/auth/$pathname" />
							}
						>
							Sign in
						</Button>
					</CardPanel>
				</Card>
			</SignedOut>

			<SignedIn>
				<Card>
					<CardPanel className="space-y-4 p-6">
						<div>
							<CardTitle className="text-base">Create organization</CardTitle>
							<CardDescription>
								Members and invitations are managed after creation.
							</CardDescription>
						</div>
						<form
							className="flex flex-col gap-3 sm:flex-row"
							onSubmit={handleCreate}
						>
							<div className="grid flex-1 gap-1.5">
								<Label htmlFor="org-name">Name</Label>
								<Input
									autoComplete="organization"
									id="org-name"
									onChange={(event) => setName(event.target.value)}
									placeholder="Acme Inc"
									value={name}
								/>
							</div>
							<Button
								className="sm:self-end"
								disabled={creating || name.trim().length === 0}
								type="submit"
							>
								{creating ? "Creating…" : "Create"}
							</Button>
						</form>
						{error ? (
							<p className="text-destructive-foreground text-sm">{error}</p>
						) : null}
					</CardPanel>
				</Card>

				{isPending ? (
					<div className="space-y-3">
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-20 w-full" />
					</div>
				) : organizations && organizations.length > 0 ? (
					<div className="space-y-3">
						{organizations.map((organization) => (
							<Card key={organization.id}>
								<CardPanel className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
									<div className="min-w-0">
										<CardTitle className="truncate text-base">
											{organization.name}
										</CardTitle>
										<CardDescription className="font-mono">
											{organization.slug}
										</CardDescription>
									</div>
									<div className="flex shrink-0 items-center gap-2">
										<Button
											onClick={() => void handleSwitch(organization.id)}
											variant="outline"
										>
											Switch
										</Button>
										<Button
											render={
												<Link
													to="/organization/$pathname"
													params={{ pathname: "members" }}
												/>
											}
										>
											Manage
										</Button>
									</div>
								</CardPanel>
							</Card>
						))}
					</div>
				) : (
					<Card>
						<CardPanel className="p-6 text-center text-muted-foreground text-sm">
							You don&apos;t belong to any organization yet. Create your first
							one above.
						</CardPanel>
					</Card>
				)}
			</SignedIn>
		</div>
	);
}
