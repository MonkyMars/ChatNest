import React, { useState, useEffect } from "react";
import styles from "/styles/components/Nav.module.css";
import Link from "next/link";
import Image from "next/image";
import PocketBase from "pocketbase";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_IP);

export default function Nav({ page }) {
  const [username, setUsername] = useState("Guest");
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [bannerSrc, setBannerSrc] = useState("testbanner.jpeg");
  const [avatar, setAvatar] = useState(1);
  const [Id, setId] = useState("");
  const [messageIncomingVisible, setMessageIncomingVisible] = useState(false);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [friendRequestIncomingVisible, setFriendRequestIncomingVisible] =
    useState(false);
  const [incomingFriendRequest, setIncomingFriendRequest] = useState(null);
  const [linkmenuVisible, setLinkmenuVisible] = useState(false);
  const [userData, setUserData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [OnlineStatus, setOnlineStatus] = useState("Online");
  const [tutorial, setTutorial] = useState(true);

  useEffect(() => {
    const UpdateStatus = async () => {
      const data = {
        OnlineStatus: OnlineStatus,
      };
      try {
        await pb.collection("users").update(Id, data);
      } catch (error) {
        console.log(error);
      }
    };
    UpdateStatus();
  }, [OnlineStatus]);

  useEffect(() => {
    if (OnlineStatus !== "DnD" && page !== "messages") {
      if (incomingMessage || incomingFriendRequest) {
        const audio = new Audio("/Sounds/Notification1.wav");
        audio.play();
      }
    }
  }, [incomingMessage, incomingFriendRequest]);

  useEffect(() => {
    if (localStorage.getItem("pocketbase_auth")) {
      setUserData(true);
    } else {
      setUserData(false);
    }
  }, [userData]);

  useEffect(() => {
    const nod = document.getElementById("nod");
    if (nod) {
      if (linkmenuVisible) {
        nod.style.transform = "rotate(0)";
      } else {
        nod.style.transform = "rotate(-180deg)";
      }
    }
  }, [linkmenuVisible]);

  useEffect(() => {
    if (Id === "") {
      const userData = localStorage.getItem("pocketbase_auth");
      const fetchUserData = async () => {
        if (userData) {
          try {
            const parsedData = JSON.parse(userData);
            const { model } = parsedData;
            setUsername(model.username || "guest");
            setAvatar(model.avatar || 1);
            setBannerSrc(model.banner || "testbanner.jpeg");
            setId(model.id);
            setOnlineStatus(model.OnlineStatus);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      };
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    const handleNewMessage = async (e) => {
      if (e.record.receiver === username) {
        const record = await pb.collection("users").getFullList({
          filter: `username = "${e.record.sender}"`,
        });
        const Avatar = record[0].avatar;
        setIncomingMessage({
          content: e.record.content,
          sender: e.record.sender,
          senderAvatar: Avatar,
          senderUsername: e.record.sender,
        });
        setMessageIncomingVisible(true);
        setTimeout(() => {
          setMessageIncomingVisible(false);
        }, 8000);
      }
    };

    const handleNewFriendRequest = async (e) => {
      if (e.record.user2 === username && e.record.status === "pending") {
        const record = await pb.collection("users").getFullList({
          filter: `username = "${e.record.user1}"`,
        });
        const Avatar = record[0].avatar;
        setIncomingFriendRequest({
          sender: e.record.user1,
          senderAvatar: Avatar,
          senderUsername: e.record.user1,
        });
        setFriendRequestIncomingVisible(true);
        setTimeout(() => {
          setFriendRequestIncomingVisible(false);
        }, 8000);
      }
    };

    pb.collection("messages").subscribe("*", handleNewMessage);
    pb.collection("friends").subscribe("*", handleNewFriendRequest);

    return () => {
      pb.collection("messages").unsubscribe("*", handleNewMessage);
      pb.collection("friends").unsubscribe("*", handleNewFriendRequest);
    };
  }, [username]);

  const handleLogout = async () => {
    try {
      pb.authStore.clear();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleLogin = () => {
    window.location.href = "/login";
  };
  const handleAccountStatus = async () => {
    if (OnlineStatus === "Online") {
      setOnlineStatus("DnD");
    } else {
      setOnlineStatus("Online");
    }
  };
  return (
    <>
      <nav className={styles.Nav}>
        <div>
          {page === 'home' ? (
            <>
              <Link href="/messages" onClick={() => setLoading(!loading)}>
              <Image
                src="/chat.png"
                className={styles.chat}
                width={50}
                height={50}
                alt="messages"
              />
            </Link>
            </>
          ) : (
            <Link href="/xyz" onClick={() => setLoading(!loading)}>
                <Image
                  src="/home.png"
                  className={styles.chat}
                  width={50}
                  height={50}
                  alt="home"
                />
              </Link>
          )}
          <Image
            src="/noddown.png"
            id="nod"
            alt="link menu"
            width={50}
            height={50}
            className={`${styles.chat} ${styles.noddown}`}
            onClick={() => setLinkmenuVisible(!linkmenuVisible)}
          />
        </div>
        <header className={styles.header}>
          <h1 className={styles.h1}>ChatNest</h1>
        </header>
        <div
          className={styles.User_div}
          onClick={() => setProfileMenuVisible(!profileMenuVisible)}
        >
          <div className={styles.UserDetails_div}>
            <label className={styles.User_label}>{username}</label>
          </div>
          <Image
            src={`/Avatars/Pfp${avatar}.png`}
            alt={username}
            className={styles.User_img}
            width={50}
            height={50}
          />
        </div>
      </nav>

      <div
        className={styles.ProfileMenu_div}
        style={{
          height: profileMenuVisible ? "320px" : "0",
          transition: "all 0.5s",
          overflow: "hidden",
          outline: profileMenuVisible ? "" : "none",
        }}
      >
        <Image
          src={`/${bannerSrc}`}
          alt="banner"
          className={styles.ProfileMenu_banner}
          width={500}
          height={500}
          priority
        />
        <Link href="/profile">
          {userData && (
            <Image
              src="/pen-50.png"
              className={styles.ProfileMenu_pencil}
              alt="Edit Profile"
              width={50}
              height={50}
              onClick={() => setLoading(!loading)}
            />
          )}
        </Link>
        <div className={styles.ProfileMenu_details}>
          <div className={styles.ProfileMenu_imgDiv}>
            <Image
              src={`/Avatars/Pfp${avatar}.png`}
              className={styles.ProfileMenu_img}
              alt={username}
              width={50}
              height={50}
              priority
            />
            <div
              className={styles.accStatus}
              onClick={handleAccountStatus}
              style={{
                backgroundColor:
                  OnlineStatus === "Online" ? "#08b305" : "#e81f10",
              }}
            ></div>
          </div>

          <label className={styles.ProfileMenu_label}>{username}</label>
        </div>
        <div
          className={styles.ProfileMenu_Btn_Container}
          style={{
            opacity: profileMenuVisible ? "1" : "0",
            transition: "all 1s",
          }}
        >
          <button
            className={styles.ProfileMenu_Btn_Settings}
            onClick={() => setLoading(!loading)}
          >
            <Link href="/settings">Settings</Link>
          </button>
          <button
            className={`${styles.ProfileMenu_Btn} ${
              userData ? styles.Logout : styles.Login
            }`}
            onClick={userData ? handleLogout : handleLogin}
          >
            {userData ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {messageIncomingVisible &&
        page !== "messages" &&
        incomingMessage &&
        OnlineStatus !== "DnD" && (
          <div
            className={styles.Message_incoming_div}
            onClick={() => (window.location.href = "/messages")}
          >
            <div className={styles.Message_incoming_details}>
              <Image
                width={50}
                height={50}
                src={`/${incomingMessage.senderAvatar}`}
                alt={incomingMessage.senderUsername}
              />
              <label>{incomingMessage.senderUsername}</label>
            </div>
            <p>{incomingMessage.content}</p>
            <div className={styles.Message_incoming_tools}>
              <Image
                src="/3dots.png"
                alt="options"
                style={{ transform: "rotate(-90deg)" }}
                draggable={false}
                width={50}
                height={50}
              />
              <Image
                src="/close.png"
                alt="close"
                draggable={false}
                onClick={() => setMessageIncomingVisible(false)}
                width={50}
                height={50}
              />
            </div>
            <div className={styles.timebar}></div>
          </div>
        )}
      {friendRequestIncomingVisible &&
        page !== "messages" &&
        incomingFriendRequest &&
        OnlineStatus !== "DnD" && (
          <div
            className={styles.Message_incoming_div}
            onClick={() => (window.location.href = "/messages")}
          >
            <div className={styles.Message_incoming_details}>
              <Image
                src={`/${incomingFriendRequest.senderAvatar}`}
                alt={incomingFriendRequest.senderUsername}
                width={50}
                height={50}
              />
              <label>{incomingFriendRequest.senderUsername}</label>
            </div>
            <p>
              {incomingFriendRequest.senderUsername} has sent you a friend
              request.
            </p>
            <div className={styles.Message_incoming_tools}>
              <Image
                width={50}
                height={50}
                alt="options"
                src="/3dots.png"
                style={{ transform: "rotate(-90deg)" }}
                draggable={false}
              />
              <Image
                width={50}
                height={50}
                alt="close"
                src="/close.png"
                draggable={false}
                onClick={() => setFriendRequestIncomingVisible(false)}
              />
            </div>
          </div>
        )}

      <div
        className={styles.Linkmenu}
        style={{
          transition: "all 0.5s",
          height: linkmenuVisible ? "125px" : "0",
          overflow: "hidden",
          outline: linkmenuVisible ? "" : "none",
          maxHeight: "125px",
          padding: linkmenuVisible ? "" : "0",
        }}
      >
        <Link href="/xyz">Home</Link>
        <Link href="/messages">Messages</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/settings">Settings</Link>
      </div>

      {loading && <div className={styles.loader}></div>}

    {/*   {tutorial && (
        <div className={styles.tutorial}>
          <h1>ChatNest Guide</h1>
          <p>
            Click 'Continue' to get a quick introduction and tutorial for
            ChatNest
          </p>
          <div>
            <button onClick={() => setTutorial(1)}>Continue</button>
            <button onClick={() => setTutorial(false)}>Cancel</button>
          </div>
        </div>
      )}
      {tutorial === 1 && (
        <>
          <div className={styles.tutorial}>
            <h1>ChatNest Guide</h1>
            <p>
              Introducing the 'home' page, this is where all the magic happens;
              share posts using the yellow 'Add post' button on the bottom right
              of your screen or read other's their posts!
            </p>
            <div>
              <button onClick={() => setTutorial(2)}>
                <Link href="/messages">Continue</Link>
              </button>
              <button onClick={() => setTutorial(false)}>Cancel</button>
            </div>
          </div>
        </>
      )}
      {tutorial === 2 && (
        <>
          <div className={styles.tutorial}>
            <h1>ChatNest Guide</h1>
            <p>Next up is the messaging tab</p>
            <div>
              <button onClick={() => setTutorial(2)}>Continue</button>
              <button onClick={() => setTutorial(false)}>Cancel</button>
            </div>
          </div>
        </>
      )} */}
    </>
  );
}
