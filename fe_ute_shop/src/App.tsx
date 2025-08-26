// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ProfileView from "./pages/ProfileUserPage";

export default function App() {
    return (
        <BrowserRouter>
            <div
                className="relative min-h-screen w-screen flex items-center justify-center px-2"
                style={{
                    backgroundImage: "url('/image/img.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="relative z-10 w-full max-w-[460px]">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/verify-otp" element={<VerifyOtpPage />} />
                        <Route path="/profile" element={<ProfileView />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}
