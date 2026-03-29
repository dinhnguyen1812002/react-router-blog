import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

const SUPPORTED_PROVIDERS = new Set(["google", "github", "discord"]);

const buildRedirectQuery = (search: string, hash: string): string => {
	const query = new URLSearchParams(search);
	const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
	const next = new URLSearchParams();

	const error = query.get("error") || hashParams.get("error");
	const errorDescription =
		query.get("error_description") || hashParams.get("error_description");
	const token =
		query.get("token") ||
		query.get("access_token") ||
		hashParams.get("access_token");

	if (error) {
		next.set("error", errorDescription || error);
	}

	if (token) {
		next.set("token", token);
	}

	return next.toString();
};

export default function OAuthCallbackPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { provider } = useParams();

	useEffect(() => {
		if (typeof window === "undefined") return;

		if (!provider || !SUPPORTED_PROVIDERS.has(provider)) {
			navigate("/login", {
				replace: true,
				state: { message: "Unsupported OAuth provider", type: "error" },
			});
			return;
		}

		const payload = {
			type: "OAUTH_CALLBACK",
			provider,
			query: buildRedirectQuery(location.search, location.hash),
		};

		if (window.opener && window.opener !== window) {
			window.opener.postMessage(payload, window.location.origin);
			window.setTimeout(() => window.close(), 250);
			return;
		}

		navigate(`/oauth2/redirect?${payload.query}`, { replace: true });
	}, [location.hash, location.search, navigate, provider]);

	return (
		<main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-6">
			<section className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center">
				<h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
					Dang chuyen huong dang nhap...
				</h1>
				<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
					He thong dang hoan tat xac thuc OAuth va dong bo phien dang nhap.
				</p>
			</section>
		</main>
	);
}
