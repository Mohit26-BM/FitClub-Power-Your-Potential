"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Dumbbell } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState<"admin" | "member">("member");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { loginType: "member" },
  });

  async function onSubmit(data: LoginInput) {
    setError("");
    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      loginType,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Please check your ID and password.");
      return;
    }

    router.push(loginType === "admin" ? "/admin" : "/member");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4">
            <Dumbbell className="text-emerald-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to FitClub</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="flex rounded-xl border border-slate-700 p-1 bg-slate-800/50 mb-6">
          {(["member", "admin"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setLoginType(t)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                loginType === t
                  ? "bg-emerald-500 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5 shadow-xl"
        >
          <input type="hidden" {...register("loginType")} value={loginType} />

          <Input
            label={loginType === "admin" ? "Username" : "Member ID"}
            placeholder={loginType === "admin" ? "admin" : "e.g. M001"}
            error={errors.identifier?.message}
            {...register("identifier")}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
            <button
              type="button"
              aria-label={showPw ? "Hide password" : "Show password"}
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-9 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {loginType === "member" && (
            <a href="/forgot-password" className="text-xs text-emerald-400 hover:underline -mt-2 block">
              Forgot password?
            </a>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Sign In
          </Button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-6">
          New member?{" "}
          <a href="/register" className="text-emerald-400 hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
