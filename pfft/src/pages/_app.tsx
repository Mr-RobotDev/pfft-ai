"use client";
import "../styles/global.css";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import CookiesConsent from "@/components/CookiesConsent";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <SessionProvider session={pageProps.session}>
    <CookiesConsent />
    <Component {...pageProps} />
  </SessionProvider>
);

export default MyApp;
