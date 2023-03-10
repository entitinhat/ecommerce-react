import axios from 'axios';
import bcrypt from 'bcryptjs'
import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import { detailsUser, updateUserProfile } from '../constants/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import { BASE_URL } from '../helper.js';

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


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [enterPassword, setEnterPassword] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');


    const [profileImage, setProfileImage] = useState('');
    const dispatchh = useDispatch();
    // function reloadPage() {
    //     var currentDocumentTimestamp = new Date(performance.timing.domLoading).getTime();
    //     // Current Time //
    //     var now = Date.now();
    //     // Total Process Lenght as Minutes //
    //     var tenSec = 20 * 1000;
    //     // End Time of Process //
    //     var plusTenSec = currentDocumentTimestamp + tenSec;
    //     if (now > plusTenSec) {
    //         window.location.reload();
    //     }
    // }
    // // You can call it in somewhere //
    // reloadPage();
    // let refresh = window.localStorage.getItem('refresh');
    // console.log(refresh);
    // if (refresh === null) {
    //     window.location.reload();
    //     window.localStorage.setItem('refresh', "1");
    // }


    const userUpdate = useSelector((state) => state.userUpdate);
    const {
        success: successUpdate,
        error: errorUpdate,
        loading: loadingUpdate,
    } = userUpdate;
    // window.location.reload(true)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/api/users/${userInfo._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });

                setName(data.name);
                setEmail(data.email);
                setProfileImage(data.profileImage);

                setIsAdmin(data.isAdmin);

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
            // setName(user.name);
            // setEmail(user.email);
            // setProfileImage(user.profileImage);

            // setIsAdmin(user.isAdmin);


            // setPassword(user.password);
            // setAddress(user.address);
            // setCity(user.city);
            // setCountry(user.country);
        }

    }, [dispatchh, userInfo._id, user]);

    const submitFormHandler = (e) => {
        // e.preventDefault();
        dispatchh(updateUserProfile({ userId: user._id, name, email, password, profileImage, isAdmin }))
    }
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        try {
            dispatch({ type: 'UPLOAD_REQUEST' });
            const { data } = await axios.post(`${BASE_URL}/api/upload`, bodyFormData, {
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
                                {loadingUpload && <LoadingBox></LoadingBox>}
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
                            {/* <div>
                                <label htmlFor='name'>Username</label>
                                <input type='text' id='name' />
                            </div> */}
                            <div>
                                <label htmlFor='fullName'>Full Name</label>
                                <input type='text' id='fullName' value={name}
                                    placeholder='Enter your full name'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            {/* <div>
                                <label htmlFor='enter-password'>Enter your Password</label>
                                <input type='password' id='enter-password'
                                    placeholder='Enter your password'
                                    onChange={(e) => setEnterPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor='password'>New Password</label>
                                <input type='password' id='password'
                                    disabled={!bcrypt.compareSync(enterPassword, user.password)}
                                    value={password}
                                    placeholder={bcrypt.compareSync(enterPassword, user.password) ? 'Type your new password' : 'Type your current password to update new password'}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div> */}
                            {/* <div>
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
                            </div> */}
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
