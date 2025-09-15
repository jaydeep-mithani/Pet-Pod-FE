"use client";

import React, { useState } from "react";
import { Heart, Mail, Eye, EyeOff } from "lucide-react";
import { Button, Card } from "@/components";
import Input from "@/components/ui/Input";
import Image from "next/image";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      console.log("Login form submitted:", formData);
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Image */}
          <div className="hidden lg:block text-white space-y-8 animate-fade-in">
            <div className="text-center lg:text-left">
              <Link href={"/"}>
                <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold">Pet Pod</h1>
                </div>
              </Link>
              <h2 className="text-3xl font-semibold mb-4 text-blue-100">
                Welcome Back
              </h2>
              <p className="text-lg text-blue-100/80 max-w-md mx-auto lg:mx-0">
                Sign in to continue your journey with our pet-loving community.
                Together, we make a difference in animals&apos; lives.
              </p>
            </div>

            {/* Pet-themed illustration placeholder */}
            <div className="relative rounded-2xl overflow-hidden border-4 border-white/20">
              <div className="w-full h-[28rem] flex items-center justify-center">
                <Image
                  fill
                  alt=""
                  src="/assets/images/login.jpg"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:max-w-none">
            <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
              <div className="p-8">
                {/* Mobile Logo */}
                <Link href={"/"}>
                  <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Pet Pod
                    </span>
                  </div>
                </Link>

                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sign in to your account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                    placeholder="Enter your email"
                    icon={Mail}
                  />

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password<span className="text-pink-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your password"
                        className={`
                          w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                          focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100
                          dark:bg-gray-800 dark:text-white dark:border-gray-600
                          ${
                            errors.password
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 hover:border-pink-300 focus:border-pink-500"
                          }
                        `}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="w-5 h-5 border rounded-sm bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        Remember me
                      </span>
                    </label>
                    <a
                      href="/forgot-password"
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    Sign In
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google Login */}
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handleGoogleLogin}
                    icon={
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                    }
                  >
                    Sign in with Google
                  </Button>

                  {/* Signup Link */}
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      Don&apos;t have an account?{" "}
                      <a
                        href="/signup"
                        className="text-pink-600 hover:text-pink-700 font-medium"
                      >
                        Sign up
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
