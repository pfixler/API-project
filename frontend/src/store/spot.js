import { csrfFetch } from "./csrf";


const LOAD_ALL_SPOTS = 'spot/LOAD_ALL_SPOTS';
const LOAD_ONE_SPOT = 'spot/LOAD_ONE_SPOT';
const ADD_ONE_SPOT = 'spot/ADD_ONE_SPOT';
const EDIT_ONE_SPOT = 'spot/EDIT_ONE_SPOT';
const DELETE_ONE_SPOT = 'spot/DELETE_ONE_SPOT';

const loadAll = (spots) => ({
    type: LOAD_ALL_SPOTS,
    spots
});

const loadOne = (spot) => ({
    type: LOAD_ONE_SPOT,
    spot
});

const addOne = (spot) => ({
    type: ADD_ONE_SPOT,
    spot
});

const editOne = (spot) => ({
    type: EDIT_ONE_SPOT,
    spot
});

const deleteOne = (spot) => ({
    type: DELETE_ONE_SPOT,
    spot
});

export const getAllSpots = () => async (dispatch) => {
    const response = await fetch(`/api/spots`);

    if (response.ok) {
        const spots = await response.json();
        dispatch(loadAll(spots));
        // return spots;
    }
};

export const getSpotDetails = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadOne(spot));
    }
};

export const createSpot = (newSpot) => async (dispatch) => {
    // console.log(newSpot);
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSpot),
    });
    // console.log(response);

    if (response.ok) {
        const spot = await response.json();
        // console.log(spot);
        dispatch(addOne(spot));
        return spot;
    }
};

export const editSpot = (editedSpot) => async (dispatch) => {
    console.log(editedSpot);
    const response = await csrfFetch(`/api/spots/${editedSpot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedSpot),
    });

    if (response.ok) {
        const spot = await response.json();
        dispatch(editOne(spot));
        return spot;
    }
};

export const deleteSpot = (deletedSpot) => async (dispatch) => {
    const response = await fetch(`/api/spots/${deletedSpot.id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        const spot = await response.json();
        dispatch(deleteOne(spot));
    }
};

const initialState = { allSpots: {}, oneSpot: {}};

const spotReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_ALL_SPOTS:
            newState = {allSpots: {}, oneSpot: {}};
            action.spots.Spots.forEach((spot) => {
                newState.allSpots[spot.id] = spot;
            });
            return newState;
        case LOAD_ONE_SPOT:
            newState = {...state, oneSpot: {}};
            newState.oneSpot = action.spot;
            return newState;
        case ADD_ONE_SPOT:
            newState = {...state};
            // console.log(action.spot);
            newState.allSpots[action.spot.id] = action.spot;
            // console.log(newState);
            return newState;
        case EDIT_ONE_SPOT:
            newState = {...state};
            newState.allSpots[action.spot.id] = action.spot;
            console.log(action.spot);
            return newState;
        case DELETE_ONE_SPOT:
            newState = {...state};
            delete newState.allSpots[action.spotId];
            return newState;
        default:
            return state;
    }
};


export default spotReducer;
