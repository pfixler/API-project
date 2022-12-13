import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </li>
    );
  }

  return (
    <div>
      <ul className='header'>
        <li>
          <NavLink exact to="/">
            <div className='airbnb-logo'>
              {/* home */}
              <img className='airbnb-logo' src="https://www.logosurfer.com/wp-content/uploads/2018/03/airbnb-logo_1.png"  alt="Airbnb Logo" />
            </div>
          </NavLink>
        </li>
        {/* <button onclick="myFunction()" class="dropbtn">Dropdown</button>
        <div id="myDropdown" class="header-dropdown-content"> */}

          {isLoaded && sessionLinks}
        {/* </div> */}
      </ul>
      {/* {icons} */}
      {/* {cards} */}
      {/* {footer} */}
    </div>
  );
}

export default Navigation;
