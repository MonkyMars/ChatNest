import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/Messages.module.css';
import Nav from '../components/Nav.jsx';
import Banner from '../components/Banner.jsx';
import Image from 'next/image';
import Head from 'next/head';
import PocketBase from 'pocketbase';
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_IP);

export default function Messages() {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [receivingEnd, setReceivingEnd] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [addFriendVisible, setAddFriendVisible] = useState(false);
  const [addFriendValue, setAddFriendValue] = useState('');
  const [sender, setSender] = useState('');
  const [friends, setFriends] = useState([]);
  const [friendAvatars, setFriendAvatars] = useState({});
  const [userIcon, setUserIcon] = useState(1);
  const [userBanner, setUserBanner] = useState('');
  const [user2Icon, setUser2Icon] = useState(1);
  const [user2Banner, setUser2Banner] = useState('');
  const [user2FriendsSince, setUser2FriendsSince] = useState('')
  const [receivingEndIcon, setReceivingEndIcon] = useState('');
  const [profileCardVisible, setProfileCardVisible] = useState(false);
  const [profileCardVisibleType, setProfileCardVisibleType] = useState('');
  const [friendListVisible, setFriendListVisible] = useState(false);
  const [friendListVisibleType, setFriendListVisibleType] = useState('all');
  const [bannerText, setBannerText] = useState('');
  const [bannerImg, setBannerImg] = useState('');
  const [bannerVisible, setBannerVisible] = useState(false);
  const [dates, setDates] = useState([]);
  const [mentionCount, setMentionCount] = useState(0);
  const [mentionMenuVisible, setMentionMenuVisible] = useState(false)
  
  useEffect(() => {
    if(inputMessage.includes(' @')) {
      setMentionCount(1)
    } else {
      setMentionCount(0)
    }
  }, [inputMessage])

  useEffect(() => {
    if(mentionCount === 1) {
      setMentionMenuVisible(true);
    } else{
      setMentionMenuVisible(false);
    }
  }, [mentionCount])
  
  useEffect(() => {
    setDates(JSON.parse(localStorage.getItem('dates')) || [])
  }, [])
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }

    const insertNewDate = () => {
      if (messages.length === 0) return;

      const lastMessageDate = messages[messages.length - 1].date;
      const currentDate = new Date().toISOString().slice(5, 10);

      if (lastMessageDate !== currentDate) {
        setDates([...dates, currentDate]);
        localStorage.setItem('dates', JSON.stringify([...dates, currentDate]));
      }
    };

    insertNewDate();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('dates', JSON.stringify(dates));
  }, [dates]);
  
  useEffect(() => {
    const fetchUserData = () => {
      const userData = localStorage.getItem('pocketbase_auth');
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          const { model } = parsedData;
          setSender(model.username);
          setUserIcon(model.avatar);
          setUserBanner(model.banner);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };
    fetchUserData();
    document.title = 'ChatNest | Messages';
  }, []);

  useEffect(() => {
    const fetchReceivingEnd = async () => {
      if(receivingEnd !== '') {
        try {
        const receivingEndRecord = await pb.collection('users').getFullList({
          filter: `username = "${receivingEnd}"`
        });
        if(receivingEndRecord.length > 0) {
          setUser2Banner(receivingEndRecord[0].banner);
          setUser2Icon(receivingEndRecord[0].avatar);
        }
            } catch (error) {
                console.error('Error fetching receiving end profile', error)
                            }
                              }
  }
    fetchReceivingEnd();
  }, [receivingEnd])
  
  useEffect(() => {
    if (sender) {
      const fetchFriendsAndAvatars = async () => {
        try {
          const friendsList = await pb.collection('friends').getFullList({
            filter: `status = "accepted" && (user1 = "${sender}" || user2 = "${sender}")`,
          });

          if (friendsList.length > 0) {
            setFriends(friendsList);

            const usernames = new Set();
            friendsList.forEach(friend => {
              usernames.add(friend.user1 === sender ? friend.user2 : friend.user1);
            });

            const userFilter = Array.from(usernames)
              .map(username => `username = "${username}"`)
              .join(' || ');

            const userRecords = await pb.collection('users').getFullList({
              filter: userFilter,
            });
            
            const userAvatarMap = userRecords.reduce((acc, user) => {
              acc[user.username] = user.avatar || '';
              return acc;
            }, {});

            setFriendAvatars(userAvatarMap);

            const defaultFriend = friendsList[0];
            const defaultReceiver = defaultFriend.user1 === sender ? defaultFriend.user2 : defaultFriend.user1;
            setReceivingEnd(defaultReceiver);
            setReceivingEndIcon(userAvatarMap[defaultReceiver] || '');
          }
        } catch (error) {
          console.error('Error fetching friends and avatars:', error.message || error);
        }
      };
      fetchFriendsAndAvatars();
    }
  }, [sender]);



  useEffect(() => {
    const fetchMessages = async () => {
      if (sender && receivingEnd) {
        try {
          const fetchedMessages = await pb.collection('messages').getFullList({
            filter: `(sender = "${sender}" && receiver = "${receivingEnd}") || (sender = "${receivingEnd}" && receiver = "${sender}")`,
          });

          const messagesData = fetchedMessages.map((msg) => ({
            type: msg.sender === sender ? 'send' : 'receive',
            content: msg.content,
            timestampTime: msg.timestamp,
            date: msg.date,
            id: msg.id
          }));
          const receivingEndRecord = await pb.collection('users').getFullList({
            filter: `username = "${receivingEnd}"`,
          });

          setReceivingEndIcon(receivingEndRecord[0]?.avatar || '');
          setMessages(messagesData);
        } catch (error) {
          setBannerText('Error fetching messages');
          setBannerImg('error.png');
          setBannerVisible(true);
          setTimeout(() => {
            setBannerVisible(false)
          }, 4500)
        }
      }
    };
    fetchMessages();

    
    
    const handleSubscription = (e) => {
      if ((e.record.sender === sender && e.record.receiver === receivingEnd) ||
          (e.record.sender === receivingEnd && e.record.receiver === sender)) {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            type: e.record.sender === sender ? 'send' : 'receive',
            content: e.record.content,
            timestampTime: e.record.timestamp,
            date: e.record.date,
            id: e.record.id
          }
        ]);
      }
    };

    pb.collection('messages').subscribe('*', handleSubscription);

    return () => {
      pb.collection('messages').unsubscribe('*', handleSubscription);
    };
  }, [sender, receivingEnd]);

  useEffect(() => {
    if (addFriendValue.length > 12) {
      setAddFriendValue(addFriendValue.slice(0, 12));
    }
  }, [addFriendValue]);

  const handleCloseFriend = () => setAddFriendVisible(!addFriendVisible);

  const handleAddFriend = async () => {
    if (addFriendValue.trim()) {
      try {
        const trimmedValue = addFriendValue.trim();
        const userCheck = await pb.collection('users').getFullList({
          filter: `username = '${trimmedValue}'`,
        });

        if (userCheck.length > 0) {
          const friendUsername = userCheck[0].username;
          const existingFriendship = await pb.collection('friends').getFullList({
            filter: `((user1 = '${sender}' && user2 = '${friendUsername}') || (user1 = '${friendUsername}' && user2 = '${sender}')) && status != "accepted"`,
          });

          if (existingFriendship.length === 0) {
            await pb.collection('friends').create({
              'user1': sender,
              'user2': friendUsername,
              'status': 'pending',
              'sender': sender,
            });
            setBannerText('Friend request sent successfully');
            setBannerImg('accept.png');
            setBannerVisible(true);
            setTimeout(() => {
              setBannerVisible(false)
            }, 4500)
          } else {
            setBannerText('Friendship already exists');
            setBannerImg('error.png');
            setBannerVisible(true);
            setTimeout(() => {
              setBannerVisible(false)
            }, 4500)
          }
        } else {
          setBannerText('User not found');
          setBannerImg('error.png');
          setBannerVisible(true);
          setTimeout(() => {
            setBannerVisible(false)
          }, 4500)
        }
      } catch (error) {
        setBannerText('Error adding friend, please try again later');
        setBannerImg('error.png');
        setBannerVisible(true);
        setTimeout(() => {
          setBannerVisible(false)
        }, 4500)
      }
    }
    handleCloseFriend();
    setAddFriendValue('');
  };

  const handleSend = async () => {
    if (inputMessage.trim() && receivingEnd !== '') {
      const messageToSend = inputMessage;
      setInputMessage('');
      try {
        await pb.collection('messages').create({
          'content': messageToSend,
          'sender': sender,
          'receiver': receivingEnd,
          'timestamp': new Date().toTimeString().slice(0, 5),
          'date': new Date().toISOString().slice(5, 10),
          'status': 'send',
        });
      } catch (error) {
        setBannerText('Error sending message, please try again later');
        setBannerImg('error.png');
        setBannerVisible(true);
        setTimeout(() => {
          setBannerVisible(false)
        }, 4500)
      }
    }
  };

  const handleEntersend = (event) => {
    if (event.key === 'Enter' && inputMessage !== '') {
      handleSend();
    }
  }
  
  const handleFriendSelect = (friend) => {
    const selectedReceiver = friend.user1 === sender ? friend.user2 : friend.user1;
    setReceivingEnd(selectedReceiver);
  };
  
  const handleProfileReceiveClick = async () => {
    try {
      const receivingEndRecord = await pb.collection('users').getFullList({
        filter: `username = "${receivingEnd}"`
      });
      setUser2FriendsSince(receivingEndRecord[0].updated.slice(0, 10));
    } catch (error) {
      setBannerText('Error fetching profile');
      setBannerImg('error.png');
      setBannerVisible(true);
      setTimeout(() => {
        setBannerVisible(false)
      }, 4500)
    }

    setProfileCardVisibleType('received');
    setProfileCardVisible(!profileCardVisible);
  };
  
  const handleProfileSentClick = () => {
    setProfileCardVisibleType('sent');
    setProfileCardVisible(!profileCardVisible);
  };

  const handleFriendList = () => {
    setFriendListVisible(!friendListVisible);
  };

  const handleMentionReceiver = () => {
    setInputMessage(`${inputMessage}${receivingEnd}`);
    setMentionMenuVisible(false);
  }
  const handleMentionSender = () => {
    setInputMessage(`${inputMessage}${sender}`);
    setMentionMenuVisible(false);
  }
  return (
    <>
      <Head>
        <title>ChatNest | Messages</title>
      </Head>
      <Nav page='messages'/>
      <div className={styles.Toolbar}>
        <Image src='/friendadd.png' onClick={handleCloseFriend} alt="Add Friend"  width={100} height={100}/>
        <Image src='/friend.png' onClick={handleFriendList} alt="Friend List"  width={100} height={100}/>
        <h1>Friends</h1>
      </div>
      <div className={styles.messageList}>
        {friends.map((friend, index) => {
          const receiver = friend.user1 === sender ? friend.user2 : friend.user1;
          return (
            <MessageItem
              key={index}
              MessageItemValue={`Item${index + 1}`}
              Receiver={receiver}
              ReceiverIcon={friendAvatars[receiver] || 1} 
              setReceivingEnd={setReceivingEnd}
              sender={sender}
            />

          );
        })}
      </div>
      <main className={styles.main}>
        <div className={styles.MessageContainer} ref={messagesEndRef}>
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              {index === 0 || messages[index - 1].date !== message.date ? (
                <div className={styles.newDate}>
                  {message.date}
                </div> 
              ) : null}
              {message.type === 'send' ? (
              <div key={index} className={styles.MessagesSend}>
                <MessageSend
                  key={index}
                  content={message.content}
                  user={sender}
                  userIcon={userIcon}
                  timestamp={message.timestampTime}
                  handleProfileVisible={handleProfileSentClick}
                />
              </div>
              ) : (
              <div key={index} className={styles.MessagesReceive}>
                <MessageReceive
                  content={message.content}
                  user={receivingEnd}
                  userIcon={receivingEndIcon}
                  timestamp={message.timestampTime}
                  handleProfileVisible={handleProfileReceiveClick}
                  profileCardVisible={profileCardVisible}
                />
              </div>

              )}
            </React.Fragment>
          ))}

        </div>
        <div className={`${styles.inputDiv} ${inputMessage ? styles.activated : ''}`}>
          <input
            ref={inputRef}
            placeholder={`Message ${receivingEnd}`}
            id='messageInput'
            className={styles.input}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleEntersend}
          />
          {inputMessage && (
            <button className={styles.send} id='sendButton' onClick={handleSend}>
              <Image src='/send.png' alt='Send'  width={100} height={100} />
            </button>
          )}
        </div>
        {receivingEnd !== '' && <span className={styles.ReceivingEndSpan}>{receivingEnd}</span>}

        {mentionMenuVisible && 
          <div className={styles.mentionMenu}>
            <label onClick={handleMentionReceiver}>{receivingEnd}</label>
            <label onClick={handleMentionSender}>{sender}</label>
          </div>
        }
      </main>
      {addFriendVisible && (
        <div className={styles.AddFriend}>
          <h1>Add Friend</h1>
          <input
            placeholder='Add a friend'
            value={addFriendValue}
            onChange={(e) => setAddFriendValue(e.target.value)}
          />
          <div className={styles.btnDiv}>
            <button className={styles.closeBtn} onClick={handleCloseFriend}>Close</button>
            <button className={styles.confirmBtn} onClick={handleAddFriend}>Add</button>
          </div>
        </div>
      )}
      {profileCardVisible && profileCardVisibleType === 'sent' && (
        <ProfileCard
          banner={userBanner}
          icon={userIcon}
          username={sender}
        />
      )}
      {profileCardVisible && profileCardVisibleType === 'received' && (
        <ProfileCard
          banner={user2Banner}
          icon={user2Icon}
          username={receivingEnd}
          friendsSince={user2FriendsSince}
          friendsSinceText='Friends Since:'
        />
      )}
      {friendListVisible && (
        <FriendList
          friends={friends}
          sender={sender}
          friendAvatars={friendAvatars || 1}
          friendListVisibleType={friendListVisibleType}
          setFriendListVisibleType={setFriendListVisibleType}
          handleFriendSelect={handleFriendSelect}
          handleFriendList={() => setFriendListVisible(false)}
          setAddFriendVisible={setAddFriendVisible}
        />
      )}
      {bannerVisible && <Banner text={bannerText} image={bannerImg}/>}
    </>
  );
}

export function MessageItem({
  MessageItemValue,
  Receiver,
  ReceiverIcon,
  Type,
  handleAccept,
  handleCancel,
  setReceivingEnd,
  sender
}) {
  const [contextMenu, setContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [warningFriendDeletion, setWarningFriendDeletion] = useState(false);
  const [warningFriendDeletionAccepted, setWarningFriendDeletionAccepted] = useState(false);
  
  const left = contextMenuPosition.x - 460;
  const top = contextMenuPosition.y - 240;
  const clickReceivingEnd = () => {
    setReceivingEnd(Receiver);
  }

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu(true);
    setContextMenuPosition({ x: e.pageX, y: e.pageY });
  };
useEffect(() => {
const deleteFriend = async () => {
    if(warningFriendDeletionAccepted) {
       try {
      const records = await pb.collection('friends').getFullList({
        filter: `(user1 = "${sender}" && user2 = "${Receiver}") || (user1 = "${Receiver}" && user2 = "${sender}")`
      });
      if (records.length > 0) {
        const friendId = records[0].id;
        await pb.collection('friends').delete(friendId);
      } 
    } catch (error) {
      console.error('Error deleting friend', error);
    } finally {
      setWarningFriendDeletion(false);
    }
  } else {
      setWarningFriendDeletion(false)
  }
}
  deleteFriend();
}, [warningFriendDeletionAccepted])
  

 const handleAcceptDeletion = () => {
   setWarningFriendDeletion(false);
   setWarningFriendDeletionAccepted(true);
 }
const handleDeleteButton = () => {
  setContextMenu(false);
  setWarningFriendDeletion(true)
}
  
  return (
    <>
      <div
        data-value={MessageItemValue}
        className={styles.messageItem}
        onClick={clickReceivingEnd}
        onContextMenu={handleContextMenu}
      >
        <Image src={`/Avatars/Pfp${ReceiverIcon}.png`} alt={`${Receiver} icon`} className={styles.ItemImg} width={50} height={50} />
        <label className={styles.ItemLabel}>{Receiver}</label>
        {Type === 'pending' && (
          <div className={styles.btnDiv}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
            >
              <Image src="/reject.png" alt="Reject" width={50} height={50} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAccept();
              }}
            >
              <Image src="/accept.png" alt="Accept" width={50} height={50} />
            </button>
          </div>
        )}
      </div>
      {contextMenu && (
        <div className={styles.contextMenu} style={{ left: left, top: top }}>
          <label onClick={handleDeleteButton}>Delete Friend</label>
          <label onClick={clickReceivingEnd}>Send Message</label>
          <label onClick={() => setContextMenu(false)}>Close</label>
        </div>
      )}
      {warningFriendDeletion && (
        <div className={styles.friendWarning}>
          <h1>Are you sure you want to delete {Receiver}?</h1>
          <div className={styles.buttonDiv}>
            <button onClick={() => setWarningFriendDeletion(false)}>Cancel</button>
            <button onClick={handleAcceptDeletion}>Accept</button>
          </div>
        </div>
      )}
    </>
  );
}

export function MessageReceive({content, user, userIcon, timestamp, handleProfileVisible}) {
  return(
    <>
      <div className={styles.MessageReceive}>
        <div className={styles.MessageReceive_details} onClick={handleProfileVisible}>
          <Image src={`/Avatars/Pfp${userIcon}.png`} className={styles.MessageReceive_img} alt='userIcon' width={50} height={50}/>
          <label className={styles.MessageReceive_sender}>{user}</label>
        </div>
        <p className={styles.MessageReceive_content}>{content}</p>
        <label className={styles.MessageReceive_timestamp}>{timestamp}</label>
      </div>
    </>
  )
}

export function MessageSend({ content, user, userIcon, timestamp, handleProfileVisible}) {
  return(
    <>
      <div className={styles.MessageSend}>
        <div className={styles.MessageSend_details} onClick={handleProfileVisible}>
          <Image src={`/Avatars/Pfp${userIcon}.png`} className={styles.MessageSend_img} alt="userIcon" width={50} height={50} />
          <label className={styles.MessageSend_sender}>{user}</label>
        </div>
        <p className={styles.MessageSend_content}>{content}</p>
        <label className={styles.MessageSend_timestamp}>{timestamp}</label>
      </div>
    </>
  );
}

const ProfileCard = ({ banner, icon, username, friendsSince, friendsSinceText }) => (
  <div className={styles.ProfileMenu_div}>
    <Image width={500} height={500} src={`/${banner}`} alt='banner' className={styles.ProfileMenu_banner} />
    <div className={styles.ProfileMenu_details}>
      <Image src={`/Avatars/Pfp${icon}.png`} className={styles.ProfileMenu_img} alt={username} width={50} height={50}/>
      <label className={styles.ProfileMenu_label}>{username}</label>
      <label className={styles.ProfileMenu_date}>{friendsSinceText} {friendsSince}</label>
    </div>
  </div>
);

const FriendList = ({ friends, sender, friendAvatars, friendListVisibleType, setFriendListVisibleType, handleFriendSelect, handleFriendList, setAddFriendVisible, setReceivingEnd }) => (
  <div className={styles.friendList}>
    <div className={styles.btnContainer}>
      <button onClick={() => setFriendListVisibleType('all')}>All</button>
      <button onClick={() => setFriendListVisibleType('pending')}>Pending</button>
      <button onClick={() => setAddFriendVisible(true)}>Add Friend</button>
    </div>
    <h1>Friends List</h1>
    <main>
      {friendListVisibleType === 'all' && friends.map((friend, index) => {
        const receiver = friend.user1 === sender ? friend.user2 : friend.user1;
        return (
          <MessageItem
            key={index}
            MessageItemValue={`Item${index + 1}`}
            Receiver={receiver}
            ReceiverIcon={friendAvatars[receiver] || 1}
            setReceivingEnd={() => setReceivingEnd}
            sender={sender}
          />
        );
      })}
      {friendListVisibleType === 'pending' && (
        <PendingFriendRequests sender={sender} />
      )}
    </main>
    <button className={styles.CloseBtn} onClick={handleFriendList}>Close</button>
  </div>
);

const PendingFriendRequests = ({ sender }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const pendingList = await pb.collection('friends').getFullList({
          filter: `status = "pending" && sender != "${sender}" && (user1 = "${sender}" || user2 = "${sender}")`,
        });
        setPendingRequests(pendingList);
      } catch (error) {
        console.error('Error fetching pending friend requests:', error);
      }
    };
    fetchPendingRequests();
  }, [sender]);

  const handleFriendRequestAccept = async (requestId) => {
    try {
      const data = { 'status': 'accepted' };
      await pb.collection('friends').update(requestId, data);
      setPendingRequests((prev) => prev.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleFriendRequestCancel = async (requestId) => {
    try {
      const data = { 'status': 'rejected' };
      await pb.collection('friends').update(requestId, data);
      setPendingRequests((prev) => prev.filter(request => request.id !== requestId));
      console.log('Friend request rejected');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  return (
    <>
      {pendingRequests.length !== 0 ? <>
        {pendingRequests.map((request, index) => {
          const receiver = request.user1 === sender ? request.user2 : request.user1;
          return (
            <MessageItem
              key={index}
              MessageItemValue={`Item${index + 1}`}
              Receiver={receiver}
              ReceiverIcon={1}
              Type='pending'
              handleAccept={() => handleFriendRequestAccept(request.id)}
              handleCancel={() => handleFriendRequestCancel(request.id)}
            />
          );
        })} </>
      : <h1>No pending requests</h1>}
    </>
  );
};
