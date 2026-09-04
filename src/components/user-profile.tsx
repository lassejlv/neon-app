import { useEffect, useState } from "react";
import { authClient } from "#/lib/auth.ts";
import { getDbUser } from "#/lib/get-user.ts";
import type { DbUser } from "#/lib/get-user.ts";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "#/components/ui/avatar.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import {
	Card,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Separator } from "#/components/ui/separator.tsx";
import { Skeleton } from "#/components/ui/skeleton.tsx";

function initials(name: string) {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");
}

function Field({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:items-baseline">
			<dt className="font-mono text-muted-foreground text-xs tracking-wide">
				{label}
			</dt>
			<dd className="break-all font-mono text-sm">{value}</dd>
		</div>
	);
}

export function UserProfile() {
	const { data, isPending } = authClient.useSession();
	const [dbUser, setDbUser] = useState<DbUser | null>(null);
	const [dbError, setDbError] = useState<string | null>(null);
	const [dbPending, setDbPending] = useState(false);

	const user = data?.user;
	const session = data?.session;

	useEffect(() => {
		if (!user?.id) {
			setDbUser(null);
			return;
		}

		let cancelled = false;
		setDbPending(true);
		setDbError(null);

		void getDbUser({ data: { userId: user.id } })
			.then((row) => {
				if (!cancelled) {
					setDbUser(row);
				}
			})
			.catch((error: unknown) => {
				if (!cancelled) {
					setDbError(
						error instanceof Error
							? error.message
							: "Could not load database row",
					);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setDbPending(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [user?.id]);

	if (isPending || !user || !session) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-4 w-56" />
				</CardHeader>
				<CardPanel className="space-y-3">
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-32 w-full" />
				</CardPanel>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start gap-4">
					<Avatar className="size-12">
						{user.image ? (
							<AvatarImage alt={user.name} src={user.image} />
						) : null}
						<AvatarFallback>{initials(user.name || user.email)}</AvatarFallback>
					</Avatar>
					<div className="min-w-0">
						<CardTitle>{user.name || "Account"}</CardTitle>
						<CardDescription>{user.email}</CardDescription>
					</div>
					<Badge variant={user.emailVerified ? "success" : "warning"}>
						{user.emailVerified ? "Verified" : "Unverified"}
					</Badge>
				</div>
			</CardHeader>
			<CardPanel className="space-y-6">
				<div>
					<h2 className="mb-3 font-heading font-medium text-sm">Session</h2>
					<dl className="space-y-3">
						<Field label="user id" value={user.id} />
						<Field label="session id" value={session.id} />
						<Field label="expires" value={String(session.expiresAt)} />
					</dl>
				</div>
				<Separator />
				<div>
					<h2 className="mb-3 font-heading font-medium text-sm">
						neon_auth.user
					</h2>
					{dbPending ? (
						<div className="space-y-3">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-4/5" />
							<Skeleton className="h-4 w-3/5" />
						</div>
					) : dbError ? (
						<p className="text-destructive-foreground text-sm">{dbError}</p>
					) : dbUser ? (
						<dl className="space-y-3">
							<Field label="name" value={dbUser.name} />
							<Field label="email" value={dbUser.email} />
							<Field
								label="emailVerified"
								value={String(dbUser.emailVerified)}
							/>
							<Field label="role" value={dbUser.role ?? "null"} />
							<Field label="createdAt" value={dbUser.createdAt} />
							<Field label="updatedAt" value={dbUser.updatedAt} />
						</dl>
					) : (
						<p className="text-muted-foreground text-sm">
							No matching row in neon_auth.user yet.
						</p>
					)}
				</div>
			</CardPanel>
		</Card>
	);
}
