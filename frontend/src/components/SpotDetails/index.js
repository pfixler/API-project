import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotDetails } from '../../store/spot';


const SpotDetails = () => {
    const {spotId} = useParams();
    // console.log(spotId);
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spot.oneSpot);
    // console.log(spot);
    // console.log('hi');


    useEffect(() => {
        dispatch(getSpotDetails(spotId));
      }, [dispatch, spotId]);

    return (
            <h1>{spot.address}</h1>
            // <h1>hello</h1>
        // <div>
        //     <div>

        //     </div>

        // </div>
    )
}


export default SpotDetails;
