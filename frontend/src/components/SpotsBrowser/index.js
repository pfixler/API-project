import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getAllSpots } from "../../store/spot";
import { NavLink, Route } from "react-router-dom";
import SpotDetails from "../SpotDetails";
import "./SpotsBrowser.css"





const SpotsBrowser = () => {
    const dispatch = useDispatch();
    const spotsObj = useSelector(state=>state.spot.allSpots);
    // console.log('obj:', spotsObj);
    const spots = Object.values(spotsObj);
    // console.log('obj:', spots);

    // let paul;

    // const openInNewTab = (url) => {
    //     window.open(url, '_blank', 'noopener,noreferrer');
    //   };

    useEffect(() => {
        dispatch(getAllSpots());
      }, [dispatch]);

    if (!spots) {
        return null;
    }

      return (
        <div className="main-content">
            <div className="cards-holder">
                    {spots.map(({id, name, previewImage, address, city, state, description, price, avgRating}) => (
                        // <li key={spot.id}>{spot.address}</li>
                        <div className="single-card" key={id}>
                            <NavLink to={`/spots/${id}`} target="_blank">
                            <div className="card-image-box">
                                <img
                                    className="card-image"
                                    src='https://picsum.photos/id/0/367/267'
                                    // src={previewImage}
                                    alt={name}
                                    />
                            </div>
                            <div className="information-box">
                                <div className="location">
                                    {city}, {state}
                                </div>
                                <div className="abbreviated-description">
                                    <span>
                                        {description}
                                    </span>
                                </div>
                                <div className="price-box">
                                    <span className="price-text">
                                        ${price}
                                    </span>
                                    &nbsp;
                                    <span className="night-text">
                                        night
                                    </span>
                                </div>
                                <div className="rating-box">
                                    <span className="rating-icon">
                                        <i className="fa-solid fa-star"></i>
                                    </span>
                                    <span className="rating-number">
                                        {avgRating}
                                    </span>
                                </div>
                            </div>
                            </NavLink>
                        </div>
                        ))}
                </div>
                <Route path='/spots/:spotId'>
                    <SpotDetails />
                </Route>
        </div>
      );
};



export default SpotsBrowser;
