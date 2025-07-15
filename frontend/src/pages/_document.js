import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Attack-a-litics" />
        <meta name="keywords" content="cyber warfare, simulation, lotka-volterra, security, visualization" />
        <meta property="og:title" content="Attack-a-litics | Cyber Warfare Simulation" />
        <meta property="og:description" content="Interactive cyber warfare simulation using Lotka-Volterra dynamics" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Attack-a-litics | Cyber Warfare Simulation" />
        <meta name="twitter:description" content="Interactive cyber warfare simulation using Lotka-Volterra dynamics" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}