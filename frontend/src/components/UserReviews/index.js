import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { deleteReview, getUserReviews } from "../../store/review";
import './UserReviews.css';

const UserReviews = () => {
    const history = useHistory();
    const { userId } = useParams();
    const dispatch = useDispatch();
    const userReviewsObj = useSelector(state => state.review.userReviews);
    const userReviews = Object.values(userReviewsObj);
    // const [reviewId, setReviewId] = useState();

    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const deleteReviewFunction = async (review) => {
        console.log(review);
        // console.log(spot);
        // e.preventDefault();
        return dispatch(deleteReview(review))
        // setReviewId();
    }

    useEffect(() => {
        dispatch(getUserReviews())
    }, [dispatch])

    if (!userReviews) {
        return null;
    }

    return (
        <div className='user-reviews'>
            {userReviews.map((review) => (
                <div className='single-user-review' key={review.id}>
                    <div className='user-review-details'>
                        <div className='user-review-date'>
                            {month[Number(userReviews[0].updatedAt.split('-')[1])]}&nbsp;{review.updatedAt.split('-')[0]}
                        </div>
                    </div>
                    <div className='user-review-text'>
                        {review.review}
                    </div>
                    <div className="delete-review-button">
                        <button onClick={() => deleteReviewFunction(review)}>Delete Review</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default UserReviews;
