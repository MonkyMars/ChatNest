import React, { useEffect, useState, useRef } from 'react';
import styles from '/styles/Login.module.css';
import PocketBase from 'pocketbase';
import Banner from '../components/Banner.jsx';
import Head from 'next/head';
import { GradientBG } from '../components/gradientBG.tsx';
import Link from 'next/link';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_IP);

export default function Login() {
  const [form, setForm] = useState(1);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
  });
  const [formVisible, setFormVisible] = useState(true);
  const [formType, setFormType] = useState('signup');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [bannerText, setBannerText] = useState('');
  const [bannerImg, setBannerImg] = useState('');
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    if (form === 4) {
      setFormVisible(false);
      window.location.href = '/xyz';
    }
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevState => ({ ...prevState, [name]: value }));
  };

  const createUser = async () => {
    const { fullname, email, password, username } = formData;

    const data = {
        "username": username,
        "email": email,
        "emailVisibility": true,
        "password": password,
        "passwordConfirm": password,
        "name": fullname,
        "avatar": 'favicon.ico',
        "banner": 'testbanner.jpeg',
    };
    try {
      const user = await pb.collection('users').create(data);
      console.log(user)
      const authData = await pb.collection('users').authWithPassword(
          username,
          password,
      );
      if(pb.authStore.isValid) {
         setForm(4);
      }
    } catch (error) {
      setBannerText('Error creating account');
      setBannerImg('error.png');
      setBannerVisible(true);
      setTimeout(() => {
        setBannerVisible(false)
      }, 4500)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formType === 'signup' && form === 1) {
      CheckingForm1();
    } else if(formType === 'login' && form === 1){
      CheckingFormLogin();
    } else if(formType === 'signup' && form === 2) {
      CheckingForm2();
    }
  };

  const CheckingForm1 = () => {
    const { fullname, email, password } = formData;

    if (!fullname || !email || !password) {
      setBannerText('Please fill in all input fields');
      setBannerImg('error.png');
      setBannerVisible(true);
      setTimeout(() => {
        setBannerVisible(false)
      }, 4500)
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setBannerText('Please enter a valid email');
      setBannerImg('error.png');
      setBannerVisible(true);
      setTimeout(() => {
        setBannerVisible(false)
      }, 4500)
      return;
    }
    if (password.length < 8) {
      setBannerText('Password must contain more than 8 characters');
      setBannerImg('error.png');
      setBannerVisible(true);
      setTimeout(() => {
        setBannerVisible(false)
      }, 4500)
      return;
    }
    setForm(2);
  };

  async function CheckingFormLogin() {
    const { username, password } = loginData;

    if (!username || !password) {
      setBannerText('Please enter your username and password');
      setBannerImg('error.png');
      setBannerVisible(true);
      setTimeout(() => {
        setBannerVisible(false)
      }, 4500)
      return;
    } else {
      try{
        const authData = await pb.collection('users').authWithPassword(
          username,
          password,
        );
        if(pb.authStore.isValid) {
          setFormVisible(false);
          window.location.href = '/xyz';
        }
      } catch(error) {
        setBannerText('Invalid credentials');
        setBannerImg('error.png');
        setBannerVisible(true);
        setTimeout(() => {
          setBannerVisible(false)
        }, 4500)
      }
    }
  };

  const CheckingForm2 = () => {
    const { username } = formData;

    if (!username) {
      setBannerText('Please fill in all input fields');
      setBannerImg('error.png');
      setBannerVisible(true);
      setTimeout(() => {
        setBannerVisible(false)
      }, 4500)
      return;
    }
    if (username.length < 4 || username.length > 12) {
      setBannerText('Username must contain between 4 and 12 characters');
      setBannerImg('error.png');
      setBannerVisible(true);
      setTimeout(() => {
        setBannerVisible(false)
      }, 4500)
      return;
    }
    setForm(3);
  };

  return (
    <>
      <GradientBG/>
      <Head>
        <title>{formType === 'login' ? 'ChatNest | Login' : 'ChatNest | Signup'}</title>
      </Head>
      <SecondaryNav Page={formType === 'login' ? 'Log in' : 'Sign up'}/>
      {formVisible && (
        <form className={styles.form} onSubmit={handleSubmit}>
          {form === 1 && (
            <>
              {formType === 'signup' ? (
                <>
                  <h1 className={styles.h1}>Sign up</h1>
                  <div>
                    <label className={styles.label}>Fullname</label>
                    <input
                      className={styles.input}
                      type='text'
                      name='fullname'
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder='John Doe'
                    />
                    <label className={styles.label}>Email Address:</label>
                    <input
                      className={styles.input}
                      type='text'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='Johndoe@gmail.com'
                    />
                    <label className={styles.label}>Password:</label>
                    <input
                      className={styles.input}
                      type='password'
                      name='password'
                      autocomplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder='********'
                    />
                  </div>
                  <a onClick={() => setFormType('login')} className={styles.a}>Already have an account? Log in!</a>
                </>
              ) : (
                <>
                  <h1 className={styles.h1}>Log In</h1>
                  <div>
                    <label className={styles.label}>Username:</label>
                    <input
                      className={styles.input}
                      type='text'
                      name='username'
                      value={loginData.username}
                      onChange={handleLoginChange}
                      placeholder='monkymars'
                    />
                    <label className={styles.label}>Password:</label>
                    <input
                      className={styles.input}
                      type='password'
                      name='password'
                      autocomplete="current-password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder='********'
                    />
                     <a onClick={() => setFormType('signup')} className={styles.b}>{`Don't have an account? Sign up!`}</a>
                  </div>
                </>
              )}
            </>
          )}
          {form === 2 && (
            <>
              <h1 className={styles.h1}>Personal Information</h1>
              <div>
                <label className={styles.label}>Username</label>
                <input
                  className={styles.input}
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  placeholder='monkymars'
                />
              </div>
            </>
          )}
          {form === 3 && (
            <>
              <div>
                <h2 className={styles.h2}>Is this correct?</h2>
                <div className={styles.infoCheck}>
                  <label className={styles.label1}>Fullname:</label>
                  <p className={styles.p}>{formData.fullname}</p>
                  <label className={styles.label1}>Email:</label>
                  <p className={styles.p}>{formData.email}</p>
                  <label className={styles.label1}>Password:</label>
                  <p className={styles.p}>{formData.password}</p>
                  <label className={styles.label1}>Username:</label>
                  <p className={styles.p}>{formData.username}</p>
                </div>
              </div>
              <div className={styles.btn_container1}>
                <button className={styles.btnCancel} onClick={() => setForm(1)}>Cancel</button>
                <button className={styles.btnContinue} onClick={createUser}>Continue</button>
              </div>
            </>
          )}
          {form === 1 && (
            <div className={styles.btn_container}>
              <button className={styles.submitBtn}>Submit</button>
            </div>
          )}
          {form === 2 && (
            <div className={styles.btn_container}>
              <button className={styles.submitBtn}>Submit</button>
            </div>
          )}
        </form>
      )}
      {bannerVisible && (
       <Banner text={bannerText} image={bannerImg}/>
      )}
    </>
  );
}

export function SecondaryNav({ Page }) {
  return(
    <nav>
      <header className={styles.header}>
        <h1 className={styles.ChatNest}><Link href='/'>ChatNest</Link></h1>
        <h1 className={styles.Page}>{Page}</h1>
      </header>
    </nav>
  )
}