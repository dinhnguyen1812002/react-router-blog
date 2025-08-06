import React, { useState } from "react";
import { CalendarDays, FlagOff, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useSubscribeNewsletter } from "~/api/newsletter";
import type { strict } from "assert";


interface subscribe {
    name: string
    email: string
}

export default function NewLetters() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [validationError, setValidationError] = useState("");

  // TanStack Query mutation
  const subscribeMutation = useSubscribeNewsletter({
    onSuccess: (data: subscribe) => {
      // Reset form on success
      setEmail("");
      setName("");
      setValidationError("");
    },
    onError: (error: any) => {
      console.error("Newsletter subscription error:", error);
    }
  });

  const validateForm = () => {
    if (!email.trim()) {
      setValidationError("Please enter your email address.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const payload = {
      email: email.trim(),
      ...(name.trim() && { name: name.trim() })
    };

    subscribeMutation.mutate(payload);
  };

  const resetErrors = () => {
    setValidationError("");
    subscribeMutation.reset();
  };

  // Determine current status
  const isLoading = subscribeMutation.isPending;
  const isSuccess = subscribeMutation.isSuccess;
  const isError = subscribeMutation.isError || !!validationError;

  // Get error message
  const errorMessage = validationError || 
                      subscribeMutation.error?.response?.data?.message || 
                      subscribeMutation.error?.response?.data?.error ||
                      subscribeMutation.error?.message ||
                      "An error occurred while subscribing. Please try again.";

  // Get success message
  const successMessage = subscribeMutation.data?.message || 
                         "Subscription successful! Please check your email to confirm.";

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto container px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              Subscribe to our newsletter
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Stay updated with the latest news, articles, and insights delivered
              straight to your inbox.
            </p>

            {/* Success Message */}
            {isSuccess && (
              <div className="mt-4 p-4 rounded-lg flex items-start space-x-3 bg-green-500/10 border border-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-400">
                    {successMessage}
                  </p>
                  <p className="text-xs text-green-300 mt-1">
                    Check your inbox and spam folder for the confirmation email.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {isError && (
              <div className="mt-4 p-4 rounded-lg flex items-start space-x-3 bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-400">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex max-w-md flex-col gap-y-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  resetErrors();
                }}
                disabled={isLoading}
                placeholder="Enter your email"
                className="min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              
              <label htmlFor="full-name" className="sr-only">
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  resetErrors();
                }}
                disabled={isLoading}
                placeholder="Enter your full name (optional)"
                className="min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || isSuccess}
                className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Subscribed
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
          </div>
          
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <dt className="mt-4 text-base font-semibold text-white">
                Weekly articles
              </dt>
              <dd className="mt-2 text-base/7 text-gray-400">
                Receive curated content and insights delivered to your inbox
                every week.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <FlagOff className="w-6 h-6 text-white" />
              </div>
              <dt className="mt-4 text-base font-semibold text-white">
                No spam
              </dt>
              <dd className="mt-2 text-base/7 text-gray-400">
                We respect your inbox. Unsubscribe at any time with a single
                click.
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
      ></div>
    </div>
  );
}