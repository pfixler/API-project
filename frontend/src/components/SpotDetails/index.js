import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotDetails, deleteSpot } from '../../store/spot';
import OpenModalButton from '../OpenModalButton';
import EditSpotModal from '../EditSpotModal';



const SpotDetails = () => {
    const history = useHistory();
    const {spotId} = useParams();
    // console.log(spotId);
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spot.oneSpot);
    // console.log(spot);
    // console.log('hi');

    const deleteSpotFunction = async (e) => {
        // console.log(spot);
        e.preventDefault();
        await dispatch(deleteSpot(spot));
        history.push('/');
    }

    useEffect(() => {
        dispatch(getSpotDetails(spotId));
      }, [dispatch, spotId]);



    return (
        <div>
                <h1>{spot.address}</h1>
                <div>

                <div>
                <OpenModalButton
                    buttonText="Edit Spot"
                    modalComponent={<EditSpotModal spot={spot}/>}
                />
                </div>
                <button onClick={deleteSpotFunction}>Delete Spot</button>
                <div>

                </div>
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
