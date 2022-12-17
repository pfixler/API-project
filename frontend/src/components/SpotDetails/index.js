import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotDetails } from '../../store/spot';
import OpenModalButton from '../OpenModalButton';
import EditSpotModal from '../EditSpotModal';


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
        <div>
                <h1>{spot.address}</h1>
                <div>
                <OpenModalButton
                    buttonText="Edit Spot"
                    modalComponent={<EditSpotModal spot={spot}/>}
                />
                </div>

            </div>
            // <h1>hello</h1>
        // <div>
        //     <div>

        //     </div>

        // </div>
    )
}


export default SpotDetails;
