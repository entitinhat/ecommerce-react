import axios from 'axios'
import React, { useEffect, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router'

import LoadingBox from '../component/LoadingBox'
import MessageBox from '../component/MessageBox'
import { editUser } from '../constants/userActions'
import { BASE_URL } from '../helper.js'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { loading: true, ...state }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, users: action.payload.users }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true, successDelelte: false }
        case 'DELETE_SUCCESS':
            return { ...state, loadingDelete: false, successDelelte: true }
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false, successDelelte: false }
        default:
            return state;
    }
}



export default function UserListScreen() {
    const [{ loading, users, error, loadingCreate, loadingDelete, successDelelte }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })

    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const userDetails = useSelector(state => state.userDetails)
    const { user } = userDetails;

    // const userUpdateAdmin = useSelector(state => state.userUpdateAdmin)
    // const {
    //     loading,
    //     error,
    //     success,
    //     users
    // } = userUpdateAdmin;
    // console.log(users, 'user tesst')
    // console.log(userUpdateAdmin, 'user update admin')
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/api/users`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: data,
                })
            }
            catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: err.message
                })
            }

        }
        fetchData();
    }, [successDelelte, userInfo])
    console.log(users, 'test')



    // const createProductHandler = async () => {
    //     if (window.confirm('Are you sure to create?')) {
    //         dispatch({ type: 'CREATE_REQUEST' });
    //         try {
    //             const { data } = await axios.post('/api/users',
    //                 {},
    //                 {
    //                     headers: { Authorization: `Bearer ${userInfo.token}` },
    //                 }
    //             );
    //             alert('create new user successfully')
    //             dispatch({
    //                 type: 'CREATE_SUCCESS',
    //             })
    //             navigate(`/admin/productlist/${data.user._id}`)
    //         }
    //         catch (err) {
    //             dispatch({
    //                 type: 'CREATE_FAIL',
    //                 // payload: err.message,
    //             })
    //         }
    //     }
    // }
    const deleteHandler = async (user) => {
        if (window.confirm('Are you sure to delete this user?')) {

            dispatch({ type: 'DELETE_REQUEST' });
            try {
                await axios.delete(`${BASE_URL}/api/users/${user._id}`,
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                )
                alert('delete user successfully');
                dispatch({
                    type: 'DELETE_SUCCESS'
                })
            }
            catch (err) {
                dispatch({
                    type: 'DELETE_FAIL'
                });
                alert('cannot delete admin');
            }

        }

    }

    let i = 1;
    const count = () => {
        return i++;
    }
    return (
        <>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger"> {error} </MessageBox>
            ) : (
                <div>
                    <div className="row-create">
                        <div>
                            <h1>Users</h1>
                        </div>
                        {/* <div>
                            <button className="sign-in" onClick={createProductHandler}>
                                Create A User
                                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                            </button>

                        </div> */}
                    </div>

                    {
                        loading ? (
                            <LoadingBox  ></LoadingBox >
                        ) : error ? (
                            <MessageBox variant="danger"> {error} </MessageBox>
                        ) : (
                            <>
                                <div className="row center admin-product-watchlist">
                                    <div>
                                        <h2>Total Users</h2>
                                        <p>{users.length}</p>
                                    </div>
                                    <div>
                                        <h2>Total Admins</h2>
                                        <p>{users.reduce((a, c) => c.isAdmin ? a + 1 : a, 0)}</p>
                                    </div>
                                </div>

                                <table className="product-table">
                                    <thead>
                                        <tr>
                                            <th>Num</th>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Admin</th>
                                            <th colSpan={2}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {users.map((user) => (
                                            <tr key={user._id}>
                                                <td>{count()}</td>
                                                <td> {user._id}</td>
                                                <td>
                                                    <div className="row-left">
                                                        <img src={user.profileImage} className="profile-pic-mini" alt=''></img>
                                                        {user.name}
                                                    </div>

                                                </td>
                                                <td>{user.email} </td>
                                                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                                                <td>
                                                    <button className='action-btn edit-btn'
                                                        onClick={() => navigate(`/admin/users/${user._id}`)}>Edit
                                                        <i className="fa fa-pencil" aria-hidden="true"></i></button>
                                                </td>
                                                <td>
                                                    <button className='action-btn delete-btn'
                                                        onClick={() => deleteHandler(user)}>Delete
                                                        <i className="fa fa-trash" aria-hidden="true"></i></button>
                                                </td>

                                            </tr>
                                        ))}


                                    </tbody>
                                </table>
                            </>

                        )
                    }
                </div>
            )}
        </>
    )
}
