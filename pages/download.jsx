import React, { useEffect, useState } from 'react';
import { GradientBG } from '../components/gradientBG.tsx';
import Link from 'next/link';
import styles from '../styles/LandingPage.module.css';
import Image from 'next/image';
import Head from 'next/head';

export default function LandingPage() {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  return(
    <>
      <Head>
        <title>ChatNest | Download</title>
      </Head>
      <GradientBG/>

      <nav className={styles.Nav}>
        <h1 className={styles.ChatNest}><Link href='/'>ChatNest</Link></h1>
        <div className={styles.TopDivBtn}>
          <Link href='/download' style={{textDecoration: 'underline'}}>Download</Link>
          <Link href='/vision'>Vision</Link>
          <Link href='/feedback'>Feedback</Link>
        </div>
        <div className={styles.SignupDiv}>  
          <button><Link href='/login'>Sign up</Link></button>
        </div>
      </nav>

       <main className={styles.main}>
         <div className={styles.Part}>
          <h2>Download ChatNest</h2>
           <div className={styles.downloadDiv}>
             <button id='download' onClick={() => setDropdownMenu(!dropdownMenu)} className={styles.download}>Download ChatNest<Image src='/noddown.png' id='noddown' alt="dropdown-download" width={100} height={100}  onClick={() => setDropdownMenu(!dropdownMenu)}/></button>

             <div className={styles.dropdownMenu} style={{opacity: dropdownMenu ? '1' : '0', height: dropdownMenu ? '110px' : '0'}}>
              <label>Download for Windows 10+</label>
              <label>Download for Linux</label>
              <label>Download for Mac</label>
             </div>
           </div>
         </div>
       </main>
    </>
  )
}