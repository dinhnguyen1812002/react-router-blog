import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertCircle,
	CheckCircle,
	Eye,
	EyeOff,
	Loader2,
	Lock,
	LogIn,
	Mail,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { OAuthButtons } from "~/components/auth/OAuthButtons";
import { useAuth } from "~/hooks/useAuth";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Login - Blog Community" },
		{
			name: "description",
			content: "Sign in to your account to access your personalized dashboard.",
		},
	];
}

const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must be at least 8 characters"),
	rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

function FieldError({ message }: { message: string }) {
	return (
		<motion.p
			initial={{ opacity: 0, y: -4 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -4 }}
			className="mt-2 text-sm text-red-600 dark:text-red-400"
			role="alert"
		>
			{message}
		</motion.p>
	);
}

function Banner({
	type,
	message,
}: {
	type: "error" | "success";
	message: string;
}) {
	const isError = type === "error";
	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			className={`mb-6 p-4 rounded-lg border flex items-center gap-2 ${
				isError
					? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
					: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
			}`}
		>
			{isError ? (
				<AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
			) : (
				<CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
			)}
			<p
				className={`text-sm ${
					isError
						? "text-red-700 dark:text-red-400"
						: "text-green-700 dark:text-green-400"
				}`}
			>
				{message}
			</p>
		</motion.div>
	);
}

function Divider({ label }: { label: string }) {
	return (
		<div className="relative my-8">
			<div className="absolute inset-0 flex items-center">
				<div className="w-full border-t border-slate-200 dark:border-slate-700" />
			</div>
			<div className="relative flex justify-center text-sm">
				<span className="px-4 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
					{label}
				</span>
			</div>
		</div>
	);
}

export default function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();

	// Destructure only what's needed; assume clearError is stable (memoized in useAuth)
	const { login, isAuthenticated, isLoading, error, clearError } = useAuth();

	const [feedback, setFeedback] = useState<{
		type: "error" | "success";
		message: string;
	} | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, touchedFields },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		// onBlur triggers validation when user leaves a field.
		// onChange re-validates after the first submission attempt or touch.
		mode: "onBlur",
		reValidateMode: "onChange",
	});

	// Show one-time message passed via location state (e.g. post-registration).
	// Guard with a ref-like check to avoid looping.
	useEffect(() => {
		const msg = location.state?.message as string | undefined;
		const type =
			(location.state?.type as "error" | "success" | undefined) ?? "success";
		if (!msg) return;

		setFeedback({ type, message: msg });

		if (type === "error") {
			toast.error(msg);
		} else {
			toast.success(msg);
		}

		// Clear the state so refreshing doesn't re-show the banner
		navigate(location.pathname, { replace: true, state: null });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Intentionally run once on mount only

	// Redirect authenticated users away from the login page
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	// Clear auth errors on unmount
	useEffect(() => {
		return () => {
			clearError();
		};
	}, [clearError]);

	const onSubmit = useCallback(
		async (data: LoginForm) => {
			clearError();
			setFeedback(null);

			const result = await login(data);

			if (result.success) {
				toast.success("Welcome back!");
				// Navigation is handled by the isAuthenticated effect above
			} else {
				toast.error(result.error ?? "Login failed. Please try again.");
			}
		},
		[login, clearError],
	);

	const handleOAuthSuccess = useCallback(() => {
		toast.success("Welcome back!");
		// Navigation handled by isAuthenticated effect
	}, []);

	const handleOAuthError = useCallback((oauthError: string) => {
		toast.error(oauthError || "OAuth login failed. Please try again.");
	}, []);

	// RHF tracks touched fields natively via formState.touchedFields
	const shouldShowError = (field: keyof LoginForm) =>
		Boolean(touchedFields[field] && errors[field]);

	// Disable the button while an async operation is in-flight.
	// Prefer isSubmitting (RHF) as the primary signal; isLoading covers
	// auth-store side-effects that happen after the promise resolves.
	const isBusy = isSubmitting || isLoading;

	// ── Render ────────────────────────────────────────────────────────────────

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex">
			{/* ── Left panel (desktop only) ───────────────────────────────────── */}
			<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-slate-800/95 z-10" />
				<img
					src="/login.jpg"
					alt="Modern workspace"
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="relative z-20 flex flex-col justify-center px-12 text-white">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="max-w-md"
					>
						<div className="mb-8">
							<div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
								<LogIn className="h-8 w-8 text-white" />
							</div>
						</div>
						<h2 className="text-4xl font-bold mb-4 leading-tight text-white">
							Welcome back to your workspace
						</h2>
						<p className="text-lg text-slate-300 leading-relaxed">
							Sign in to access your personalized dashboard, manage your
							projects, and collaborate with your team.
						</p>
						<div className="mt-12 space-y-4">
							{[
								"Secure authentication",
								"Fast and reliable",
								"24/7 support available",
							].map((feature, index) => (
								<motion.div
									key={feature}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
									className="flex items-center space-x-3"
								>
									<div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
										<CheckCircle className="w-5 h-5 text-white" />
									</div>
									<span className="text-slate-200">{feature}</span>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>
			</div>

			<div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-md"
				>
					{/* Mobile logo */}
					<div className="mb-8 lg:hidden text-center">
						<div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 dark:bg-white rounded-xl mb-4">
							<LogIn className="w-7 h-7 text-white dark:text-slate-900" />
						</div>
					</div>

					{/* Heading */}
					<div className="mb-8">
						<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
							Welcome Back
						</h1>
						<p className="text-slate-600 dark:text-slate-400">
							Sign in to continue to your account
						</p>
					</div>

					{/* Banners */}
					<AnimatePresence>
						{error && <Banner key="error" type="error" message={error} />}
					</AnimatePresence>
					<AnimatePresence>
						{feedback && (
							<Banner
								key={feedback.type}
								type={feedback.type}
								message={feedback.message}
							/>
						)}
					</AnimatePresence>

					{/* Form */}
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-5"
						noValidate
					>
						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
							>
								Email Address
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-slate-400" />
								</div>
								<input
									type="email"
									id="email"
									{...register("email")}
									className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 ${
										shouldShowError("email")
											? "border-red-300 focus:border-red-500 focus:ring-red-500"
											: "border-slate-300 dark:border-slate-600 focus:border-slate-500 focus:ring-slate-500"
									}`}
									placeholder="you@example.com"
									aria-label="Email Address"
									aria-invalid={shouldShowError("email")}
									aria-describedby={
										shouldShowError("email") ? "email-error" : undefined
									}
								/>
							</div>
							<AnimatePresence>
								{shouldShowError("email") && (
									<FieldError message={errors.email!.message!} />
								)}
							</AnimatePresence>
						</div>

						{/* Password */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
							>
								Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-slate-400" />
								</div>
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									{...register("password")}
									className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 ${
										shouldShowError("password")
											? "border-red-300 focus:border-red-500 focus:ring-red-500"
											: "border-slate-300 dark:border-slate-600 focus:border-slate-500 focus:ring-slate-500"
									}`}
									placeholder="••••••••"
									aria-label="Password"
									aria-invalid={shouldShowError("password")}
									aria-describedby={
										shouldShowError("password") ? "password-error" : undefined
									}
								/>
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
									aria-label={showPassword ? "Hide password" : "Show password"}
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
							<AnimatePresence>
								{shouldShowError("password") && (
									<FieldError message={errors.password!.message!} />
								)}
							</AnimatePresence>
						</div>

						{/* Remember me / Forgot password */}
						<div className="flex items-center justify-between flex-wrap gap-2">
							<div className="flex items-center">
								<input
									type="checkbox"
									id="rememberMe"
									{...register("rememberMe")}
									className="h-4 w-4 text-slate-700 border-slate-300 rounded focus:ring-slate-500 focus:ring-2 transition-colors cursor-pointer"
								/>
								<label
									htmlFor="rememberMe"
									className="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
								>
									Remember me
								</label>
							</div>
							<Link
								to="/forgot-password"
								className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
							>
								Forgot password?
							</Link>
						</div>

						{/* Submit */}
						<button
							type="submit"
							disabled={isBusy}
							className="w-full bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 text-white dark:text-slate-900 font-semibold py-3 px-4 rounded-lg hover:from-slate-800 hover:to-slate-950 dark:hover:from-slate-100 dark:hover:to-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
							aria-label={isBusy ? "Signing in…" : "Sign in"}
						>
							{isBusy ? (
								<>
									<Loader2 className="w-5 h-5 mr-2 animate-spin" />
									Signing in…
								</>
							) : (
								<>
									<LogIn className="w-5 h-5 mr-2" />
									Sign In
								</>
							)}
						</button>
					</form>

					{/* OAuth */}
					<Divider label="Or continue with" />
					<OAuthButtons
						onSuccess={handleOAuthSuccess}
						onError={handleOAuthError}
					/>

					{/* Register CTA */}
					<Divider label="Don't have an account?" />
					<Link
						to="/register"
						className="block mt-4 w-full text-center bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 px-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
					>
						Create a new account
					</Link>
				</motion.div>
			</div>
		</div>
	);
}
