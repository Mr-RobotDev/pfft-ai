"use client";
import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from 'next/script';
import { AppConfig } from "@/utils/AppConfig";

class MyDocument extends Document {
  render() {
    return (
      <Html lang={AppConfig.locale}>
        <Head>
          {/* Existing Google Analytics Script */}
          <Script async strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-DZJ4G6H5LK"></Script>
          <Script strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DZJ4G6H5LK');
          `}}>
          </Script>

          {/* Google Ads Script */}
          <Script async strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=AW-11035419488"></Script>
          <Script strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
            gtag('config', 'AW-11035419488');
          `}}>
          </Script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
