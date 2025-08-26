import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import { Input } from "../components/UI/Input";
import { Button } from "../components/UI/Button";
import { useAppDispatch, useAppState } from "../store/hooks";
import { verifyOTPAsync, resendOTPAsync, resetPasswordAsync, clearError } from "../store/slices/authSlice";

type Mode = "signup" | "reset";
type Errors = Partial<
    Record<"email" | "otp" | "password" | "confirmPassword" | "form", string>
>;
interface VerifyOtpState {
    email?: string;
    mode?: Mode;
}

function useVerifyParams() {
    const loc = useLocation();
    const state = (loc.state as VerifyOtpState | null) ?? null;
    const qs = useMemo(() => new URLSearchParams(loc.search), [loc.search]);

    const email = state?.email ?? qs.get("email") ?? "";
    const qpMode = (qs.get("mode") || "").toLowerCase();
    const modeFromState = state?.mode;

    const mode: Mode =
        modeFromState ??
        (qpMode === "signup" ? "signup" : "reset"); // default "reset"

    return { email, mode };
}

export default function VerifyOtpPage() {
    const { email: initialEmail, mode } = useVerifyParams();
    const nav = useNavigate();

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [cooldown, setCooldown] = useState(0);
    
    const dispatch = useAppDispatch();
    const { auth } = useAppState();
    const { isLoading, error } = auth;

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setInterval(() => setCooldown((s) => s - 1), 1000);
        return () => clearInterval(t);
    }, [cooldown]);

    useEffect(() => {
        if (error) {
            setErrors((prev) => ({
                ...prev,
                form: error,
            }));
        }
    }, [error]);

    useEffect(() => {
        // Clear error when component unmounts
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const validate = () => {
        const next: Errors = {};
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) next.email = "Email is required";
        else if (!emailRe.test(email)) next.email = "Invalid email";

        const otpRe = /^\d{6}$/;
        if (!otp.trim()) next.otp = "OTP is required";
        else if (!otpRe.test(otp)) next.otp = "OTP must be 6 digits";

        if (mode === "reset") {
            if (!password) next.password = "Password is required";
            else if (password.length < 6) next.password = "At least 6 characters";

            if (!confirmPassword) next.confirmPassword = "Please confirm password";
            else if (confirmPassword !== password)
                next.confirmPassword = "Passwords do not match";
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        dispatch(clearError());
        setErrors({});

        if (mode === "signup") {
            const resultAction = await dispatch(verifyOTPAsync({ email, otp }));
            if (verifyOTPAsync.fulfilled.match(resultAction)) {
                nav("/login", { state: { verified: true, email } });
            }
        } else {
            const resultAction = await dispatch(resetPasswordAsync({ email, otp, newPassword: password }));
            if (resetPasswordAsync.fulfilled.match(resultAction)) {
                nav("/login", { state: { passwordReset: true, email } });
            }
        }
    };

    const resendOtp = async () => {
        if (cooldown > 0) return;
        
        dispatch(clearError());
        setErrors({});

        const type = mode === "signup" ? "register" : "forgot-password";
        const resultAction = await dispatch(resendOTPAsync({ email, type }));
        
        if (resendOTPAsync.fulfilled.match(resultAction)) {
            setCooldown(60); // 60s cooldown
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#111827] p-4">
            <div className="w-[400px] max-w-full rounded-lg p-8 text-center border border-white/50 bg-white/10 backdrop-blur-[9px]">
                <form className="flex flex-col" onSubmit={onSubmit} noValidate>
                    <h2 className="text-3xl mb-5 text-white">
                        {mode === "signup" ? "Verify OTP (Sign up)" : "Verify OTP (Reset password)"}
                    </h2>

                    {errors.form && (
                        <div className="mb-3 text-sm text-red-200 bg-red-500/20 rounded p-2 text-left">
                            {errors.form}
                        </div>
                    )}

                    <Input
                        id="email"
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        error={errors.email}
                    />

                    <Input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        label="OTP (6 digits)"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        required
                        autoComplete="one-time-code"
                        error={errors.otp}
                    />

                    {mode === "reset" && (
                        <>
                            <Input
                                id="password"
                                type="password"
                                label="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                error={errors.password}
                            />
                            <Input
                                id="confirmPassword"
                                type="password"
                                label="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                                error={errors.confirmPassword}
                            />
                        </>
                    )}

                    <Button type="submit" loading={isLoading} className="mt-2 w-full">
                        {isLoading ? "Processing..." : mode === "signup" ? "Verify & Activate" : "Reset password"}
                    </Button>

                    <Button
                        type="button"
                        onClick={resendOtp}
                        disabled={cooldown > 0 || isLoading}
                        className="mt-3 w-full"
                        variant="ghost"
                    >
                        {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                    </Button>

                    <div className="text-center mt-8 text-white">
                        <p>
                            Back to{" "}
                            <Link to="/login" className="text-[#efefef] hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
