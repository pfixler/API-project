import React, { useEffect } from 'react';
import { NavLink, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import CreateNewSpotModal from '../CreateNewSpotModal';
import { useState, useRef } from 'react';
import * as sessionActions from "../../store/session";


function Navigation({ isLoaded }){
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const buttonRef = useRef(null)
  const sessionUser = useSelector(state => state.session.user);

  // const demoCredential = "Demo-lition";
  // const demoPassword = "password";
  const demoUserLogin = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential:"Demo-lition", password:"password" }))
  };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className='yes-session-box'>
        <ProfileButton user={sessionUser} />
      </div>
    );
  } else {
    sessionLinks = (
      <div className='no-session-box'>
        <div className='demo-user-box'>
          <button className='demo-user-button' onClick={demoUserLogin}>
            Demo User
          </button>
        </div>
        <div className='log-in-box'>

          <OpenModalButton
            // onClick={setMenu(false)}
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
            />
        </div>
        <div className='sign-up-box'>

          <OpenModalButton
            // onClick={setMenu(false)}
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </div>
      </div>
    );
  }


  const [menuState, setMenuState] = useState(false);

  // const [buttonClose, setButtonClose] = useState(false);

  const clickMenuButton = () => {
    if (menuState === false) {
      // console.log('open')
      setMenuState(true);
    }
    if (menuState === true) {
      // console.log('false')
      setMenuState(false);
    }
    // if (buttonClose === false) {

    // }
    // setButtonClose(false);
  }


  const closeMenu = (e)=>{
    if(menuRef.current && menuState && !menuRef.current.contains(e.target) && buttonRef.current && menuState && !buttonRef.current.contains(e.target)){
      // debugger
      // console.log('close menu')
      setMenuState(false)
      // setButtonClose(true)
    }
}

  document.addEventListener('mousedown', closeMenu);

  return (
    <div className='header-box'>
      <div className='header'>
        <div className='home-box'>
          <NavLink className='home-link' exact to="/">
            <div className='airbnb-logo-box'>
              <i className="fa-brands fa-airbnb"><div className='logo-text'>CloneBnB</div></i>
              {/* <img className='airbnb-logo-image' src="https://www.logosurfer.com/wp-content/uploads/2018/03/airbnb-logo_1.png"  alt="Airbnb Logo" /> */}
            </div>
          </NavLink>
        </div>
        {/* <div className='create-spot-box'>
          <div className='create-spot-button'>
            <OpenModalButton

                      buttonText="Create a Spot"
                      modalComponent={<CreateNewSpotModal/>}
                  />
          </div>
        </div> */}
        <div className='menu-box'>
          <div className='dropdown-menu-box'>
            <button className='dropdown-menu-button' ref={buttonRef} onClick={clickMenuButton}>
              <div className='dashes'>
                <i className="fa-solid fa-bars"></i>
              </div>
              <div className='profile-icon'>
                <i className="fa-solid fa-circle-user"></i>
              </div>

            </button>
            {menuState ? (
              <div className='dropdown-box'>

                <div className='dropdown-items' ref={menuRef} onClick={clickMenuButton}>

                  {isLoaded && sessionLinks}
                </div>
              </div>
            ) : null}
          </div>

        </div>
        {/* </div> */}
      </div>
      {/* <Route path='/spots'>
          <CreateNewSpot />
      </Route> */}
      {/* {icons} */}
      {/* {cards} */}
      {/* {footer} */}
    </div>
  );
}

export default Navigation;
