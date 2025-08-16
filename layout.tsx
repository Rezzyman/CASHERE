import { ClerkProvider } from '@clerk/clerk-react';
const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const metadata = {
  title: "Cashere — Ditch the meetup",
  description: "Safer local buying & selling with lockers, escrow, and digital titles."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "ui-sans-serif, system-ui" }}>
        {pk ? <ClerkProvider publishableKey={pk}>{children}</ClerkProvider> : children}
      </body>
    </html>
  );
}
