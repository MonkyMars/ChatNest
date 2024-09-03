import React, { useEffect, useState } from 'react'
import { GradientBG } from '../components/gradientBG.tsx';
import Link from 'next/link';
import styles from '../styles/LandingPage.module.css';
import Image from 'next/image';

export default function LandingPage() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setUserData(localStorage.getItem('pocketbase_auth'));
  }, []);

  return (
    <>
      <GradientBG/>
    
        <nav className={styles.Nav}>
        <h1 className={styles.ChatNest}><Link href='/'>ChatNest</Link><Image src='/Logo/LOGO.png' width={500} height={500} alt='Logo'/></h1>
          <div className={styles.TopDivBtn}>
            <Link href='/download'>Download</Link>
            <Link href='/vision'>Vision</Link>
            <Link href='/feedback'>Feedback</Link>
          </div>
          <div className={styles.SignupDiv}>  
            <button><Link href='/login'>Sign up</Link></button>
          </div>
        </nav>

        <main className={styles.main}>
          
          <header className={styles.Header}>
            <h1>ChatNest</h1>
            <p>ChatNest is a minimalistic app designed for ease of use and speed. Step into an amazing new chatting platform. Share and chat in ChatNest.</p>
            <div className={styles.downloadDiv}>
              <button id='download'><Link href='/download'>Download ChatNest</Link></button>
              <button><Link href={userData ? '/xyz' : '/login'}>Open ChatNest in browser</Link></button>
            </div>
          </header>

          <div className={styles.Part}>
              <h2>Share your craziest stories!</h2>
              <p>{"Post your personal expierences, opinions and so much more. Reach adiences that you've never met and read other people their stories. Give your favorite stories a like and check out their profile!"}</p>
              <Image src='/Demos/demo_post.png' width={500} height={500} alt='ChatNest' priority/>
          </div>
          
          <div className={styles.Part}>
             <h2>Message your bestest of friends on ChatNest!</h2>
            <p>Use our light-weight message to message the ones close to you or go a different route and create entirely new friends and meet new people!</p>
            <Image src='/Demos/demo_chat_upscaled.png' width={500} height={500} alt='ChatNest' priority/>
          </div>

          <div className={styles.Part}>
            <h2>Customize your profile!</h2>
            <p>{"Style your profile how you like, choose your banner and profile picture from a selection! Change at anytime depending on your mood and see other user's their profile by checking out their posts!"}</p>
            <Image src='/Demos/demo_profile.png' width={500} height={500} alt='ChatNest' priority/>
          </div>
        </main>
    </>
  )
}
