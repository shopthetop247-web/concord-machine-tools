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
      <body>
        <header style={{ padding: "16px", borderBottom: "1px solid #ddd" }}>
          <nav
            style={{
              display: "flex",
              gap: "20px",
              fontWeight: "bold",
            }}
          >
            <Link href="/">Home</Link>
            <Link href="/inventory">Inventory</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>

        <main style={{ padding: "24px" }}>{children}</main>
      </body>
    </html>
  );
}
