import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12">
      <SignUp
        appearance={{
          elements: {
            cardBox: "shadow-2xl",
            formButtonPrimary: "bg-amber-400 text-neutral-950 hover:bg-amber-300",
          },
        }}
        routing="path"
        path="/sign-up"
        fallbackRedirectUrl="/admin"
      />
    </main>
  );
}
