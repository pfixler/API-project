import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { deleteReview, getUserReviews } from "../../store/review";

const UserReviews = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const userReviewsObj = useSelector(state => state.review.userReviews);
    const userReviews = Object.values(userReviewsObj);

    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const deleteReviewFunction = async (e) => {
        // console.log(spot);
        e.preventDefault();
        // await dispatch(deleteReview(spot));
        // history.push('/');
    }

    useEffect(() => {
        dispatch(getUserReviews())
    }, [dispatch])

    return (
        <div className='user-reviews'>
            {userReviews.map(({id, review, updatedAt, User}) => (
                <div className='single-user-review' key={id}>
                    <div className='user-review-details'>
                        <div className='user-review-date'>{month[Number(userReviews[0].updatedAt.split('-')[1])]}&nbsp;{updatedAt.split('-')[0]}</div>
                    </div>
                    <div className='user-review-text'>
                        {review}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default UserReviews;
