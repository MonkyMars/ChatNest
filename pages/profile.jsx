import React, { useEffect, useState } from 'react';
import styles from '/styles/Profile.module.css';
import Nav from '../components/Nav.jsx';
import PocketBase from 'pocketbase';
import Link from 'next/link';
import Head from 'next/head'
import Image from 'next/image';
import Banner from '../components/Banner.jsx';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_IP);

export default function Profile() {
  const [bannerSrc, setBannerSrc] = useState('testbanner.jpeg');
  const [bannerNumber, setBannerNumber] = useState(1);
  const [username, setUsername] = useState('guest');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [ID, setID] = useState('');

  const [editingFullname, setEditingFullname] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);

  const [iconSelectVisible, setIconSelectVisible] = useState(false);
  const [iconSelected, setIconSelected] = useState(null);
  const [avatar, setAvatar] = useState(1);

  const [bannerText, setBannerText] = useState('');
  const [bannerImg, setBannerImg] = useState('');
  const [bannerVisible, setBannerVisible] = useState(false);

      const bannerMapping = {
      1: '/Banners/banner1.jpeg',
      2: '/Banners/banner2.webp',
      3: '/Banners/banner3.webp',
      4: '/Banners/banner4.gif',
      5: '/Banners/banner5.webp',
      6: '/Banners/banner6.gif',
      7: '/Banners/banner7.gif',
    };

  useEffect(() => {

    const userData = localStorage.getItem('pocketbase_auth');
    const fetchUserData = async () => {
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          const { model } = parsedData;
          setID(model.id);
          setFullname(model.name);
          setEmail(model.email);
          setPhone(model.phone);
          setPassword(model.password);
          setUsername(model.username || 'guest');
          setAvatar(model.avatar || 1);
          setBannerSrc(model.banner || 'banner1.jpeg');
          setBannerNumber(Object.keys(bannerMapping).find(key => bannerMapping[key] === model.banner) || 1);
        } catch (error) {
          setBannerText('Error fetching userdata');
          setBannerImg('error.png');
          setBannerVisible(true);
          setTimeout(() => {
            setBannerVisible(false)
          }, 4500)
          console.error(error)
        }
      }
    };
    fetchUserData();
  }, []);

  async function UpdateAvatar(i) {
      try {
        const user = localStorage.getItem('pocketbase_auth');
        if (user) {
          const data = {
            'avatar': i,
          };
          const userJson = JSON.parse(user);
          await pb.collection('users').update(userJson.model.id, data);
        }
      } catch (error) {
        setBannerText('Error updating avatar');
        setBannerImg('error.png');
        setBannerVisible(true);
        setTimeout(() => {
          setBannerVisible(false)
        }, 4500)
      } finally {
        window.location.href = '/profile';
      }
  }

  async function UpdateBanner() {
    try {
      const user = localStorage.getItem('pocketbase_auth');
      if (user) {
        const data = {
          'banner': bannerSrc,
        };
        const userJson = JSON.parse(user);
        await pb.collection('users').update(userJson.model.id, data);
      }
    } catch (error) {
      setBannerText('Error updating banner');
      setBannerImg('error.png');
      setBannerVisible(true);
      setTimeout(() => {
        setBannerVisible(false)
      }, 4500)
    }
  }

  const updateBanner = (newBannerNumber) => {
    const bannerSrc = bannerMapping[newBannerNumber] || 'testbanner.jpeg';
    setBannerSrc(bannerSrc);
    setBannerNumber(newBannerNumber);
  };

  const incrementBannerNumber = () => {
    const newBannerNumber = (bannerNumber % 7) + 1;
    updateBanner(newBannerNumber);
  };

  const decrementBannerNumber = () => {
    const newBannerNumber = ((bannerNumber - 2 + 3) % 7) + 1;
    updateBanner(newBannerNumber);
  };

  const toggleEditing = (setter, e) => {
    setter((prevState) => !prevState);
    if (e.currentTarget.className.includes('buttonSave')) {
      handleSave();
    }
  };

  const handleSave = async () => {
    const data = {
      'name': fullname,
      'username': username,
      'email': email,
      'password': password,
      'passwordConfirm': password,
      'phone': phone,
    };
    await pb.collection('users').update(ID, data);
  };

  return (
    <>
      <Head>
        <title>ChatNest | Profile</title>
      </Head>
      <Nav Page="Profile" />

      <main className={styles.main}>
          <button className={styles.return_button}>
            <Link href='/xyz'>
               Return to ChatNest
            </Link>
          </button>
        <div className={styles.profile}>
          <div className={styles.banner_div}>
            <Image width={500} height={500} src={`/Banners/${bannerSrc}`} className={styles.profile_banner} alt="Banner" priority />
            <label onClick={decrementBannerNumber} className={styles.banner_left}>
              &#8678;
            </label>
            <label className={styles.banner_right} onClick={incrementBannerNumber}>
              &#8680;
            </label>
            <label className={styles.number}>{bannerNumber}/7</label>
          </div>
          <Image
            src="/settingsIcon.png"
            className={styles.SettingsIcon}
            onClick={() => (window.location.href = '/settings')}
            width={500} height={500}
            alt='settings'
          />
          <div className={styles.profile_details}>
            <div className={styles.icon_div}>
              <Image src={`/Avatars/Pfp${avatar}.png`} className={styles.profile_icon} alt="Icon" width={500} height={500}/>
              <div className={styles.pencil_div} onClick={() => setIconSelectVisible(true)}>
                <Image width={50} height={50} className={styles.pencil} src="/pen-50.png" alt='edit' />
              </div>
            </div>

            <label className={styles.profile_label}>{username}</label>
          </div>
          <button className={styles.SaveChanges} onClick={UpdateBanner}>
            Save Changes
          </button>
        </div>

        <div className={styles.you}>
          <h1 className={styles.profile_h1}>Personal Information</h1>

          <label className={styles.you_label}>Fullname</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            disabled={!editingFullname}
            className={styles.you_input}
          />
          <button
            onClick={(e) => toggleEditing(setEditingFullname, e)}
            className={editingFullname ? styles.buttonSave : styles.buttonEdit}
          >
            {editingFullname ? 'Save' : 'Edit'}
          </button>

          <label className={styles.you_label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editingEmail}
            className={styles.you_input}
          />
          <button
            onClick={(e) => toggleEditing(setEditingEmail, e)}
            className={editingEmail ? styles.buttonSave : styles.buttonEdit}
          >
            {editingEmail ? 'Save' : 'Edit'}
          </button>

          <label className={styles.you_label}>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!editingPhone}
            className={styles.you_input}
          />
          <button
            onClick={(e) => toggleEditing(setEditingPhone, e)}
            className={editingPhone ? styles.buttonSave : styles.buttonEdit}
          >
            {editingPhone ? 'Save' : 'Edit'}
          </button>

          <label className={styles.you_label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!editingPassword}
            className={styles.you_input}
          />
          <button
            onClick={(e) => toggleEditing(setEditingPassword, e)}
            className={editingPassword ? styles.buttonSave : styles.buttonEdit}
          >
            {editingPassword ? 'Save' : 'Edit'}
          </button>

          <label className={styles.you_label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!editingUsername}
            className={styles.you_input}
          />
          <button
            onClick={(e) => toggleEditing(setEditingUsername, e)}
            className={editingUsername ? styles.buttonSave : styles.buttonEdit}
          >
            {editingUsername ? 'Save' : 'Edit'}
          </button>
        </div>
      </main>

      {iconSelectVisible && (
        <>
          <AvatarSelection onClose={() => setIconSelectVisible(false)} setSelected={() => setIconSelected} selected={iconSelected} updateAvatar={UpdateAvatar}/>
        </>
      )}
      {bannerVisible && (
       <Banner text={bannerText} image={bannerImg}/>
      )}
    </>
  );
}

const AvatarSelection = ({onClose, setSelected, updateAvatar}) => {
  const [page, setPage] = useState(0);
  const [pageType, setPageType] = useState('');
  
  const togglePageType = (Q) => {
    setPage(1);
    setPageType(Q);
  }
  
  const avatarCategories = {
    Zebra: [13, 14, 15, 16],
    Parrot: [17, 18, 19, 20],
    Squirrel: [21, 22, 23, 24, 65],
    Birds: [25, 26, 27, 28, 29, 30, 31],
    Tiger: [32, 33, 34, 35, 36],
    Panther: [37, 38, 39, 40, 41],
    Toucan: [42, 43, 59],
    Deer: [44, 45, 46, 47],
    Dog: [48, 49, 50, 51, 56],
    Rabbit: [52, 53, 54, 63, 66],
    Fox: [55, 61, 82, 83, 84],
    Nature: [57, 64, 67, 68, 69, 70, 71, 72, 73, 74],
    Cat: [58, 75, 76],
    Panda: [60, 12, 80, 81],
    Fret: [62, 77, 78, 79],
  };

  return (
    <div className={styles.AvatarSelection}>
      <button onClick={() => setPage(0)} className={styles.Return}>Return</button>
      <button onClick={onClose} className={styles.Close}>X</button>
      <h1>Avatar Selection</h1>
      <main className={styles.AvatarSelectionMain}>
        {page === 0 && (
          <>
            {Object.entries(avatarCategories).map(([category, avatars]) => (
              <AvatarItemCategory
                key={category}
                i={avatars.length}
                head={`Pfp${avatars[0]}.png`}
                onClick={() => togglePageType(category)}
              />
            ))}
          </>
        )}
        {page === 1 && (
          <AvatarList indices={avatarCategories[pageType]} setSelected={setSelected} updateAvatar={updateAvatar}/>
        )}
      </main>
    </div>
  );
};

export const AvatarItemCategory = ({ i, head, onClick }) => {
  return (
    <div onClick={onClick} className={styles.AvatarItemCategory}>
      <label>{i}</label>
      <Image alt='Avatar Category' src={`/Avatars/${head}`} width={75} height={75} priority />
    </div>
  );
};

export const AvatarItem = ({ i, setSelected, updateAvatar }) => {
  const toggleSelected = (i) => {
    setSelected(i || null);
    updateAvatar(i)
  }
  return (
    <div className={styles.AvatarItem} onClick={() => toggleSelected(i)}>
      <Image alt='Avatar' src={`/Avatars/Pfp${i}.png`} width={75} height={75} priority />
    </div>
  );
};

export const AvatarList = ({ indices, setSelected, updateAvatar }) => {
  return (
    <div id='container' className={styles.AvatarList}>
      {indices.map((i) => (
        <AvatarItem key={i} i={i} setSelected={setSelected} updateAvatar={updateAvatar}/>
      ))}
    </div>
  );
};