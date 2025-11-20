import React, { useState } from 'react';
import './Header.css';

function Header() {
  const [showHeaderBar, setShowHeaderBar] = useState(false);

  const contactHandler = () => {
    setShowHeaderBar(!showHeaderBar);
  };

  return (
    <header className="header">
      <div className="header__branding">
        <div className="header-logo">
          Algo<span>Visuals</span>
        </div>
        <p className="header__tagline">Experiment with sorting playlists in real-time.</p>
      </div>

      <div className="header__options">
        <button className="header__option header__option--ghost" onClick={contactHandler}>
          {showHeaderBar ? 'Close' : 'Get in touch'}
        </button>
      </div>

      <div
        className={`header__contact ${showHeaderBar ? 'header__contact--visible' : ''}`}
        aria-hidden={!showHeaderBar}
      >
        <h3 className="header__bar__title">Let&apos;s build together</h3>
        <p className="header__contact-copy">I love collaborations, mentorship chats, and feedback.</p>
        <div className="header__bar__icons">
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
            <img src="https://img.icons8.com/ios/50/000000/facebook--v1.png" alt="" />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <img src="https://img.icons8.com/ios/50/000000/instagram-new--v1.png" alt="" />
          </a>
          <a href="https://github.com/mohdarshil09" target="_blank" rel="noreferrer" aria-label="GitHub">
            <img src="https://img.icons8.com/ios/50/000000/github--v1.png" alt="" />
          </a>
          <a
            href="https://www.linkedin.com/in/mohd-arshil-azim-9b050b258/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <img src="https://img.icons8.com/ios/50/000000/linkedin.png" alt="" />
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;