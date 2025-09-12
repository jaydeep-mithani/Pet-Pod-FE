"use client";

import { useState } from "react";
import { User, Mail, Lock, Phone } from "lucide-react";
import {
  Button,
  Input,
  GoogleButton,
  AuthCard,
  AuthLayout,
} from "@/components";
import Link from "next/link";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Sign up data:", formData);
      // Handle successful signup
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Handle Google authentication
    console.log("Google sign up clicked");
  };

  return (
    <AuthLayout type="signup">
      <div className="w-full max-w-2xl mx-auto">
        <AuthCard
          title="Join Pet Pod"
          subtitle="Create your account and start giving pets a second chance"
        >
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields - Always in a row on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(value) => handleInputChange("firstName", value)}
                  error={errors.firstName}
                  required
                  icon={<User className="w-4 h-4 text-gray-400" />}
                />
                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(value) => handleInputChange("lastName", value)}
                  error={errors.lastName}
                  required
                  icon={<User className="w-4 h-4 text-gray-400" />}
                />
              </div>

              {/* Email and Phone - Row on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(value) => handleInputChange("email", value)}
                  error={errors.email}
                  required
                  icon={<Mail className="w-4 h-4 text-gray-400" />}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(value) => handleInputChange("phone", value)}
                  error={errors.phone}
                  required
                  icon={<Phone className="w-4 h-4 text-gray-400" />}
                />
              </div>

              {/* Password Fields - Row on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(value) => handleInputChange("password", value)}
                  error={errors.password}
                  required
                  icon={<Lock className="w-4 h-4 text-gray-400" />}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  error={errors.confirmPassword}
                  required
                  icon={<Lock className="w-4 h-4 text-gray-400" />}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 transition-all duration-200 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign Up */}
            <div>
              <GoogleButton onClick={handleGoogleSignUp} />
            </div>

            {/* Terms and Privacy */}
            <div className="text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-pink-600 hover:text-pink-700 underline font-medium transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-pink-600 hover:text-pink-700 underline font-medium transition-colors"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Sign In Link */}
            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-pink-600 hover:text-pink-700 font-semibold underline transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </AuthCard>
      </div>
    </AuthLayout>
  );
}
