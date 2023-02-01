import axios from 'axios'
import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router'
// import data from '../../../backend/data'

import LoadingBox from '../component/LoadingBox'
import MessageBox from '../component/MessageBox'


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { loading: true, ...state }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, products: action.payload }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        // case 'FETCH_CATEGORY_REQUEST':
        //     return { loading: true, ...state }
        // case 'FETCH_CATEGORIES_SUCCESS':
        //     return { ...state, loading: false, categories: action.payload }
        // case 'FETCH_CATEGORY_FAIL':
        //     return { ...state, loading: false }
        case 'CREATE_REQUEST':
            return { loadingCreate: true, ...state }
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreate: false }
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false }
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



export default function ProductListScreen() {
    const [{ loading, products, error, loadingCreate, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    const [categories, setCategories] = useState([])


    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try {
    //             const { data } = await axios.get('/api/products/categories');
    //             dispatch({
    //                 type: 'FETCH_CATEGORY_SUCCESS',
    //                 payload: data,
    //             })
    //         }
    //         catch (err) {
    //             dispatch({
    //                 type: 'FETCH_CATEGORY_FAIL',
    //                 payload: err.message
    //             })
    //         }

    //     }
    //     fetchCategories();
    // }, [categories])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('/api/products', {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });
                // const { dataCategories } = await axios.get('/api/products/categories');
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: data

                })
                // setCategories(dataCategories);
            }
            catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: err.message
                })
            }

        }
        fetchData();
    }, [userInfo, products])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/api/products/categories');
                // dispatch({
                //     type: 'FETCH_CATEGORIES_SUCCESS',
                //     payload: data
                // })
                setCategories(data);  // ["Pants","Shirts"]
            }
            catch (error) {
                alert(error.message);
            }
        }
        fetchCategories();

    }, [dispatch, categories])

    const createProductHandler = async () => {
        if (window.confirm('Are you sure to create?')) {
            dispatch({ type: 'CREATE_REQUEST' });
            try {
                const { data } = await axios.post('/api/products',
                    {},
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                alert('create new product successfully')
                dispatch({
                    type: 'CREATE_SUCCESS',
                })
                navigate(`/admin/productlist/${data.product._id}`)
            }
            catch (err) {
                dispatch({
                    type: 'CREATE_FAIL',
                    // payload: err.message,
                })
            }
        }
    }
    const deleteHandler = async (product) => {
        if (window.confirm('Are you sure to delete this product?')) {
            console.log(product._id)
            dispatch({ type: 'DELETE_REQUEST' });
            try {
                await axios.delete(`/api/products/${product._id}`,
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                )
                alert('delete product successfully');
                dispatch({
                    type: 'DELETE_SUCCESS'
                })
            }
            catch (err) {
                dispatch({
                    type: 'DELETE_FAIL'
                })
            }

        }

    }

    let i = 1;
    const count = () => {
        return i++;
    }


    return (
        <div>
            <div className="row-create">
                <div>
                    <h1  >Product List</h1>
                </div>
                <div>
                    <button className="sign-in" onClick={createProductHandler}>
                        Create A Product
                        <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    </button>

                </div>
            </div>
            {loadingCreate && <LoadingBox></LoadingBox>}
            {
                loading ? (
                    <LoadingBox  ></LoadingBox >
                ) : error ? (
                    <MessageBox variant="danger"> {error} </MessageBox>
                ) : (
                    <>
                        <div className="row admin-product-watchlist">
                            <div>
                                <h2>Total Products</h2>
                                <p>{products.length}</p>
                            </div>
                            <div>
                                <h2>Out Of Stock</h2>
                                <p>{products.filter((a) => a.countInStock === 0).length}</p>
                            </div>
                            <div>
                                <h2>Total Items</h2>
                                <p>{products.reduce((a, c) => c.countInStock + a, 0)}</p>
                            </div>
                            <div>
                                <h2>Categories</h2>
                                <p>{categories.length}</p>
                            </div>
                        </div>
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th>Num</th>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Items</th>
                                    <th>Category</th>
                                    <th colSpan={2}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td>{count()}</td>
                                        <td> {product._id}</td>
                                        <td>
                                            <div className="row-left">
                                                <img src={product.image} className="profile-pic-mini" alt=''></img>
                                                {product.name}
                                            </div>
                                        </td>
                                        <td>{product.price} </td>
                                        <td>{product.countInStock} </td>
                                        <td>{product.category} </td>
                                        <td>
                                            <button className='action-btn edit-btn'
                                                onClick={() => navigate(`/admin/productlist/${product._id}`)}>Edit
                                                <i className="fa fa-pencil" aria-hidden="true"></i></button>
                                        </td>
                                        <td>
                                            <button className='action-btn delete-btn'
                                                onClick={() => deleteHandler(product)}>Delete
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
    )
}
