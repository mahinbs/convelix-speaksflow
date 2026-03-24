import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AuthHeroSection } from "@/components/auth/AuthHeroSection";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthForm } from "@/hooks/useAuthForm";

const Auth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    mode,
    email,
    password,
    confirmPassword,
    fullName,
    isLoading,
    setEmail,
    setPassword,
    setConfirmPassword,
    setFullName,
    handleSubmit,
    switchMode,
  } = useAuthForm();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f6f7f9]">

      {/* Brand panel */}
      <div className="relative w-full lg:flex hidden lg:w-1/2 lg:min-h-screen shrink-0">
        <AuthHeroSection />
      </div>

      {/* Form panel */}
      <div className="relative flex w-full flex-1 flex-col lg:w-1/2">
        <AuthForm
          mode={mode}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          fullName={fullName}
          isLoading={isLoading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onFullNameChange={setFullName}
          onSubmit={handleSubmit}
          onModeSwitch={switchMode}
        />
      </div>
    </div>
  );
};

export default Auth;
