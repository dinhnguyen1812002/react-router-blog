import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertCircle,
	Check,
	CheckCircle2,
	Eye,
	EyeOff,
	Loader2,
	Lock,
	Mail,
	User,
	UserPlus,
	X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { OAuthButtons } from "~/components/auth/OAuthButtons";
import { useAuth } from "~/hooks/useAuth";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Register - Blog Community" },
		{
			name: "description",
			content: "Create your account to join our community.",
		},
	];
}

const registerSchema = z
	.object({
		fullName: z
			.string()
			.min(1, "Full name is required")
			.min(2, "Full name must be at least 2 characters")
			.regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
		email: z
			.string()
			.min(1, "Email is required")
			.email("Please enter a valid email address"),
		password: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must be at least 8 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/,
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@#$%^&+=!)",
			),
		confirmPassword: z.string().min(1, "Please confirm your password"),
		agreeToTerms: z.boolean().refine((val) => val === true, {
			message: "You must agree to the terms and conditions",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const navigate = useNavigate();
	const {
		register: registerUser,
		isAuthenticated,
		isLoading,
		error,
		clearError,
	} = useAuth();

	const {
		register: registerField,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
		trigger,
	} = useForm<RegisterForm>({
		resolver: zodResolver(registerSchema),
		mode: "onBlur",
		reValidateMode: "onChange",
	});

	// State for password visibility
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	// Clear error when component unmounts
	useEffect(() => {
		return () => clearError();
	}, [clearError]);

	// Real-time validation state
	const passwordValue = watch("password") || "";
	const confirmValue = watch("confirmPassword") || "";

	const hasLower = /[a-z]/.test(passwordValue);
	const hasUpper = /[A-Z]/.test(passwordValue);
	const hasDigit = /[0-9]/.test(passwordValue);
	const hasSpecial = /[@#$%^&+=!]/.test(passwordValue);
	const noSpace = !/\s/.test(passwordValue);
	const minLen = passwordValue.length >= 8;

	// Password strength calculation
	const passwordStrength = {
		strength: Math.round(
			(((hasLower ? 1 : 0) +
				(hasUpper ? 1 : 0) +
				(hasDigit ? 1 : 0) +
				(hasSpecial ? 1 : 0) +
				(noSpace ? 1 : 0) +
				(minLen ? 1 : 0)) *
				100) /
				6,
		),
		label:
			passwordValue.length === 0
				? ""
				: passwordValue.length < 8
					? "Weak"
					: (hasLower ? 1 : 0) +
								(hasUpper ? 1 : 0) +
								(hasDigit ? 1 : 0) +
								(hasSpecial ? 1 : 0) +
								(noSpace ? 1 : 0) >=
							4
						? "Strong"
						: "Medium",
		color:
			passwordValue.length === 0
				? "bg-gray-300"
				: passwordValue.length < 8
					? "bg-red-500"
					: (hasLower ? 1 : 0) +
								(hasUpper ? 1 : 0) +
								(hasDigit ? 1 : 0) +
								(hasSpecial ? 1 : 0) +
								(noSpace ? 1 : 0) >=
							4
						? "bg-green-500"
						: "bg-yellow-500",
	};

	// Ensure confirm password validation re-runs when either field changes
	useEffect(() => {
		trigger(["password", "confirmPassword"]);
	}, [passwordValue, confirmValue, trigger]);

	const handleBlur = async (fieldName: keyof RegisterForm) => {
		setTouchedFields((prev) => new Set(prev).add(fieldName));
		await trigger(fieldName);
	};

	const onSubmit = async (data: RegisterForm) => {
		const { confirmPassword, agreeToTerms, ...registerData } = data;
		clearError();

		const result = await registerUser({
			username: registerData.fullName,
			email: registerData.email,
			password: registerData.password,
		});

		if (result.success) {
			if (result.autoLogin) {
				toast.success("Registration successful! Welcome to our community.");
			} else {
				toast.success("Registration successful! Please log in.");
				navigate("/login", {
					state: { message: "Registration successful! Please log in." },
				});
			}
		} else {
			toast.error(result.error || "Registration failed. Please try again.");
		}
	};

	const onSwitchToLogin = () => {
		navigate("/login");
	};

	const handleOAuthSuccess = (user: any) => {
		toast.success("Registration successful! Welcome to our community.");
	};

	const handleOAuthError = (error: string) => {
		toast.error(error || "OAuth registration failed. Please try again.");
	};

	const shouldShowError = (fieldName: keyof RegisterForm) => {
		return touchedFields.has(fieldName) && errors[fieldName];
	};

	const passwordRequirements = [
		{ label: "At least 8 characters", met: minLen },
		{ label: "One lowercase letter", met: hasLower },
		{ label: "One uppercase letter", met: hasUpper },
		{ label: "One number", met: hasDigit },
		{ label: "One special character (@#$%^&+=!)", met: hasSpecial },
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex">
			{/* Left Side - Image/Branding (Hidden on mobile) */}
			<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 to-slate-800/95 z-10"></div>
				<img
					src="/register.jpg"
					alt="Team collaboration"
					className="absolute inset-0 w-full h-full object-cover opacity-50"
				/>
				<div className="relative z-20 flex flex-col justify-center px-12 text-white">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="max-w-md"
					>
						<h2 className="text-4xl font-bold mb-4 leading-tight">
							Start your journey with us
						</h2>
						<p className="text-lg text-slate-300 leading-relaxed mb-8">
							Join thousands of professionals who trust our platform to
							streamline their workflow and boost productivity.
						</p>
						<div className="space-y-6">
							{[
								{
									step: "1",
									title: "Create your account",
									desc: "Quick and easy registration process",
								},
								{
									step: "2",
									title: "Set up your workspace",
									desc: "Customize your dashboard to fit your needs",
								},
								{
									step: "3",
									title: "Start collaborating",
									desc: "Invite your team and begin working together",
								},
							].map((item, index) => (
								<motion.div
									key={item.step}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
									className="flex items-start space-x-4"
								>
									<div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
										<span className="text-xl font-bold">{item.step}</span>
									</div>
									<div>
										<h3 className="font-semibold text-white mb-1">
											{item.title}
										</h3>
										<p className="text-slate-300 text-sm">{item.desc}</p>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>
			</div>

			{/* Right Side - Register Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-y-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-md"
				>
					{/* Mobile Logo */}
					<div className="mb-8 lg:hidden text-center">
						<div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 dark:bg-white rounded-xl mb-4">
							<UserPlus className="w-7 h-7 text-white dark:text-slate-900" />
						</div>
					</div>

					{/* Header */}
					<div className="mb-8">
						<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
							Create Account
						</h1>
						<p className="text-slate-600 dark:text-slate-400">
							Join us today and get started
						</p>
					</div>

					{/* Error Message */}
					<AnimatePresence>
						{error && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
							>
								<div className="flex items-center">
									<AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
									<p className="text-sm text-red-700 dark:text-red-400">
										{error}
									</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Register Form */}
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="space-y-5"
						noValidate
					>
						{/* Full Name Field */}
						<div>
							<label
								htmlFor="fullName"
								className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
							>
								Full Name
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="h-5 w-5 text-slate-400" />
								</div>
								<input
									type="text"
									id="fullName"
									{...registerField("fullName")}
									onBlur={() => handleBlur("fullName")}
									className={`block w-full pl-10 pr-3 py-3 border ${
										shouldShowError("fullName")
											? "border-red-300 focus:border-red-500 focus:ring-red-500"
											: "border-slate-300 dark:border-slate-600 focus:border-slate-500 focus:ring-slate-500"
									} rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400`}
									placeholder="John Doe"
									aria-label="Full Name"
									aria-invalid={shouldShowError("fullName") ? "true" : "false"}
									aria-describedby={
										shouldShowError("fullName") ? "fullName-error" : undefined
									}
								/>
							</div>
							<AnimatePresence>
								{shouldShowError("fullName") && (
									<motion.p
										initial={{ opacity: 0, y: -5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -5 }}
										id="fullName-error"
										className="mt-2 text-sm text-red-600 dark:text-red-400"
										role="alert"
									>
										{errors.fullName?.message}
									</motion.p>
								)}
							</AnimatePresence>
						</div>

						{/* Email Field */}
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
									{...registerField("email")}
									onBlur={() => handleBlur("email")}
									className={`block w-full pl-10 pr-3 py-3 border ${
										shouldShowError("email")
											? "border-red-300 focus:border-red-500 focus:ring-red-500"
											: "border-slate-300 dark:border-slate-600 focus:border-slate-500 focus:ring-slate-500"
									} rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400`}
									placeholder="you@example.com"
									aria-label="Email Address"
									aria-invalid={shouldShowError("email") ? "true" : "false"}
									aria-describedby={
										shouldShowError("email") ? "email-error" : undefined
									}
								/>
							</div>
							<AnimatePresence>
								{shouldShowError("email") && (
									<motion.p
										initial={{ opacity: 0, y: -5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -5 }}
										id="email-error"
										className="mt-2 text-sm text-red-600 dark:text-red-400"
										role="alert"
									>
										{errors.email?.message}
									</motion.p>
								)}
							</AnimatePresence>
						</div>

						{/* Password Field */}
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
									{...registerField("password")}
									onBlur={() => handleBlur("password")}
									className={`block w-full pl-10 pr-12 py-3 border ${
										shouldShowError("password")
											? "border-red-300 focus:border-red-500 focus:ring-red-500"
											: "border-slate-300 dark:border-slate-600 focus:border-slate-500 focus:ring-slate-500"
									} rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400`}
									placeholder="••••••••"
									aria-label="Password"
									aria-invalid={shouldShowError("password") ? "true" : "false"}
									aria-describedby={
										shouldShowError("password")
											? "password-error password-strength"
											: "password-strength"
									}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
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

							{/* Password Strength Indicator */}
							{passwordValue && (
								<div id="password-strength" className="mt-3" aria-live="polite">
									<div className="flex items-center justify-between text-xs mb-1">
										<span className="text-slate-600 dark:text-slate-400">
											Password strength:
										</span>
										<span
											className={`font-semibold ${
												passwordStrength.strength === 100
													? "text-green-600"
													: passwordStrength.strength >= 66
														? "text-yellow-600"
														: "text-red-600"
											}`}
										>
											{passwordStrength.label}
										</span>
									</div>
									<div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
										<motion.div
											initial={{ width: 0 }}
											animate={{ width: `${passwordStrength.strength}%` }}
											transition={{ duration: 0.3 }}
											className={`h-full ${passwordStrength.color} transition-all duration-300`}
										/>
									</div>

									{/* Password Requirements */}
									<div className="mt-3 space-y-1">
										{passwordRequirements.map((req) => (
											<div
												key={req.label}
												className="flex items-center text-xs"
											>
												{req.met ? (
													<Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
												) : (
													<X className="w-3 h-3 text-slate-400 mr-2 flex-shrink-0" />
												)}
												<span
													className={
														req.met
															? "text-green-600 dark:text-green-400"
															: "text-slate-500 dark:text-slate-400"
													}
												>
													{req.label}
												</span>
											</div>
										))}
									</div>
								</div>
							)}

							<AnimatePresence>
								{shouldShowError("password") && (
									<motion.p
										initial={{ opacity: 0, y: -5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -5 }}
										id="password-error"
										className="mt-2 text-sm text-red-600 dark:text-red-400"
										role="alert"
									>
										{errors.password?.message}
									</motion.p>
								)}
							</AnimatePresence>
						</div>

						{/* Confirm Password Field */}
						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
							>
								Confirm Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-slate-400" />
								</div>
								<input
									type={showConfirmPassword ? "text" : "password"}
									id="confirmPassword"
									{...registerField("confirmPassword")}
									onBlur={() => handleBlur("confirmPassword")}
									className={`block w-full pl-10 pr-12 py-3 border ${
										shouldShowError("confirmPassword")
											? "border-red-300 focus:border-red-500 focus:ring-red-500"
											: "border-slate-300 dark:border-slate-600 focus:border-slate-500 focus:ring-slate-500"
									} rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400`}
									placeholder="••••••••"
									aria-label="Confirm Password"
									aria-invalid={
										shouldShowError("confirmPassword") ? "true" : "false"
									}
									aria-describedby={
										shouldShowError("confirmPassword")
											? "confirmPassword-error"
											: undefined
									}
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
									aria-label={
										showConfirmPassword
											? "Hide confirm password"
											: "Show confirm password"
									}
								>
									{showConfirmPassword ? (
										<EyeOff className="h-5 w-5" />
									) : (
										<Eye className="h-5 w-5" />
									)}
								</button>
							</div>
							<AnimatePresence>
								{shouldShowError("confirmPassword") && (
									<motion.p
										initial={{ opacity: 0, y: -5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -5 }}
										id="confirmPassword-error"
										className="mt-2 text-sm text-red-600 dark:text-red-400"
										role="alert"
									>
										{errors.confirmPassword?.message}
									</motion.p>
								)}
							</AnimatePresence>
						</div>

						{/* Terms & Conditions */}
						<div>
							<div className="flex items-start">
								<div className="flex items-center h-5">
									<input
										type="checkbox"
										id="agreeToTerms"
										{...registerField("agreeToTerms")}
										onBlur={() => handleBlur("agreeToTerms")}
										className="h-4 w-4 text-slate-700 border-slate-300 rounded focus:ring-slate-500 focus:ring-2 transition-colors cursor-pointer"
										aria-label="Agree to terms and conditions"
									/>
								</div>
								<label
									htmlFor="agreeToTerms"
									className="ml-2 block text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
								>
									I agree to the{" "}
									<a
										href="/terms"
										className="text-slate-900 dark:text-white font-semibold hover:underline"
									>
										Terms of Service
									</a>{" "}
									and{" "}
									<a
										href="/privacy"
										className="text-slate-900 dark:text-white font-semibold hover:underline"
									>
										Privacy Policy
									</a>
								</label>
							</div>
							<AnimatePresence>
								{shouldShowError("agreeToTerms") && (
									<motion.p
										initial={{ opacity: 0, y: -5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -5 }}
										className="mt-2 text-sm text-red-600 dark:text-red-400"
										role="alert"
									>
										{errors.agreeToTerms?.message}
									</motion.p>
								)}
							</AnimatePresence>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isSubmitting || isLoading}
							className="w-full bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 text-white dark:text-slate-900 font-semibold py-3 px-4 rounded-lg hover:from-slate-800 hover:to-slate-950 dark:hover:from-slate-100 dark:hover:to-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
							aria-label={
								isSubmitting ? "Creating account..." : "Create Account"
							}
						>
							{isSubmitting || isLoading ? (
								<>
									<Loader2 className="w-5 h-5 mr-2 animate-spin" />
									Creating account...
								</>
							) : (
								<>
									<UserPlus className="w-5 h-5 mr-2" />
									Create Account
								</>
							)}
						</button>
					</form>

					{/* OAuth Section */}
					<div className="mt-8">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-4 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
									Or continue with
								</span>
							</div>
						</div>

						<div className="mt-6">
							<OAuthButtons
								onSuccess={handleOAuthSuccess}
								onError={handleOAuthError}
							/>
						</div>
					</div>

					{/* Switch to Login */}
					<div className="mt-8">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-4 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
									Already have an account?
								</span>
							</div>
						</div>
						<button
							type="button"
							onClick={onSwitchToLogin}
							className="mt-4 w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 px-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
						>
							Sign in instead
						</button>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
