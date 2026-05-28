"use client";

import React from "react";
import { ProjectionSandbox } from "@/features/finance/components/projection-savings/ProjectionSandbox";

export default function SavingsProjectionPage() {
  return (
    <div className="relative min-h-screen p-6 lg:p-10 pb-20 w-full max-w-7xl mx-auto transition-all duration-500">
      <ProjectionSandbox />
    </div>
  );
}
