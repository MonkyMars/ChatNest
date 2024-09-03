import react, { useEffect, useState } from 'react'
import Nav from '/components/Nav.jsx';
import styles from '/styles/Settings.module.css';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image'
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_IP);

export default function Settings() {
  const [themeVisible, setThemeVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [fontVisible, setFontVisible] = useState(false);
  const [selectedFont, setSelectedFont] = useState(null)
  const [warningVisible, setWarningVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(1);
  const [Id, setId] = useState('');
  useEffect(() => {
    const userData = localStorage.getItem('pocketbase_auth');
    if(userData){
      try{
        const data = JSON.parse(userData)
        const { model } = data;
        setId(model.id);
        setAvatar(model.avatar || 1);
        setUsername(model.username)
      } catch(error) {
        console.error(error)
      }}
  }, [username])
  
  const handleCancelTheme = () => {
    setThemeVisible(false);
    setSelectedTheme(null)
  }
  const handleConfirmTheme = () => {
    setThemeVisible(false);
    setSelectedTheme(null)
  }
  const handleThemeSelect = (event) => {
    const Theme = event.target.getAttribute('value');
    setSelectedTheme(Theme)
  }
  const handleCancelFont = () => {
    setFontVisible(false);
    setSelectedFont(null)
  }
  const handleConfirmFont = () => {
    setFontVisible(false);
    setSelectedFont(null)
  }
  const handleFontSelect = (event) => {
    const Font = event.target.getAttribute('value');
    setSelectedFont(Font)
  }
  const deleteAccount = async() => {
    if(Id !== ''){
      try{
      const recordDeletion = await pb.collection('users').delete(Id);
      window.location.href = '/login'
      } catch(error) {
        console.error('Error deleting accout', error)
      }
    }
  }
  return(
    <>
      <Head>
        <title>ChatNest | Settings</title>
      </Head>
      <Nav Page='Settings'/>
      <main className={styles.main}>
        <button className={styles.return_button}>
          <Link href='/xyz'>
             Return to ChatNest
          </Link>
        </button>
        <div className={styles.Settings}>
          <h1>Settings</h1>
          
           <div className={styles.Settings_container}>
            {!themeVisible && !fontVisible && (
              <>
                <div className={styles.btn_container}>
                   {/*<button className={styles.Switchbtn} onClick={() => setThemeVisible(true)}>Switch theme</button>
                  <button className={styles.Switchbtn} onClick={() => setFontVisible(true)}>Switch font</button> */}
                  <button className={styles.btnCancel} onClick={() => setWarningVisible(true)}>Delete Account</button>
                </div>
                
              </>
            )} {/*
            {themeVisible && (
              <>
              <main className={styles.Theme}>
                <div className={`${styles.Theme_div1} ${selectedTheme == 'theme1' ? styles.selected : ''}`} id='ThemeDiv' value='theme1' onClick={handleThemeSelect}></div>
                <div className={`${styles.Theme_div2} ${selectedTheme == 'theme2' ? styles.selected : ''}`} id='ThemeDiv' value='theme2' onClick={handleThemeSelect}></div>
                <div className={`${styles.Theme_div3} ${selectedTheme == 'theme3' ? styles.selected : ''}`} id='ThemeDiv' value='theme3' onClick={handleThemeSelect}></div>
                <div className={`${styles.Theme_div4} ${selectedTheme == 'theme4' ? styles.selected : ''}`} id='ThemeDiv' value='theme4' onClick={handleThemeSelect}></div>
                <div className={`${styles.Theme_div5} ${selectedTheme == 'theme5' ? styles.selected : ''}`} id='ThemeDiv' value='theme5' onClick={handleThemeSelect}></div>
              </main>
                <div className={styles.btnDiv}>
                  <button className={styles.btnCancel} onClick={handleCancelTheme}>Cancel</button>

                    {selectedTheme !== null && (
                  <>
                    <button className={styles.btnContinue} onClick={handleConfirmTheme}>Continue</button>
                  </>
                    )}
                </div>
            </>
            )}
            {fontVisible && (
              <>
                <main className={styles.Theme}>
                  <div className={`${styles.Font_div} ${selectedFont == 'font1' ? styles.selected : ''}`} id='FontDiv' value='font1' onClick={handleFontSelect}>
                    <label style={{fontFamily: 'poppins', fontSize: '21px'}}>Abc</label>
                    <label style={{fontFamily: 'Work Sans', fontSize: '19px'}}>Abc</label>
                    <label style={{fontFamily: 'verdana', fontSize: '16px'}}>Abc</label>
                  </div>
                  <div className={`${styles.Font_div} ${selectedFont == 'font2' ? styles.selected : ''}`} id='FontDiv' value='font2' onClick={handleFontSelect}>
                    <label style={{fontFamily: 'cursive', fontSize: '21px'}}>Abc</label>
                    <label style={{fontFamily: 'Kanit', fontSize: '19px'}}>Abc</label>
                    <label style={{fontFamily: 'Varela round', fontSize: '16px'}}>Abc</label>
                  </div>
                  <div className={`${styles.Font_div} ${selectedFont == 'font3' ? styles.selected : ''}`} id='FontDiv' value='font3' onClick={handleFontSelect}>
                    <label style={{fontFamily: 'arial', fontSize: '21px'}}>Abc</label>
                    <label style={{fontFamily: 'sans serif', fontSize: '19px'}}>Abc</label>
                    <label style={{fontFamily: 'EB Garamond', fontSize: '16px'}}>Abc</label>
                  </div>
                </main>
                  <div className={styles.btnDiv}>
                    <button className={styles.btnCancel} onClick={handleCancelFont}>Cancel</button>

                      {selectedFont !== null && (
                    <>
                      <button className={styles.btnContinue} onClick={handleConfirmFont}>Continue</button>
                    </>
                      )}
                    
                  </div>
                  
              </>
            )} */}
          </div>  
        </div>

        <div className={styles.Terms}>
          <h1>Terms of Service</h1>
          <div>
            <ul>
              <li>Racism, Nudity, and ... (not limited to) is strictly prohibited, any of these actions will result in an immediate ban.</li>
              <li>Privacy is important, and any privacy violation will not be tolerated.</li>
              <li>Harassment, bullying, and any form of abusive behavior are strictly forbidden and will lead to immediate action.</li>
              <li>Spamming, including unsolicited advertisements or repeated messages, is not allowed and will result in a ban.</li>
              <li>Sharing personal information such as phone numbers, addresses, or financial information without consent is prohibited.</li>
              <li>Respect all users and moderators; any form of disrespect or insubordination will result in disciplinary action.</li>
              <li>Sharing or discussing illegal activities is strictly forbidden and will be reported to the appropriate authorities.</li>
              <li>Impersonation of other users, moderators, or any individuals is prohibited and will lead to an account ban.</li>
              <li>Hate speech, including derogatory remarks based on race, gender, religion, sexual orientation, or any other characteristic, will not be tolerated.</li>
              <li>The use of explicit or offensive language is not permitted and will result in moderation action.</li>

            </ul>
          </div>
        </div>
      </main>
      {warningVisible && (
        <div className={styles.warning}>
          <h1>Are you sure?</h1>
          <div>
            <button className={styles.btnCancel} onClick={() => setWarningVisible(false)}>Cancel</button>
            <button className={styles.btnContinue} onClick={deleteAccount}>Continue</button>
          </div>
        </div>
      )}
      <div className={styles.loggedInAs} style={{left: warningVisible ? '25px' : ''}}>
        <Image src={`/Avatars/Pfp${avatar}.png`} width={100} height={100} alt={username}/>
        <h1>{username}</h1>
      </div>
    </>
  )
}
