import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12">
      <SignIn
        appearance={{
          elements: {
            cardBox: "shadow-2xl",
            formButtonPrimary: "bg-amber-400 text-neutral-950 hover:bg-amber-300",
          },
        }}
        routing="path"
        path="/sign-in"
        fallbackRedirectUrl="/admin"
      />
    </main>
  );
}
