import { LandingPage, Footer } from "@/components/landing";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <main className="flex flex-col items-center px-4">
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
}