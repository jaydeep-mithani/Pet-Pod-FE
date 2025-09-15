"use client";

import { useState, useEffect } from "react";
import { Menu, X, Heart, Home, Users, Phone, Info } from "lucide-react";
import Button from "./Button";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface FloatingNavbarProps {
  className?: string;
}

const FloatingNavbar = ({ className = "" }: FloatingNavbarProps) => {
  const pathName = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const shouldBeHidden = ["/login", "/signin", "/signup"].includes(pathName);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home", icon: Home },
    { name: "About", href: "#about", icon: Info },
    { name: "Features", href: "#features", icon: Heart },
    { name: "Community", href: "#community", icon: Users },
    { name: "Contact", href: "#contact", icon: Phone },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  if (shouldBeHidden) return;

  return (
    <>
      {/* Floating Navbar */}
      <nav
        className={`fixed z-50 transition-all duration-500 ease-in-out ${
          !isScrolled
            ? "bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl top-4 left-4 right-4"
            : "bg-black top-0 left-0 right-0 py-3"
        } ${className}`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href={"/"}>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className={`text-xl font-bold transition-colors duration-500 ${
                      !isScrolled
                        ? "text-gray-900"
                        : "text-white drop-shadow-lg"
                    }`}
                  >
                    Pet Pod
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-1 ${
                      !isScrolled
                        ? "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                        : "text-white hover:text-pink-200 drop-shadow-lg hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href={"/signup"}>
                <Button
                  variant={!isScrolled ? "primary" : "floating"}
                  size="md"
                  onClick={() => (window.location.href = "/signup")}
                >
                  Sign up
                </Button>
              </Link>
              <Link href={"/login"}>
                <Button variant={!isScrolled ? "secondary" : "ghost"} size="md">
                  Log in
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md transition-all duration-300 ${
                  !isScrolled
                    ? "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                    : "text-white hover:text-pink-200 drop-shadow-lg hover:bg-white/10"
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden backdrop-blur-lg transition-all duration-300 ${
            !isScrolled
              ? "bg-white/95 border-gray-200/50 rounded-2xl"
              : "bg-white/20 border-white/30"
          } ${
            isMobileMenuOpen
              ? "max-h-screen overflow-auto border-t"
              : "max-h-0 overflow-hidden border-0"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-300 flex items-center space-x-2 w-full text-left ${
                  !isScrolled
                    ? "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
                    : "text-white hover:text-pink-200 hover:bg-white/10"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ))}
            <div
              className={`pt-4 border-t transition-colors duration-300 ${
                !isScrolled ? "border-gray-200" : "border-white/30"
              }`}
            >
              <Button
                variant={!isScrolled ? "primary" : "floating"}
                size="md"
                className="w-full mb-2"
                onClick={() => (window.location.href = "/signup")}
              >
                Sign up
              </Button>
              <Button
                variant={!isScrolled ? "secondary" : "ghost"}
                size="md"
                className="w-full"
              >
                Log in
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default FloatingNavbar;
