import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Logo } from "@/components/ui/logo";
type AuthMode = "signin" | "signup" | "forgot";

interface AuthFormProps {
  mode: AuthMode;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onFullNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onModeSwitch: (mode: AuthMode) => void;
}

const labelClass =
  "text-[11px] font-bold uppercase tracking-wider text-foreground/80";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  email,
  password,
  confirmPassword,
  fullName,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onFullNameChange,
  onSubmit,
  onModeSwitch,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const isSignin = mode === "signin";

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center bg-[#f6f7f9] px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="lg:hidden mb-8 text-center">
          <Logo size="lg" className="justify-center" />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
            {mode === "signin" && "Welcome back"}
            {mode === "signup" && "Create your account"}
            {mode === "forgot" && "Reset password"}
          </h2>
          <p className="mt-2 text-[15px] text-muted-foreground">
            {mode === "signin" && "Sign in to access your dashboard."}
            {mode === "signup" &&
              "Start automating lead qualification with Convelix."}
            {mode === "forgot" &&
              "Enter your email and we’ll send reset instructions."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {mode === "signup" && (
            <div className="space-y-2">
              <label htmlFor="fullName" className={labelClass}>
                Full name
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => onFullNameChange(e.target.value)}
                required
                placeholder="Jane Doe"
                className="h-12 rounded-lg border-border bg-white px-4 text-[15px] shadow-sm focus-visible:ring-brand-500"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className={labelClass}>
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                required
                placeholder="you@company.com"
                autoComplete="email"
                className="h-12 rounded-lg border-border bg-white pl-11 pr-4 text-[15px] shadow-sm focus-visible:ring-brand-500"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                {isSignin && (
                  <button
                    type="button"
                    onClick={() => onModeSwitch("forgot")}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  className="h-12 rounded-lg border-border bg-white pl-11 pr-11 text-[15px] shadow-sm focus-visible:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className={labelClass}>
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => onConfirmPasswordChange(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="h-12 rounded-lg border-border bg-white pl-11 pr-4 text-[15px] shadow-sm focus-visible:ring-brand-500"
                />
              </div>
            </div>
          )}

          {isSignin && (
            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(c) => setRememberMe(c === true)}
                className="border-border data-[state=checked]:bg-brand-600 data-[state=checked]:border-brand-600"
              />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer select-none leading-snug"
              >
                Remember me for 30 days
              </label>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-12 w-full rounded-lg bg-brand-800 text-[15px] font-semibold text-white shadow-md hover:bg-brand-900 focus-visible:ring-brand-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait…
              </>
            ) : (
              <>
                {mode === "signin" && "Sign In"}
                {mode === "signup" && "Create account"}
                {mode === "forgot" && "Send reset link"}
                {!isLoading && mode === "signin" && (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}
              </>
            )}
          </Button>
        </form>

        {isSignin && (
          <>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <span className="bg-[#f6f7f9] px-3">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-lg border-border bg-white text-[15px] font-medium text-foreground shadow-sm hover:bg-muted/50"
              onClick={() => {
                /* OAuth placeholder */
              }}
              disabled
              title="Google sign-in coming soon"
            >
              <GoogleIcon className="mr-3 h-5 w-5" />
              Sign in with Google
            </Button>
          </>
        )}

        <div className="mt-10 space-y-6">
          {isSignin && (
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success shrink-0" />
                SOC 2 Compliant
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success shrink-0" />
                GDPR Ready
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success shrink-0" />
                99.9% Uptime
              </span>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            {mode === "signin" && (
              <>
                Don&apos;t have an account?{" "}
                <a
                  href="mailto:support@Convelix.com"
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Contact Sales
                </a>
                <span className="mx-1 text-border">·</span>
                <button
                  type="button"
                  onClick={() => onModeSwitch("signup")}
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Sign up
                </button>
              </>
            )}
            {mode === "signup" && (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => onModeSwitch("signin")}
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  Sign in
                </button>
              </>
            )}
            {mode === "forgot" && (
              <button
                type="button"
                onClick={() => onModeSwitch("signin")}
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
