import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotDetails, deleteSpot } from '../../store/spot';
import { getSpotReviews } from '../../store/review';
import { Route } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import EditSpotModal from '../EditSpotModal';
import CreateNewReviewModal from '../CreateNewReviewModal';
import "./SpotDetails.css";
import { roundRating } from '../SpotsBrowser';



const SpotDetails = () => {
    const history = useHistory();
    const { spotId } = useParams();
    // const [reviewsGetter, setReviewsGetter] = useState(-1);

    const dispatch = useDispatch();
    const spot = useSelector(state => state.spot.oneSpot);
    const spotOwnerId = spot.ownerId;
    const user = useSelector(state => state.session.user);
    const session = useSelector(state => state.session);
    const spotReviewsObj = useSelector(state => state.review.spotReviews);
    const spotReviews = Object.values(spotReviewsObj);
    const [spotOwner, setSpotOwner] = useState(true);

    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const deleteSpotFunction = async (e) => {
        // console.log(spot);
        e.preventDefault();
        await dispatch(deleteSpot(spot));
        history.push('/');
    }

    useEffect(() => {
        dispatch(getSpotReviews(spotId));
        dispatch(getSpotDetails(spotId));
    }, [dispatch, spotId]);

    useEffect(() => {
        // console.log('user', user, 'spot owner id', spotOwnerId);
        if (user) {
            if (spotOwnerId === user.id) {
                return setSpotOwner(true);
            }
        }
        return setSpotOwner(false);
    }, [dispatch, spot]);


    if (!spot) {
        return null;
    }

    if (!spot.SpotImages) {
        return null;
    }

    if (!spotReviews) {
        return null;
    }

    return (
        <div className='spot-details-box'>
            <div className='spot-details-information'>
                <div className='spot-details-header-box'>
                    <div className='spot-details-header-information'>
                        <div className='spot-name-box'>
                            <span className='spot-name'>
                                {spot.name}
                            </span>
                        </div>
                        <div className='spot-details-links'>
                            <div className='review-and-location-box'>
                                <span className='review-box'>
                                    <span className='rating-icon' id='spot-details-rating-icon'>
                                        <i className="fa-solid fa-star"></i>
                                    </span>
                                    <span className='rating-number' id='spot-details-rating-number'>
                                        {roundRating(spot.avgStarRating)} ·
                                    </span>
                                    <span className='review-list'>
                                        <div className='review-list-button'>
                                            {/* this will be a button */}
                                            {spot.numReviews} reviews
                                        </div>
                                    </span>
                                </span>
                                <span className='interpunct-divider'>·</span>
                                <span className='host-text'>Host</span>
                                <span className='interpunct-divider'>·</span>
                                <span className='location-box'>
                                    <div className='location-button'>
                                        <span className='location-button-text'>
                                            {spot.city}, {spot.state}, {spot.country}
                                        </span>
                                    </div>
                                </span>
                            </div>
                            {spotOwner ?
                                <div className='spot-details-action-buttons'>
                                    <div className='edit-spot-box'>
                                        <div className='edit-spot-button'>
                                            <OpenModalButton
                                                buttonText="Edit Spot"
                                                modalComponent={<EditSpotModal spot={spot}/>}
                                            />
                                        </div>
                                    </div>
                                    <div className='delete-spot-box'>
                                        <div className='delete-spot-button'>
                                            <button onClick={deleteSpotFunction}>Delete Spot</button>
                                        </div>
                                    </div>
                                </div>
                                :
                                // <span>Must be owner to manipulate spot</span>
                                null
                            }
                        </div>
                    </div>
                </div>
                <div className='spot-details-image-box'>
                    <div className='spot-details-image-information'>
                        <div className='big-spot-image-box'>
                            <img
                                className='big-spot-image'
                                src={spot.SpotImages[0].url}
                                alt={spot.name}
                            />
                        </div>
                        <div className='small-spot-image-box' id='top-right'>
                            <img
                                className='small-spot-image'
                                src={spot.SpotImages[0].url}
                                alt={spot.name}
                            />
                        </div>
                        <div className='small-spot-image-box' id='top-left'>
                            <img
                                className='small-spot-image'
                                src={spot.SpotImages[0].url}
                                alt={spot.name}
                            />
                        </div>
                        <div className='small-spot-image-box' id='bottom-right'>
                            <img
                                className='small-spot-image'
                                src={spot.SpotImages[0].url}
                                alt={spot.name}
                            />
                        </div>
                        <div className='small-spot-image-box' id='bottom-left'>
                            <img
                                className='small-spot-image'
                                src={spot.SpotImages[0].url}
                                alt={spot.name}
                            />
                        </div>
                    </div>
                </div>
                <div className='spot-details-details-box'>
                    <div className='spot-details-details-information'>
                        <div className='spot-details-walkthrough'>
                            <div className='spot-layout'>
                                <h2 className='host-information'>Spot hosted by {spot.Owner.firstName}</h2>
                            </div>
                            <div className='spot-description-box'>
                                <p className='spot-description'>
                                    {spot.description}
                                </p>
                            </div>
                        </div>
                        <div className='create-booking-menu-box'>
                            <div className='create-booking-menu'>
                                <div className='create-booking-form-box'>
                                    <div className='create-booking-form'>
                                        <div className='booking-price-and-reviews'>
                                            <div className='booking-price'>
                                                <span className='booking-price-number'>${spot.price}&nbsp;</span>
                                                night
                                            </div>
                                            <div className='booking-reviews'>
                                                <span className='rating-icon' id='booking-rating-icon'>
                                                    <i className="fa-solid fa-star"></i>
                                                </span>
                                                <span className='rating-number' id='booking-rating-number'>
                                                    {roundRating(spot.avgStarRating)} ·
                                                </span>
                                                <span className='review-list'>
                                                    <div className='review-list-button' id='booking-review-list-button'>
                                                        {/* this will be a button */}
                                                        {spot.numReviews} reviews
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='spot-details-reviews-box'>
                    <div className='spot-details-reviews-header'>
                        <span className='rating-icon' id='review-rating-icon'>
                            <i className="fa-solid fa-star"></i>
                        </span>
                        <span className='rating-number' id='review-rating-number'>
                            {roundRating(spot.avgStarRating)} · {spot.numReviews} reviews
                        </span>
                        {spotOwner ?
                            // <span>Spot owner can not leave a review</span>
                            null
                            :
                            <div className='create-review-button-box'>
                                <div className='create-review-button'>
                                    <OpenModalButton
                                        buttonText="Create a Review"
                                        modalComponent={<CreateNewReviewModal spotId={spotId}/>}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                    <div className='spot-details-reviews'>
                        {spotReviews.map(({id, review, updatedAt, User}) => (
                            <div className='single-spot-review' key={id}>
                                <div className='review-details'>
                                    <div className='reviewer-name'>{User.firstName}</div>
                                    <div className='review-date'>{month[Number(spotReviews[0].updatedAt.split('-')[1])]}&nbsp;{updatedAt.split('-')[0]}</div>
                                </div>
                                <div className='review-text'>
                                    {review}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* <Route path='/spots/:spotId'>
                <SpotDetails />
            </Route> */}
        </div>
    )
}


export default SpotDetails;
