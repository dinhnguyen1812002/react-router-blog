import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDaysIcon, ShieldOff } from "lucide-react";
import { newsletterApi } from "~/api/newsletter";

export default function NewLetter() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sourceUrl, setSourceUrl] = useState(() => (typeof window !== "undefined" ? window.location.href : ""));
  const [gdprConsent, setGdprConsent] = useState(false);

  const [subscribeResponse, setSubscribeResponse] = useState<{
    success: boolean;
    message: string;
    requiresConfirmation: boolean;
  } | null>(null);

  const subscribeMutation = useMutation({
    mutationFn: (payload: {
      email: string;
      firstName?: string;
      lastName?: string;
      sourceUrl?: string;
      gdprConsent?: boolean;
    }) => newsletterApi.subscribe(payload),

    onSuccess: () => {
      // UI sẽ render dựa vào subscribeResponse được set bên dưới
      setEmail("");
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleSubscribe = () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return

    const payload = {
      email: trimmedEmail,
      ...(firstName.trim() ? { firstName: firstName.trim() } : {}),
      ...(lastName.trim() ? { lastName: lastName.trim() } : {}),
      ...(sourceUrl.trim() ? { sourceUrl: sourceUrl.trim() } : {}),
      ...(gdprConsent ? { gdprConsent: true } : {}),
    }

    subscribeMutation.mutate(payload, {
      onSuccess: (data) => {
        setSubscribeResponse(data)
        toast[data.success ? "success" : "error"](data.message)
        setFirstName("")
        setLastName("")
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Email không hợp lệ");
      return;
    }
    handleSubscribe()
  };

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              Subscribe to our newsletter
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Nostrud amet eu ullamco nisi aute in ad minim nostrud adipisicing
              velit quis. Duis tempor incididunt dolore.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-3">
              <div className="flex gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>

                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribeMutation.isPending}
                  className="min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 
      text-base text-white outline-1 -outline-offset-1 outline-white/10 
      placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 
      focus:outline-indigo-500 sm:text-sm/6"
                />

                <button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 
      text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 
      focus-visible:outline-2 focus-visible:outline-offset-2 
      focus-visible:outline-indigo-500 disabled:opacity-50 
      disabled:cursor-not-allowed"
                >
                  {subscribeMutation.isPending ? "Submitting..." : "Subscribe"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="first-name" className="sr-only">
                    First name
                  </label>
                  <input
                    id="first-name"
                    name="firstName"
                    type="text"
                    placeholder="First name (optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={subscribeMutation.isPending}
                    className="w-full rounded-md bg-white/5 px-3.5 py-2 
      text-sm text-white outline-1 -outline-offset-1 outline-white/10 
      placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 
      focus:outline-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="sr-only">
                    Last name
                  </label>
                  <input
                    id="last-name"
                    name="lastName"
                    type="text"
                    placeholder="Last name (optional)"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={subscribeMutation.isPending}
                    className="w-full rounded-md bg-white/5 px-3.5 py-2 
      text-sm text-white outline-1 -outline-offset-1 outline-white/10 
      placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 
      focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="source-url" className="sr-only">
                  Source URL
                </label>
                <input
                  id="source-url"
                  name="sourceUrl"
                  type="url"
                  placeholder="Source URL (optional)"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  disabled={subscribeMutation.isPending}
                  className="w-full rounded-md bg-white/5 px-3.5 py-2 
      text-sm text-white outline-1 -outline-offset-1 outline-white/10 
      placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 
      focus:outline-indigo-500"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-white/90 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gdprConsent}
                  onChange={(e) => setGdprConsent(e.target.checked)}
                  disabled={subscribeMutation.isPending}
                  className="accent-indigo-500"
                />
                I agree to receive emails and understand I can unsubscribe anytime.
              </label>

              {subscribeResponse && (
                <p
                  className={`mt-3 text-sm ${
                    subscribeResponse.success ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {subscribeResponse.message}
                </p>
              )}
            </form>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <CalendarDaysIcon
                  aria-hidden="true"
                  className="size-6 text-white"
                />
              </div>
              <dt className="mt-4 text-base font-semibold text-white">
                Weekly articles
              </dt>
              <dd className="mt-2 text-base/7 text-gray-400">
                Non laboris consequat cupidatat laborum magna. Eiusmod non irure
                cupidatat duis commodo amet.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                <ShieldOff aria-hidden="true" className="size-6 text-white" />
              </div>
              <dt className="mt-4 text-base font-semibold text-white">
                No spam
              </dt>
              <dd className="mt-2 text-base/7 text-gray-400">
                Officia excepteur ullamco ut sint duis proident non adipisicing.
                Voluptate incididunt anim.
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
    </div>
  );
}
