// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import './Navigation.css';
import { NavLink, useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/');
  };

  // const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {/* <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button> */}
      <div className="user-informaton"
      // className={ulClassName} ref={ulRef}
      >
        <p>{user.username}</p>
        <p>{user.firstName} {user.lastName}</p>
        <p>{user.email}</p>
      </div>
      <section></section>
        {/* <div className="yes-session-box-item"> */}
          <NavLink to={`/${user.id}/reviews`} target="_blank">
            <button>User Reviews</button>
          </NavLink>

        {/* </div> */}
      <section></section>
        <button onClick={logout}>Log Out</button>
    </>
  );
}

export default ProfileButton;
