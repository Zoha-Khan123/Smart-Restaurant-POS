import React from "react";
import AuthIllustration from "./AuthIllustration";
import AuthBranding from "./AuthBranding";
import AuthFooter from "./AuthFooter";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg-main flex overflow-x-hidden font-poppins">
      {/* 1. Left Side: Enterprise Illustration & Platform Feature Showcase (Desktop Only) */}
      <AuthIllustration />

      {/* 2. Right Side: Auth Form Workspace */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-4 sm:p-8 lg:p-12 xl:p-16 overflow-y-auto min-h-screen">
        {/* Top Header Branding for Mobile & Desktop */}
        <div className="flex items-center justify-between pb-6">
          <AuthBranding />
        </div>

        {/* Center Container for Auth Pages */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          <div className="bg-bg-card rounded-2xl border border-border/80 p-6 sm:p-8 shadow-xs">
            {children}
          </div>
        </div>

        {/* Bottom Compliance & Security Footer */}
        <AuthFooter />
      </div>
    </div>
  );
}
