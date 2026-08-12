import { Dashboard } from "@/components/dashboard/Dashboard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Dashboard />
      </div>
    </main>
  );
}
