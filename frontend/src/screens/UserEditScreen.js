import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom';
import { detailsUser } from '../constants/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { loading: true, ...state }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, users: action.payload.users }   // trc có users: action.payload.users
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        case 'UPDATE_REQUEST':
            return { loadingUpdate: true, ...state }
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false }
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false }
        default:
            return state;
    }
}

export default function UserEditScreen() {

    const [{ loading, users, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })

    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [isAdmin, setIsAdmin] = useState(false);


    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const userDetails = useSelector((state) => state.userDetails);
    const { user } = userDetails;
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    // useEffect(() => {
    //     if (!user) {
    //         dispatch({ type: USER_UPDATE_PROFILE_RESET });
    //         dispatch(detailsUser(userInfo._id));
    //     } else {
    //         setName(userInfo.name);
    //         setEmail(userInfo.email);
    //         // setPassword(user.password);
    //         // setAddress(user.address);
    //         // setCity(user.city);
    //         // setCountry(user.country);
    //     }

    // }, [dispatch, userInfo._id, user]);
    console.log(id)
    console.log('user in user edit screen', user)
    console.log('userInfo in user edit screen', userInfo)
    console.log('shippingaddress in user edit', shippingAddress)
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`/api/users/${id}`,
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    });
                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin);
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: data,
                })
                // localStorage.setItem('userInfo', JSON.stringify(data));
            }
            catch (err) {
                dispatch({
                    type: 'FETCH_FAIL'
                })
            }
        }
        fetchData();
    }, [])


    const updateUserHandler = async (e) => {
        // e.preventDefault();
        dispatch({
            type: 'UPDATE_REQUEST'
        })
        try {
            await axios.put(`/api/users/${id}`,
                {
                    _id: id,
                    name,
                    email,
                    isAdmin,
                },)
            // {
            //     headers: { Authorization: `Bearer ${userInfo.token}` }
            // })
            dispatch({
                type: 'UPDATE_SUCCESS',


            })
            alert('update user successfully')
            navigate('/admin/users')


        }
        catch (err) {
            dispatch({
                type: 'UPDATE_FAIL',
            })
        }
    }
    return (
        <div>
            <div>
                <Link to="/admin/users">Back to List Users</Link>
            </div>
            <div>
                <form className="form" onSubmit={updateUserHandler}>
                    <div>
                        <h1>Edit User {id}</h1>
                    </div>
                    <div>
                        <label htmlFor='name'>Name</label>
                        <input type='text' id='name'
                            value={name}
                            required
                            onChange={(e) => {
                                if (userInfo.email === 'nhatktvn2001@gmail.com' || email !== 'nhatktvn2001@gmail.com') {
                                    setName(e.target.value)
                                }
                                else alert('dont ever think u can change my name ^^')
                            }}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input type='text' id='email'
                            value={email}
                            disabled
                            onChange={(e) => setEmail(e.target.value)} ></input>
                    </div>

                    <div>
                        <label htmlFor='isAdmin'>Change To Admin</label>
                        <input type='checkbox' id='isAdmin'
                            checked={isAdmin}
                            onChange={(e) => {
                                console.log('isadmin ban dau', isAdmin)
                                if (email !== userInfo.email && email !== 'nhatktvn2001@gmail.com') {
                                    setIsAdmin(e.target.checked)
                                    console.log('trang thai adminla', isAdmin)
                                }

                                else alert('Cant change the current admin state');
                            }
                            }
                        ></input>

                    </div>
                    <div>
                        <button className="sign-in"> Update This User </button>
                    </div>


                </form>
            </div >


        </div >
    )
}
