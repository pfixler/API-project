import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getAllSpots } from "../../store/spot";
import { NavLink, Route } from "react-router-dom";
import SpotDetails from "../SpotDetails";





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
        <div className="cards-holder">
            <h1>Spots list</h1>
            <ul className="single-card">
                {spots.map(({id, name, previewImage, address}) => (
                    // <li key={spot.id}>{spot.address}</li>
                    <li key={id}>
                        <img
                            src={previewImage}
                            alt={name}
                            />
                        <NavLink to={`/spots/${id}`} target="_blank">{address}</NavLink>
                    </li>
                    ))}
            </ul>
            <Route path='/spots/:spotId'>
                <SpotDetails />
            </Route>
        </div>
      );
};



export default SpotsBrowser;
