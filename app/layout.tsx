
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{padding:'1rem', borderBottom:'1px solid #ddd'}}>
          <nav>
            <a href="/">Home</a> | <a href="/inventory">Inventory</a> | <a href="/about">About</a> | <a href="/contact">Contact</a>
          </nav>
        </header>
        <main style={{padding:'2rem'}}>{children}</main>
        <footer style={{padding:'1rem', borderTop:'1px solid #ddd'}}>© Concord Machine Tools</footer>
      </body>
    </html>
  );
}
