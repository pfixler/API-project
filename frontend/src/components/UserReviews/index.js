import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { deleteReview, getUserReviews } from "../../store/review";
import './UserReviews.css';

const UserReviews = () => {
    const history = useHistory();
    const { userId } = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state => state.session.user));
    // const session  = useSelector((state => state.session));
    const userReviewsObj = useSelector(state => state.review.userReviews);
    const userReviews = Object.values(userReviewsObj);
    // const numReviews = userReviews.length;
    // const [spotOwner, setSpotOwner] = useState(true);

    // const [reviewId, setReviewId] = useState();


    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const deleteReviewFunction = async (review) => {
        console.log(review);
        // console.log(spot);
        // e.preventDefault();
        return dispatch(deleteReview(review))
        // setReviewId();
    }

    // useEffect(() => {
    //     if (user) {
    //         if (userId === user.id) {
    //             setSpotOwner(true);
    //         }
    //     }
    //     else {
    //         setSpotOwner(false);
    //     }
    // }, [dispatch, session]);

    // useEffect(() => {
    //     if (!user) {
    //         history.push('/');
    //     }
    // }, [session])


    useEffect(() => {
        dispatch(getUserReviews())
    }, [dispatch])

    if (!userReviews) {
        return null;
    }

    // if (!(typeof userReviews === Array)) {
    //     return null;
    // }

    return (
        <div className='user-reviews'>
            <div className="user-reviews-header">
                <div className="user-name">
                    {user.firstName}'s&nbsp;reviews
                </div>
                {/* <div className="number-reviews">
                    {numReviews}&nbsp;reviews
                </div> */}
            </div>
            <div className="user-reviews-body">
                {userReviews.map((review) => (
                    <div className='single-user-review' key={review.id}>
                        <div className='user-review-details'>
                            <div className="review-spot-date-box">
                                <div className="user-review-spot">
                                    {review.Spot.name}
                                </div>
                                <div className='user-review-date'>
                                    {month[Number(userReviews[0].updatedAt.split('-')[1])]}&nbsp;{review.updatedAt.split('-')[0]}
                                </div>
                            </div>
                            <div className="delete-review-button">
                                <button onClick={() => deleteReviewFunction(review)}>Delete Review</button>
                            </div>
                        </div>
                        <div className='user-review-text'>
                            {review.review}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserReviews;
