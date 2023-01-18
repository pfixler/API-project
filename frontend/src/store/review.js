import { csrfFetch } from "./csrf";

const LOAD_SPOT_REVIEWS = 'review/LOAD_SPOT_REVIEWS';
const LOAD_USER_REVIEWS = 'review/LOAD_USER_REVIEWS';
const ADD_REVIEW = 'review/ADD_REVIEW';
const DELETE_REVIEW = 'review/DELETE_REVIEW';

const loadSpot = (reviews) => ({
    type: LOAD_SPOT_REVIEWS,
    reviews
});

const loadUser = (reviews) => ({
    type: LOAD_USER_REVIEWS,
    reviews
});

const addOne = (review) => ({
    type: ADD_REVIEW,
    review
});

const deleteOne = (review) => ({
    type: DELETE_REVIEW,
    review
});

export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadSpot(reviews))
    }
};

export const getUserReviews = () => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/current`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadUser(reviews))
    }
};

export const createReview = (newReview, spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
    });

    if (response.ok) {
        const review = await response.json();
        dispatch(addOne(review))
    }
};

export const deleteReview = (reviewId) => async (dispatch) => {
    const response = csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        const review = await response.json();
        dispatch(deleteOne(review));
    }
};


const initialState = { userReviews: {}, spotReviews: {} }

const reviewReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_SPOT_REVIEWS:
            newState = {...state, spotReviews: {}};
            action.reviews.Reviews.forEach((review) => {
                newState.spotReviews[review.id] = review;
            })
            return newState;
        case LOAD_USER_REVIEWS:
        case ADD_REVIEW:
        case DELETE_REVIEW:
        default:
            return state;
    }
};

export default reviewReducer;