import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { editSpot } from "../../store/spot";
import { useModal } from "../../context/Modal";





const EditSpotModal = ({spot}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    // const {spotId} = useParams();
    // const spot = useSelector(state => state.spot.oneSpot[spotId]);
    // console.log(spot);

    const [address, setAddress] = useState(spot.address);
    // console.log(address);
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

        const updatedSpot = {
            id: spot.id,
            address,
            city,
            state,
            country,
            name,
            description,
            price,
            lat:100,
            lng:100
        };
        // console.log(updatedSpot);

        let editedSpot = await dispatch(editSpot(updatedSpot));
        // console.log(editedSpot);
        // console.log('hello');
        if (editedSpot) {
            closeModal();
          history.push('/');
        //   hideForm();
        }
      };

    const handleCancelClick = (e) => {
        e.preventDefault();
        // hideForm();
        };



    return (
        <div className='edit-spot-form-page'>
            <form
                className='edit-spot-form'
                onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        placeholder={spot.address}
                        required
                        value={address}
                        onChange={updateAddress}
                    />
                    <input
                        type="text"
                        placeholder={spot.city}
                        required
                        value={city}
                        onChange={updateCity}
                    />
                    <input
                        type="text"
                        placeholder={spot.state}
                        required
                        value={state}
                        onChange={updateState}
                    />
                    <input
                        type="text"
                        placeholder={spot.country}
                        required
                        value={country}
                        onChange={updateCountry}
                    />
                    <input
                        type="text"
                        placeholder={spot.name}
                        required
                        value={name}
                        onChange={updateName}
                    />
                    <input
                        type="text"
                        placeholder={spot.description}
                        required
                        value={description}
                        onChange={updateDescription}
                    />
                    <input
                        type="number"
                        placeholder={spot.price}
                        required
                        value={price}
                        onChange={updatePrice}
                    />
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
                <button type='submit'>Update Spot</button>
                <button
                type='button'
                onClick={handleCancelClick()}
                >
                    Cancel</button>
            </form>
        </div>
    )

}


export default EditSpotModal;
