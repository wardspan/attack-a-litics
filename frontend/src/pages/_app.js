import '../styles/globals.css';
import 'katex/dist/katex.min.css';
import { Analytics } from '@vercel/analytics/next';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}