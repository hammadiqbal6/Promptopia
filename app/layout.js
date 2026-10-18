import Nav from "@components/Nav";
import Provider from "@components/Provider";
import AuthBanner from "@components/AuthBanner";
import "@styles/globals.css";

export const metadata = {
  title: "Promptopia — Discover & Share AI Prompts",
  description: "Discover and share AI prompts with creators around the world.",
};

export default function RootLayout({ children }) {
  const authConfigured = Boolean(
    (process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_ID) &&
      (process.env.GOOGLE_CLIENT_SECRET ||
        process.env.NEXT_PUBLIC_GOOGLE_SECRET)
  );

  return (
    <html lang="en">
      <body>
        <Provider>
          <div className="main">
            <div className="gradient"></div>
          </div>
          <main className="app">
            <Nav authConfigured={authConfigured} />
            {!authConfigured && <AuthBanner />}
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
