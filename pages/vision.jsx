import React, { useEffect, useState } from 'react'
import { GradientBG } from '../components/gradientBG.tsx';
import Link from 'next/link';
import styles from '../styles/LandingPage.module.css';
import Image from 'next/image';
import Head from 'next/head';

export default function LandingPage() {
  return(
    <>
      <Head>
        <title>ChatNest | Vision</title>
      </Head>
      <GradientBG/>

      <nav className={styles.Nav}>
         <h1 className={styles.ChatNest}><Link href='/'>ChatNest</Link></h1>
        <div className={styles.TopDivBtn}>
          <Link href='/download'>Download</Link>
          <Link href='/vision' style={{textDecoration: 'underline'}}>Vision</Link>
          <Link href='/feedback'>Feedback</Link>
        </div>
        <div className={styles.SignupDiv}>  
          <button><Link href='/login'>Sign up</Link></button>
        </div>
      </nav>

       <main className={styles.main}>
         <div className={styles.Part}>
           <h1>Vision</h1>
           <p>{"My dream for ChatNest is to expand it in the social media industry, I would love to make this my fulltime job. Currently I run the ChatNest locally on an old laptop, upgrading is needed if ChatNest would expand."}</p>
         </div>

          <div className={styles.Part}>
            <h1>Team</h1>
            <p>{"I am a one-person team. So far I've built everything by myself but would love to start working with other people to make ChatNest more powerful and lively. If you're interested in working with me contact me at:"}</p>
            <div className={styles.Details}>
              <label><a href='mailto:Levi.laptop@hotmail.com'>Levi.laptop@hotmail.com</a></label>
              <label>@monky</label>
            </div>
          </div>
       </main>
    </>
  )
}