import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "http://schema.org",
                "@type": "SoftwareApplication",
                "name": "ChatNest",
                "description": "ChatNest is an app designed for ease of use and speed. Step into an amazing new chatting platform. Share and chat in ChatNest.",
                "applicationCategory": "Communication",
                "operatingSystem": "All",
                "url": "https://chatnest.me",
                "image": "/Logo/LOGO.png"
              }),
            }}
          />
          <meta charSet="UTF-8" />
          <meta name="description" content="ChatNest is an app designed for ease of use and speed. Step into an amazing new chatting platform. Share and chat in ChatNest." />
          <meta name="keywords" content="
            ChatNest,
            Chat,
            chatnest,
            Chatnest,
            chatting,
            social,
            social media,
            socialmedia,
            LeviNoppers,
            Levi,
            Noppers,
            Levi Noppers,
            messaging platform,
            instant messaging,
            group chat,
            private chat,
            secure messaging,
            online communication,
            real-time chat,
            chat with friends,
            chat rooms,
            social networking,
            share and chat,
            fast messaging,
            easy-to-use chat app,
            chatting platform,
            connect with friends,
            message app,
            mobile chat app,
            desktop chat app,
            web chat app,
            encrypted chat,
            voice messages,
            media sharing,
            image sharing,
            video sharing,
            chat application,
            free chat app,
            cross-platform chat,
            chat notifications,
            customizable chat,
            user-friendly chat,
            high-speed chat,
            chat app for everyone,
            next-generation chat,
            seamless communication,
            interactive chat,
            chat app features
          "/>
          <link rel="icon" href="/Logo/LOGO.png" />
          <meta name="author" content="ChatNest" />
          <meta name="robots" content="index, follow" />
          <meta property="og:title" content="ChatNest" />
          <meta property="og:description" content="ChatNest is an app designed for ease of use and speed. Step into an amazing new chatting platform. Share and chat in ChatNest."/>
          <meta property="og:image" content="/Logo/LOGO.png" />
          <meta property="og:url" content="https://chatnest.me" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="ChatNest" />
          <meta name="twitter:description" content="ChatNest is an app designed for ease of use and speed. Step into an amazing new chatting platform. Share and chat in ChatNest." />
          <meta name="twitter:image" content="/Logo/LOGO.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
