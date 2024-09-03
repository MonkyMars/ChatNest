import React, { useEffect, useState } from 'react';
import styles from '../styles/xyz.module.css';
import PocketBase from 'pocketbase';
import Banner from '../components/Banner.jsx';
import Nav from '../components/Nav.jsx';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_IP);

export default function Home() {
  const [formVisible, setFormVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState({});
  const [bannerText, setBannerText] = useState('');
  const [bannerImg, setBannerImg] = useState('');
  const [bannerVisible, setBannerVisible] = useState(false);
  const [randomPosts, setRandomPosts] = useState([]);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const result = await pb.collection('posts').getFullList({});
        setPosts(result);
        setVisiblePosts(
          result.reduce((acc, post) => {
            acc[post.id] = true;
            return acc;
          }, {})
        );
      } catch (error) {
        setBannerText('Failed to fetch posts, please try again later');
        setBannerImg('error.png');
        setBannerVisible(true);
        setTimeout(() => {
          setBannerVisible(false);
        }, 4500);
      }
    }

    fetchPosts();

    const handleSubscription = (e) => {
      switch (e.action) {
        case 'create':
          setPosts((prevPosts) => [...prevPosts, e.record]);
          setVisiblePosts((prevState) => ({
            ...prevState,
            [e.record.id]: true,
          }));
          break;
        case 'update':
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === e.record.id ? e.record : post
            )
          );
          break;
        case 'delete':
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post.id !== e.record.id)
          );
          setVisiblePosts((prevState) => {
            const newState = { ...prevState };
            delete newState[e.record.id];
            return newState;
          });
          break;
        default:
          break;
      }
    };

    pb.collection('posts').subscribe('*', handleSubscription);

    return () => {
      pb.collection('posts').unsubscribe('*', handleSubscription);
    };
  }, []);

  const hidePost = (id) => {
    setVisiblePosts((prevState) => ({
      ...prevState,
      [id]: false,
    }));
  };

  return (
    <>
      <Head>
        <title>ChatNest | xyz</title>
      </Head>
      <Nav page='home'/>
      <main className={styles.main}>
        {posts.map(
          (post) =>
            visiblePosts[post.id] && (
              <Section
                key={post.id}
                id={post.id}
                title={post.title}
                description={post.description}
                date={post.updated.slice(0, 10)}
                username={post.postedBy}
                icon={post.postedByIcon}
                banner={'/' + post.postedByBanner}
                onHide={() => hidePost(post.id)}
                likes={post.likes}
              />
            )
        )}
      </main>
    
         <div className={styles.btn_container}>
        <button
          className={styles.Postadd}
          onClick={() => setFormVisible(!formVisible)}
        >
          {formVisible ? 'Close' : 'Add post'}
        </button>
      </div>
      
     
      {formVisible && <Form formVisible={formVisible} setFormVisible={setFormVisible} />}
      {bannerVisible && <Banner text={bannerText} image={bannerImg} />}
    </>
  );
}

export function Form({setFormVisible, formVisible}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bannerText, setBannerText] = useState('');
  const [bannerImg, setBannerImg] = useState('');
  const [bannerVisible, setBannerVisible] = useState(false);
  
  const Formsubmit = async (event) => {
    event.preventDefault();
    const userData = localStorage.getItem('pocketbase_auth');
    const parsedData = JSON.parse(userData);
    const { model } = parsedData;

    if (title !== '' && description !== '') {
      const data = {
        'title': title,
        'description': description,
        'postedBy': model.username,
        'postedByIcon': model.avatar,
        'postedByBanner': model.banner,
      };
      try {
        await pb.collection('posts').create(data);
        setFormVisible(false);
      } catch (error) {
        setBannerText('Error creating post');
        setBannerImg('error.png');
        setBannerVisible(true);
        setTimeout(() => {
          setBannerVisible(false)
        }, 4500)
      }
    } else {
      setBannerText('Title and description are required');
      setBannerImg('error.png');
      setBannerVisible(true);
      setTimeout(() => {
        setBannerVisible(false)
      }, 4500)
    }
  };

  return (
    <>
      {formVisible && (
        <form className={styles.form} onSubmit={Formsubmit}>
          <h2 className={styles.h2}>Add post</h2>
          <div className={styles.inputdiv}>
            <label htmlFor="title" className={styles.label}>Title:</label>
            <div className={styles.inputDivs}>
              <input
                id="title"
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter the title of your post'
                maxLength={40}
              />
              <span className={styles.charSpan}>{title.length}/40</span>
            </div>
            <label htmlFor="description" className={styles.label}>Description:</label>
            <div className={styles.inputDivs}>
              <textarea
                id="description"
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter the description of your post'
                maxLength={2000}
              />
              <span className={styles.charSpan}>{description.length}/2000</span>
            </div>
          </div>
          <div className={styles.btn_container}>
            <button className={styles.submitBtn} type="submit">Submit</button>
          </div>
        </form>
      )}
      {bannerVisible && (
       <Banner text={bannerText} image={bannerImg}/>
      )}
    </>
  );
}


export function Section({title, description, date, username, icon, banner, likes, id}) {
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [user, setUser] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const userRecord = localStorage.getItem('pocketbase_auth');
    const parsedData = JSON.parse(userRecord);
    const { model } = parsedData;
    setUser(model.username);
  }, [user])

  const toggleProfileMenu = () => {
    setProfileMenuVisible(!profileMenuVisible);
  };
  
  const handleLikes = async () => {
    try {
      const post = await pb.collection('posts').getOne(id);
      
      const likedByArray = post.likedBy ? post.likedBy.split(',').filter(Boolean) : [];

      if (likedByArray.includes(user)) {
        const updatedLikedBy = likedByArray.filter(item => item !== user);
        const data = {
          likes: post.likes - 1,
          likedBy: updatedLikedBy.join(','),  
        };
        await pb.collection('posts').update(id, data);
        setLiked(false);
      } else {
        likedByArray.push(user);
        const data = {
          likes: post.likes + 1,
          likedBy: likedByArray.join(','),  
        };
        await pb.collection('posts').update(id, data);
        setLiked(true)
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  return (
    <div className={styles.section} id='section'>
      
      {!profileMenuVisible && (
        <SectionFront
          title={title}
          description={description}
          date={date}
          likes={likes}
          liked={liked}
          handleLikes={handleLikes}
          toggleProfileMenu={toggleProfileMenu}
        />
      )}
      {profileMenuVisible && (
        <SectionBackProfile
          banner={banner}
          icon={icon}
          username={username}
          toggleProfileMenu={toggleProfileMenu}
        />
      )}
    </div>
  );
}

export function SectionFront({ title, description, date, likes, handleLikes, liked, toggleProfileMenu }) {
  return (
    <div className={styles.section_front}>
      <h1 className={styles.section_title}>{title}</h1>
      <p className={styles.section_description}>{description}</p>

      <div className={styles.Infobar}>
        <Image src='/switch.png' alt='user' width={25} height={25} onClick={toggleProfileMenu}/>
        <label className={styles.section_date}>{date}</label>
        <div className={styles.section_likes} onClick={handleLikes}>
          <label>{likes}</label>
          <div className={styles.section_heart}>
            {liked ? <Image src='/liked.png' alt="like" width={50} height={50} priority/> : <Image src='/unliked.png' alt="dislike" width={50} height={50}/>}
          </div>
        </div>
      </div>
      
    </div>
  );
}

export function SectionBackProfile({ banner, icon, username }) {
  return (
    <div className={styles.section_back}>
      <Image src={banner} className={styles.section_banner} alt="banner" width={500} height={500} priority/>
      <div className={styles.section_details}>
        <Image src={`/Avatars/Pfp${icon}.png`} className={styles.section_img} width={50} height={50} alt='icon' priority/>
        <label className={styles.section_label}>{username}</label>
      </div>
    </div>
  );
}