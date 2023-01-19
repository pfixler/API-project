import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { editSpot } from "../../store/spot";
import { useModal } from "../../context/Modal";
import './EditSpotModal.css';





const EditSpotModal = ({spot}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [errors, setErrors] = useState([]);
    // const {spotId} = useParams();
    // const spot = useSelector(state => state.spot.oneSpot[spotId]);
    // console.log(spot);

    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [country, setCountry] = useState(spot.country);
    const [name, setName] = useState(spot.name);
    const [description, setDescription] = useState(spot.description);
    const [price, setPrice] = useState(spot.price);

    const updateAddress = (e) => {setAddress(e.target.value)};
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateCountry = (e) => setCountry(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);


    const handleSubmit = async (e) => {

        e.preventDefault();
        setErrors([]);

        const updatedSpot = {
            id: spot.id,
            address,
            city,
            state,
            lat:100,
            lng:100,
            country,
            name,
            description,
            price,
        };
        // console.log(updatedSpot);

        const editedSpot = await dispatch(editSpot(updatedSpot))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
      };

    const handleCancelClick = (e) => {
        e.preventDefault();
        // hideForm();
        };



    return (
        <div className='edit-spot-modal-box'>
            <div className='edit-spot-modal-header'>Update Spot</div>
            <div className='edit-spot-modal-form'>
                <div className='form-information'>
                    <form className='edit-spot-form' onSubmit={handleSubmit}>
                        <ul>
                            {errors.map((error, idx) => (
                                <li key={idx}>{error}</li>
                            ))}
                        </ul>
                        <div className='input-box'>
                            <div className='input-field'>
                                <input
                                    className="input-data"
                                    type="text"
                                    placeholder="Address"
                                    required
                                    value={address}
                                    onChange={updateAddress}
                                />
                            </div>
                            <div className="single-error-information">
                                Make sure your passwords match.
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='input-field'>
                                <input
                                    className="input-data"
                                    type="text"
                                    placeholder="City"
                                    required
                                    value={city}
                                    onChange={updateCity}
                                />
                            </div>
                            <div className="single-error-information">
                                Make sure your passwords match.
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='input-field'>
                                <input
                                    className="input-data"
                                    type="text"
                                    placeholder="State"
                                    required
                                    value={state}
                                    onChange={updateState}
                                />
                            </div>
                            <div className="single-error-information">
                                Make sure your passwords match.
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='input-field'>
                                <input
                                    className="input-data"
                                    type="text"
                                    placeholder="Country"
                                    required
                                    value={country}
                                    onChange={updateCountry}
                                />
                            </div>
                            <div className="single-error-information">
                                Make sure your passwords match.
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='input-field'>
                                <input
                                    className="input-data"
                                    type="text"
                                    placeholder="Name"
                                    required
                                    value={name}
                                    onChange={updateName}
                                />
                            </div>
                            <div className="single-error-information">
                                Make sure your passwords match.
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='input-field'>
                                <input
                                    className="input-data"
                                    type="text"
                                    placeholder="Description"
                                    required
                                    value={description}
                                    onChange={updateDescription}
                                />
                            </div>
                            <div className="single-error-information">
                                Make sure your passwords match.
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='input-field'>
                                <input
                                    className="input-data"
                                    type="number"
                                    placeholder="Price"
                                    required
                                    value={price}
                                    onChange={updatePrice}
                                />
                            </div>
                            <div className="single-error-information">
                                Make sure your passwords match.
                            </div>
                        </div>
                        {/* <input
                            type="number"
                            placeholder="Lat"
                            required
                            value={lat}
                            onChange={updateLat}
                        />
                        <input
                            type="number"
                            placeholder="Lng"
                            required
                            value={lng}
                            onChange={updateLng}
                        /> */}
                        <div className='submit-spot-button-box'>
                            <button
                                className='submit-spot-button'
                                type='submit'
                                // disabled={!!errors.length}
                                >
                                    Update Spot
                            </button>
                        </div>
                    {/* <button
                    type='button'
                    onClick={handleCancelClick}
                    >
                        Cancel</button> */}
                    </form>
                </div>
            </div>
        </div>
    )

}


export default EditSpotModal;
