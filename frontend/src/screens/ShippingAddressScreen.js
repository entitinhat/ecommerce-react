import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router';
import CheckoutSteps from '../component/CheckoutSteps'
import { saveShippingAddress } from '../constants/cartActions';

export default function ShippingAddressScreen(props) {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;
    const userDetails = useSelector((state) => state.userDetails);
    const { user, loading, error } = userDetails;
    console.log('user trong shipping screen', user)
    // const userSignin = useSelector((state => state.userSignin));
    // const { userInfo } = userSignin;
    const [fullName, setFullName] = useState(shippingAddress.fullName);
    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const submitShippingHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ fullName, address, city, postalCode, country }));
        navigate('/payment');
    }
    console.log(shippingAddress, 'shipiing address trong shipping screen')
    return (
        <div>
            <CheckoutSteps step1 step2></CheckoutSteps>
            <form className="form" onSubmit={submitShippingHandler}>
                <div>
                    <h1> Shipping Address</h1>
                </div>
                <div>
                    <label htmlFor='fullName'>Full Name</label>
                    <input type='text' id='fullName' value={fullName} placeholder='Enter your full name' required onChange={(e) => setFullName(e.target.value)}></input>
                </div>
                <div>
                    <label htmlFor='address'>Address</label>
                    <input type='text' id='address' value={address} placeholder='Enter your address' required onChange={(e) => setAddress(e.target.value)}></input>
                </div>
                <div>
                    <label htmlFor='city'> City </label>
                    <input type='text' id='city' value={city} placeholder='Enter your city' required onChange={(e) => setCity(e.target.value)}></input>
                </div>
                <div>
                    <label htmlFor='postalCode'>Postal Code</label>
                    <input type='text' id='postalCode' value={postalCode} placeholder='Enter your postal code' required onChange={(e) => setPostalCode(e.target.value)}></input>
                </div>
                <div>
                    <label htmlFor='country'>Country</label>
                    <input type='text' id='country' value={country} placeholder='Enter your country' required onChange={(e) => setCountry(e.target.value)}></input>
                </div>
                <div>
                    <button className="add-cart" type='submit'> Continue </button>
                </div>

            </form>

        </div >
    )
}
