import React, { useState } from 'react';
import './login.css';

function LogIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSwitch = () => {
    setIsLoggedIn(prevState => !prevState);
  };

  const loginStatus = isLoggedIn ? 'Logged In' : 'Logged Out';

  return (
    <div className="login">
      <button className={isLoggedIn ? 'switch on' : 'switch off'} onClick={handleSwitch}>
        <span className="slider"></span>
      </button>
      <span className="switch-label">{loginStatus.replace(/(\b\w)/gi, c => c.toUpperCase())}</span>
    </div>
  );
}

export default LogIn;


