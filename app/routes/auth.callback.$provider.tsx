import { useEffect } from "react";
import { useLocation, useParams } from "react-router";

const SUPPORTED_PROVIDERS = new Set(["google", "github", "discord"]);

export default function OAuthCallbackPage() {
  const location = useLocation();
  const { provider } = useParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const opener = window.opener;
    if (!opener) return;

    const query = new URLSearchParams(location.search);
    const hash = new URLSearchParams(location.hash.replace(/^#/, ""));

    const error = query.get("error") || hash.get("error");
    const errorDescription =
      query.get("error_description") || hash.get("error_description");
    const code = query.get("code") || hash.get("code");
    const token = query.get("access_token") || hash.get("access_token");
    const isProviderSupported = provider
      ? SUPPORTED_PROVIDERS.has(provider)
      : false;

    if (!isProviderSupported) {
      opener.postMessage(
        { type: "OAUTH_ERROR", error: "Unsupported OAuth provider" },
        window.location.origin,
      );
    } else if (error) {
      opener.postMessage(
        { type: "OAUTH_ERROR", error: errorDescription || error },
        window.location.origin,
      );
    } else if (code || token) {
      opener.postMessage(
        { type: "OAUTH_SUCCESS", code, token, provider },
        window.location.origin,
      );
    } else {
      opener.postMessage(
        { type: "OAUTH_ERROR", error: "No OAuth code/token received" },
        window.location.origin,
      );
    }

    window.setTimeout(() => window.close(), 250);
  }, [location.hash, location.search, provider]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black p-6">
      <section className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Dang xu ly dang nhap OAuth...
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Neu cua so khong tu dong dong, ban co the dong thu cong va quay lai
          tab truoc do.
        </p>
      </section>
    </main>
  );
}
