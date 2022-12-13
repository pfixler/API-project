import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getAllSpots } from "../../store/spot";





const SpotsBrowser = () => {
    const dispatch = useDispatch();
    const spotsObj = useSelector(state=>state.spot.allSpots);
    // console.log('obj:', spotsObj);
    const spots = Object.values(spotsObj);
    // console.log('obj:', spots);



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
                {spots.map((spot) => (
                    <li key={spot.id}>{spot.address}</li>
                    // <li key={spot.id}><NavLink to={`/spot/${spot.id}`}>{spot.address}</NavLink></li>
                    ))}
            </ul>
        </div>
      );
};



export default SpotsBrowser;
