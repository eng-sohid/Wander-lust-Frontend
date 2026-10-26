"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const labelClass = "mb-1.5 block text-[13px] font-medium text-[#1f1f1f]";
const inputClass =
  "h-10 rounded-sm border-0 bg-[#f4f5f7] pl-9 text-xs text-[#1f1f1f] shadow-none placeholder:text-[#8a8f98] focus-visible:ring-2 focus-visible:ring-[#17a2c4]";
const iconClass =
  "pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#555]";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const rememberMe = formData.get("rememberMe") === "on";

    setLoading(true);
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });
    setLoading(false);

    if (error) {
      setError(error.message ?? "Invalid email or password.");
      return;
    }
    if (data) {
      router.push("/");
      router.refresh();
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    if (error) {
      setError(error.message ?? "Google sign in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#f8f9fb] px-4 py-12">
      <h1 className="text-[clamp(2rem,4vw,2.5rem)] font-bold tracking-[-0.03em] text-[#111]">
        Welcome Back
      </h1>
      <p className="mt-1.5 text-sm font-light text-[#555]">
        Resume your adventure with Wanderlust
      </p>

      <div className="mt-8 w-full max-w-[420px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={iconClass} />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <div className="relative">
              <Lock className={iconClass} />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label
              htmlFor="rememberMe"
              className="flex cursor-pointer items-center gap-2 font-light text-[#333]"
            >
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="size-3.5 cursor-pointer accent-[#17a2c4]"
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="font-medium text-[#17a2c4] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full items-center justify-center bg-[#17a2c4] text-xs font-medium text-white transition-colors hover:bg-[#1499c5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17a2c4] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="flex items-center gap-3 text-xs font-light text-[#666]">
            <span className="h-px flex-1 bg-[#ececec]" />
            Or continue with
            <span className="h-px flex-1 bg-[#ececec]" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="flex h-10 w-full items-center justify-center gap-2 border border-[#ececec] bg-white text-xs font-medium text-[#1f1f1f] transition-colors hover:bg-[#f8f9fb] disabled:opacity-60"
          >
            <GoogleIcon />
            {googleLoading ? "Redirecting..." : "Sign Up With Google"}
          </button>

          <p className="pt-1 text-center text-xs font-light text-[#555]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#17a2c4] hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
