import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import { detailsUser, updateUserProfile } from '../constants/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { loading: true, ...state }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, users: action.payload.users }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        case 'UPLOAD_REQUEST':
            return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                loadingUpload: false,
                errorUpload: '',
            };
        case 'UPLOAD_FAIL':
            return { ...state, loadingUpload: false, errorUpload: action.payload };
        default:
            return state;
    }
}


export default function ProfileUserScreen() {


    const [{ products, users, loadingCreate, loadingUpload }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })

    const cart = useSelector((state) => state.cart);
    const { shippingAddress, paymentMethod, cartItems } = cart;
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const userDetails = useSelector((state) => state.userDetails);
    const { user, loading, error } = userDetails;
    console.log('user in profile screen', user)

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');



    const [profileImage, setProfileImage] = useState('');
    const dispatchh = useDispatch();


    const userUpdate = useSelector((state) => state.userUpdate);
    const {
        success: successUpdate,
        error: errorUpdate,
        loading: loadingUpdate,
    } = userUpdate;



    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`/api/users/${userInfo._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                setName(data.name);
                setEmail(data.email);
                setProfileImage(data.profileImage);
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: data,
                })
                localStorage.setItem('userInfo', JSON.stringify(data));
            }
            catch (err) {
                dispatch({
                    type: 'FETCH_FAIL'
                })
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        if (!user) {
            dispatchh({ type: USER_UPDATE_PROFILE_RESET });
            dispatchh(detailsUser(userInfo._id));
        } else {
            setName(user.name);
            setEmail(user.email);
            setProfileImage(user.profileImage);
            // setPassword(user.password);
            // setAddress(user.address);
            // setCity(user.city);
            // setCountry(user.country);
        }

    }, [dispatchh, userInfo._id, user]);

    const submitFormHandler = (e) => {
        // e.preventDefault();
        dispatchh(updateUserProfile({ userId: user._id, name, email, password, profileImage }))
    }
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        try {
            dispatch({ type: 'UPLOAD_REQUEST' });
            const { data } = await axios.post('/api/upload', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${userInfo.token}`,
                },
            });
            dispatch({ type: 'UPLOAD_SUCCESS' });
            alert('Image uploaded successfully');
            setProfileImage(data.secure_url);
        } catch (err) {
            dispatch({ type: 'UPLOAD_FAIL', payload: err.message });
        }
    };
    // console.log("user la", user);
    // console.log("userupdate la", userUpdate);
    console.log(profileImage)
    console.log(users, 'users la gi')
    console.log(userInfo, 'user info trong profile screen')
    console.log(shippingAddress, 'shipping address trong profile screen')
    return (
        <div>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger"> {error} </MessageBox>
            ) : (
                <>
                    {loadingUpdate && <LoadingBox></LoadingBox>}
                    {errorUpdate && (
                        <MessageBox variant="danger">{errorUpdate}</MessageBox>
                    )}
                    {successUpdate && (
                        <MessageBox variant="success">
                            Profile Updated Successfully
                        </MessageBox>
                    )}
                    <div >
                        <div className="profile-bar row center">
                            <h1>Edit Profile</h1>
                        </div>
                        <div className="profile-pic-wrapper">
                            <div>
                                <img src={profileImage} className="profile-pic" alt=""></img>
                                <i className="fa fa-pencil-square" aria-hidden="true" ></i>
                                <input type='file' className="input-file-profile" onChange={uploadFileHandler}></input>
                            </div>
                            <div>{name}</div>
                            {/* <div>
                                <input type='file' id='imageFile'
                                    onChange={uploadFileHandler}
                                ></input>
                            </div> */}
                        </div>

                        <form className="form" onSubmit={submitFormHandler}>
                            <div>
                                <label htmlFor='profileImage'>Image URL</label>
                                <input type='text' id='profileImage'
                                    value={profileImage}
                                    onChange={(e) => setProfileImage(e.target.value)} ></input>
                            </div>

                            {/* <div>
                                <input type='file' id='imageFile'
                                    onChange={uploadFileHandler}
                                ></input>
                                <div>
                                    <img src={profileImage} className="profile-pic" alt=""></img>
                                </div>
                            </div> */}
                            <div>
                                <label htmlFor='email'>Email </label>
                                <input type='email' id='email' value={email} disabled
                                />
                            </div>
                            <div>
                                <label htmlFor='name'>Username</label>
                                <input type='text' id='name' />
                            </div>
                            <div>
                                <label htmlFor='fullName'>Full Name</label>
                                <input type='text' id='fullName' value={name}
                                    placeholder='Enter your full name'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor='address'>Address</label>
                                <input type='text' id='address'
                                    value={shippingAddress.address}
                                    placeholder='Enter your address'
                                    onChange={(e) => setAddress(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor='city'>City</label>
                                <input type='text' id='city'
                                    value={shippingAddress.city}
                                    placeholder='Enter your city'
                                    onChange={(e) => setCity(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor='country'>Country</label>
                                <input type='text' id='country'
                                    value={shippingAddress.country}
                                    placeholder='Enter your country'
                                    onChange={(e) => setCountry(e.target.value)} />
                            </div>
                            <div>
                                <button className="sign-in"> Update </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div >
    )
}
