import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { authApi } from "~/api/auth";
import {
	consumeOAuthReturnTo,
	sanitizeOAuthErrorMessage,
} from "~/lib/oauth";

export default function OAuthRedirectPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		let cancelled = false;

		const completeOAuth = async () => {
			const error = searchParams.get("error");
			const token = searchParams.get("token");
			const returnTo = consumeOAuthReturnTo();

			if (error) {
				const message = sanitizeOAuthErrorMessage(error);
				toast.error(message);
				navigate("/login", {
					replace: true,
					state: { message, type: "error" },
				});
				return;
			}

			if (!token) {
				const message = "Thiếu access token từ OAuth callback";
				toast.error(message);
				navigate("/login", {
					replace: true,
					state: { message, type: "error" },
				});
				return;
			}

			const result = await authApi.finalizeOAuthLogin(token);
			if (cancelled) return;

			if (!result.success) {
				const message = sanitizeOAuthErrorMessage(result.message ?? null);
				toast.error(message);
				navigate("/login", {
					replace: true,
					state: { message, type: "error" },
				});
				return;
			}

			toast.success("Đăng nhập thành công!");
			navigate(returnTo, { replace: true });
		};

		void completeOAuth();

		return () => {
			cancelled = true;
		};
	}, [navigate, searchParams]);

	return (
		<main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
			<section className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl p-8 text-center">
				<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
					<Loader2 className="h-6 w-6 animate-spin text-slate-700 dark:text-slate-200" />
				</div>
				<h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
					Đang hoàn tất đăng nhập
				</h1>
				<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
					Hệ thống đang xác thực phiên OAuth và tải hồ sơ của bạn.
				</p>
			</section>
		</main>
	);
}
