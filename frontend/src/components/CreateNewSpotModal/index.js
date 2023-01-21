import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createSpot, getAllSpots } from '../../store/spot';
import { useModal } from "../../context/Modal";
import './CreateNewSpotModal.css'
// import spot from '../../../../backend/db/models/spot';


const CreateNewSpotModal = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();
    const [errors, setErrors] = useState([]);
    const [spotGetter, setSpotGetter] = useState();
    // console.log('newspot at begining', spotGetter)

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [url, setUrl] = useState('https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930');
    // const [lat, setLat] = useState(0);
    // const [lng, setLng] = useState(0);

    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateCountry = (e) => setCountry(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);
    const updateUrl = (e) => setUrl(e.target.value);
    // const updateLat = (e) => setLat(e.target.value);
    // const updateLng = (e) => setLng(e.target.value);


    const handleSubmit = async (e) => {
        //make this a modal
        e.preventDefault();
        setErrors([]);

        const newSpot = {
            address,
            city,
            state,
            country,
            lat:100,
            lng:100,
            name,
            description,
            price
        };

        const newImage = {
            url,
            preview:true,
        }


        //return here?
        const newPlace = await dispatch(createSpot(newSpot, newImage))
            .then(async (res) => {
                setSpotGetter(res)})
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    // console.log(data.errors)
                    if (data && data.errors) setErrors(data.errors);
                    else if (data && data.title.includes('Error')) setErrors([data.message]);
                }
            );
};

    useEffect(() => {
        if (spotGetter) {
            history.push(`/spots/${spotGetter.id}`)
        }
        setSpotGetter();
    }, [spotGetter])

    const handleCancelClick = (e) => {
        e.preventDefault();
        // hideForm();
        };


    return (
        <div className='create-spot-modal-box'>
            <div className='create-spot-modal-header'>Create A Spot</div>
            <div className='create-spot-modal-form'>
                <div className='form-information'>
                    <form className='create-spot-form' onSubmit={handleSubmit}>
                        <ul className="error-list">
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
                                Please enter a valid address.
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
                                Please enter a valid city.
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
                                Please enter a valid state.
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
                                Please enter a valid country.
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
                                Make sure the spot name is less than 50 characters.
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
                                Please write at least 20 characters.
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
                                Please enter a valid price.
                            </div>
                        </div>
                        <div className='input-box'>
                            <div className='input-field'>
                                <input
                                    className="input-data"
                                    type="url"
                                    placeholder="Image Url"
                                    required
                                    value={url}
                                    onChange={updateUrl}
                                />
                            </div>
                            <div className="single-error-information">
                                Default image URL is provided.
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
                                    Create New Spot
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
    );
}

export default CreateNewSpotModal;
