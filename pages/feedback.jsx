import React, { useEffect, useState } from 'react';
import { GradientBG } from '../components/gradientBG.tsx';
import Link from 'next/link';
import styles from '../styles/LandingPage.module.css';
import Image from 'next/image';
import Head from 'next/head';

export default function LandingPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('')
  
  return(
    <>
      <Head>
        <title>ChatNest | Feedback</title>
      </Head>
      <GradientBG/>

      <nav className={styles.Nav}>
        <h1 className={styles.ChatNest}><Link href='/'>ChatNest</Link></h1>
        <div className={styles.TopDivBtn}>
          <Link href='/download'>Download</Link>
          <Link href='/vision'>Vision</Link>
          <Link href='/feedback' style={{textDecoration: 'underline'}}>Feedback</Link>
        </div>
        <div className={styles.SignupDiv}>  
          <button><Link href='/login'>Sign up</Link></button>
        </div>
      </nav>

       <main className={styles.main}>
         <div className={styles.Part}>
          <h2>Feedback</h2>
          <div className={styles.Input}>
            <label>Title</label>
             <input value={title} onChange={(e) => setTitle(e.target.value)}/>
             <label>Description</label>
             <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>
          </div>
           <a href={`mailto:chatnest12@gmail.com?subject=${title}&body=${description}`} className={styles.feedbackSubmit}>Email Us</a>

         </div>
       </main>
    </>
  )
}