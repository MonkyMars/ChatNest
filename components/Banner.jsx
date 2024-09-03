import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

export default function Banner({ text, image }) {
  const bannerStyles = {
    width: 'auto',
    height: '50px',
    top: '120px',
    left: '50%',
    position: 'absolute',
    transform: 'translateX(-50%)',
    background: '#858585',
    borderRadius: '5px',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    zIndex: '99',
    padding: '3px',
    border: '2px solid #ffd91c'
  };

  const imgStyles = {
    width: '50px',
    height: '50px',
  };

  const textStyles = {
    fontFamily: 'poppins',
    fontSize: '1.15rem',
  };

  return (
    <>
      <style>
        {`
          @media screen and (max-width: 1080px) {
            #bannerDiv {
              width: 80vw;
            }
          }
        `}
      </style>
      <div id="bannerDiv" style={bannerStyles}>
        <Image src={`/${image}`} alt="Banner" style={imgStyles} width={50} height={50} priority/>
        <span style={textStyles}>{text}</span>
        <p></p>
      </div>
    </>
  );
}

Banner.propTypes = {
  text: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

Banner.defaultProps = {
  text: 'Default Text',
  image: 'default-image.png',
};
