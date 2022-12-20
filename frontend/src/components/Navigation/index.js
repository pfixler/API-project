import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import CreateNewSpot from '../CreateNewSpot';


function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div>
        <ProfileButton user={sessionUser} />
      </div>
    );
  } else {
    sessionLinks = (
      <div>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </div>
    );
  }

  return (
    <div className='header-box'>
      <div className='header'>
        <div className='home-box'>
          <NavLink className='home-link' exact to="/">
            <div className='airbnb-logo-box'>
            <i class="fa-brands fa-airbnb" width="102" height="32"><div className='logo-text'>CloneBnB</div></i>
              {/* <img className='airbnb-logo-image' src="https://www.logosurfer.com/wp-content/uploads/2018/03/airbnb-logo_1.png"  alt="Airbnb Logo" /> */}
            </div>
          </NavLink>
        </div>
        <div className='create-spot-box'>
          <NavLink className='create-spot-link' to={`/`} target="_blank">

              create new spot
          </NavLink>
        </div>
        {/* <button onclick="myFunction()" class="dropbtn">Dropdown</button>
        <div id="myDropdown" class="header-dropdown-content"> */}

          {isLoaded && sessionLinks}
        {/* </div> */}
      </div>
      <Route path='/spots'>
          <CreateNewSpot />
      </Route>
      {/* {icons} */}
      {/* {cards} */}
      {/* {footer} */}
    </div>
  );
}

export default Navigation;
