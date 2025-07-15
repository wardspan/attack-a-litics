import Head from 'next/head';

const PWAManifest = () => {
  return (
    <Head>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#1a1a1a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Attack-a-litics" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#1a1a1a" />
      <meta name="msapplication-tap-highlight" content="no" />
      
      {/* Apple Touch Icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#3b82f6" />
      
      {/* PWA specific meta tags */}
      <meta name="application-name" content="Attack-a-litics" />
      <meta name="description" content="Educational Cyber Warfare Simulation using Lotka-Volterra Dynamics" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/icons/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#1a1a1a" />
      <meta name="msapplication-tap-highlight" content="no" />
      
      {/* Windows specific */}
      <meta name="msapplication-square70x70logo" content="/icons/mstile-70x70.png" />
      <meta name="msapplication-square150x150logo" content="/icons/mstile-150x150.png" />
      <meta name="msapplication-wide310x150logo" content="/icons/mstile-310x150.png" />
      <meta name="msapplication-square310x310logo" content="/icons/mstile-310x310.png" />
    </Head>
  );
};

export default PWAManifest;