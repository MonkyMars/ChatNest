import type { NextPage } from "next";
import Head from "next/head";
import LandingPage from "./landingPage.jsx"; 
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react'
const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>ChatNest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
     <LandingPage />
     <Analytics/>
     <SpeedInsights/>
    </>
  );
};

export default HomePage;
