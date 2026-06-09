"use client";

import { SessionForm } from "@/components/SessionForm";

export default function NewSessionPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Log session</h1>
      <SessionForm />
    </div>
  );
}
