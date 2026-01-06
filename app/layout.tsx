import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Concord Machine Tools",
  description: "Industrial machinery inventory and sales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <header className="border-b border-gray-200 bg-white">
          <nav className="max-w-7xl mx-auto flex gap-6 px-6 py-4 font-semibold">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link href="/inventory" className="hover:text-blue-600">
              Inventory
            </Link>
            <Link href="/about" className="hover:text-blue-600">
              About
            </Link>
            <Link href="/contact" className="hover:text-blue-600">
              Contact
            </Link>
          </nav>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
