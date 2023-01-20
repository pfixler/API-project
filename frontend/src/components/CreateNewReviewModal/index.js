import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useState } from "react";
import { createReview } from "../../store/review";
import { useParams } from "react-router-dom";
import './CreateNewReviewModal.css';


const CreateNewReviewModal = ({spotId}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    // const { spotId } = useParams();
    const [errors, setErrors] = useState([]);

    const [stars, setStars] = useState(1);
    const [review, setReview] = useState('');

    const updateStars = (e) => setStars(e.target.value);
    const updateReview = (e) => setReview(e.target.value);

    let starsArray = [1,2,3,4,5];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const newReview = {
            stars,
            review
        };

        const addedReview = await dispatch(createReview(newReview, spotId))
            .then(console.log('inside'))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                    else if (data && data.title.includes('Error')) setErrors(data.message);
                }
            )
    }


    return (
        <div className="create-review-modal-box">
            <div className="create-review-modal-header">Create a Review</div>
            <div className="create-review-modal-form">
                <form className="create-review-form" onSubmit={handleSubmit}>
                    <ul className="error-list">
                        {errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                    <div className="star-input-box">
                        <label className="star-input-label">
                            Select a rating
                            <select
                                className="star-input-dropdown"
                                onChange={updateStars}
                                value={stars}
                            >
                                {starsArray.map((number) => (
                                    <option
                                        key={number}
                                        value={number}
                                    >
                                        {number}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div className="single-error-information">
                            Select a rating between 1 and 5.
                        </div>
                    </div>
                    <div className='review-input-box'>
                        <div className='review-input-field'>
                            <input
                                className="review-input-data"
                                type="text"
                                placeholder="Review"
                                required
                                value={review}
                                onChange={updateReview}
                            />
                        </div>
                        <div className="single-error-information">
                            Please give an honest review.
                        </div>
                    </div>
                    <div className='submit-review-button-box'>
                        <button
                            className='submit-review-button'
                            type='submit'
                            // disabled={!!errors.length}
                            >
                                Create New Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateNewReviewModal;
