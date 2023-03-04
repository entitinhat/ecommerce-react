import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react'
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import Product from '../component/Product';
import { USER_UPDATE_PROFILE_SUCCESS } from '../constants/userConstants';

import { BASE_URL } from '../helper.js';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true }
        case 'FETCH_SUCCESS':
            return {
                ...state,
                products: action.payload.products,
                countProducts: action.payload.countProducts,   // count products step 1
                loading: false
            }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        default:
            return state;

    }
}

const prices = [{
    name: '< 50 USD',
    value: '50'
},
{
    name: '< 100 USD',
    value: '100'
},
{
    name: '< 200 USD',
    value: '200'
}]

const colors = [{
    name: 'Black',
    color: 'black',
    img: 'https://res.cloudinary.com/dxucktn2g/image/upload/v1675143276/black_nxzp5d.webp'
},
{
    name: 'White',
    color: 'white',
    img: 'https://res.cloudinary.com/dxucktn2g/image/upload/v1675143276/white_pqzvkw.webp'
},
{
    name: 'Green',
    color: 'green',
    img: 'https://res.cloudinary.com/dxucktn2g/image/upload/v1675143276/green_jrhlqf.webp'
},
{
    name: 'Beige',
    color: 'beige',
    img: 'https://res.cloudinary.com/dxucktn2g/image/upload/v1675143276/beige_fsku6y.webp'
},
{
    name: 'Blue',
    color: 'blue',
    img: 'https://res.cloudinary.com/dxucktn2g/image/upload/v1675143276/blue_wvbww9.webp'
}]



export default function SearchScreen(props) {

    // const productList = useSelector(state => state.productList);
    // console.log(productList);
    // const { loading, products, error } = productList;
    const [categories, setCategories] = useState([]);
    const [filterHideShowCategory, setFilterHideShowCategory] = useState(true);
    const [filterHideShowPrice, setFilterHideShowPrice] = useState(true);
    const [filterHideShowColor, setFilterHideShowColor] = useState(true);
    const { search } = useLocation();
    const navigate = useNavigate();
    const sp = new URLSearchParams(search);
    const query = sp.get('query') || 'all';
    const type = sp.get('type') || 'all';
    const category = sp.get('category') || 'all';
    const price = sp.get('price') || 'all';
    const color = sp.get('color') || 'all';
    const order = sp.get('order') || 'az'    // 13.1 Part 1

    const searchRef = useRef();

    const [{ loading, products, error, countProducts }, dispatch] =   // count products step 2
        useReducer(reducer, {
            loading: true,
            error: ''
        })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/api/products/search?query=${query}&type=${type}&category=${category}&price=${price}&color=${color}&order=${order}`);  // 13.1 Part 2
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: data
                })
            }

            catch (error) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: error.message
                })
            }
        }
        fetchData();
    }, [category, price, color, query, order]); // 13.5 part N


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/api/products/categories`);
                setCategories(data);  // ["Pants","Shirts"]
            }
            catch (error) {
                alert(error.message);
            }
        }
        fetchCategories();

    }, [dispatch])
    const getFilterUrl = (filter) => {
        const filterQuery = filter.query || query;
        const filterType = filter.type || '';
        const filterCategory = filter.category || category;
        const filterPrice = filter.price || price;
        const filterColor = filter.color || color;
        const sortOrder = filter.order || order  // 13.1 Part 3
        window.scrollTo({
            behavior: 'smooth',
            top: searchRef.current.offsetTop,
        })
        return `/search?query=${filterQuery}&type=${filterType}&category=${filterCategory}&price=${filterPrice}&color=${filterColor}&order=${sortOrder}`// 13.1 Part 4
    }

    // const hideShowFilter = () => {
    //     if (filter) {
    //         setFilterHideShow(!filter);
    //     }
    //     else setFilterHideShow(true)
    // }


    console.log('loading la', loading)
    return (
        <div className="placeorder-row">
            <div className="search-categories search-items">
                <h1 className="filter-search">Filters

                </h1>
                <div>
                    <div className="row category">
                        <h1>Category</h1>
                        <i className={filterHideShowCategory ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o'} aria-hidden="true" onClick={() => setFilterHideShowCategory(!filterHideShowCategory)}></i>
                    </div>


                    {!filterHideShowCategory ? (<ul className="ul-category">
                        <li>
                            <Link className={'all' === category ? 'search-text bold-text' : 'search-text'}
                                to={getFilterUrl({ category: 'all' })}>All</Link>
                        </li>
                        {categories.map((c) => (
                            <li key={c}>
                                <Link className={c === category ? 'search-text bold-text' : 'search-text'}
                                    to={getFilterUrl({ category: c })}>{c}</Link>
                            </li>
                        ))}

                    </ul>
                    ) : ''}
                    <hr></hr>

                </div>


                <div>
                    <div className="row category">
                        <h1>Price</h1>
                        <i className={filterHideShowPrice ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o'} aria-hidden="true" onClick={() => setFilterHideShowPrice(!filterHideShowPrice)}></i>
                    </div>
                    {!filterHideShowPrice ? (<ul className="ul-category">
                        <li>
                            <Link className={'all' === price ? 'search-text bold-text' : 'search-text'}
                                to={getFilterUrl({ price: 'all' })}>Any</Link>
                        </li>
                        {
                            prices.map((p) => (
                                <li key={p.value}>
                                    <Link className={p.value === price ? 'search-text bold-text' : 'search-text'}
                                        to={getFilterUrl({ price: p.value })}>
                                        {p.name}

                                    </Link>
                                </li>
                            ))
                        }

                    </ul>) : ''}
                    <hr></hr>
                </div>

                <div>
                    <div className="row category">
                        <h1>Color</h1>
                        <i className={filterHideShowColor ? 'fa fa-plus-square-o' : 'fa fa-minus-square-o'} aria-hidden="true" onClick={() => setFilterHideShowColor(!filterHideShowColor)}></i>
                    </div>
                    {!filterHideShowColor ? (<ul className="ul-category">
                        <li>
                            <Link className={'all' === color ? 'search-text bold-text' : 'search-text'}
                                to={getFilterUrl({ color: 'all' })}>Any</Link>
                        </li>
                        {
                            colors.map((cl) => (
                                <li key={cl.color}>
                                    <Link className={cl.color === color ? 'search-text bold-text' : 'search-text'}
                                        to={getFilterUrl({ color: cl.color })}>
                                        {cl.name}
                                        <img src={cl.img} className="filter-img-color" alt=''></img>
                                    </Link>
                                </li>
                            ))
                        }

                    </ul>) : ''}
                    <hr></hr>
                </div>

            </div>
            <div ref={searchRef} className="search-products search-items">
                <div className="row">
                    <p className="count-result">
                        {countProducts < 2 ?
                            (countProducts + ' result') :
                            (countProducts + ' results')}: {query === 'all' ? '' : query}  {/* count products step 3  */}
                    </p>
                    <div className="select">
                        <span>Sort By</span>
                        <select
                            value={order}
                            onChange={(e) => (
                                navigate(getFilterUrl({ order: e.target.value }))   // 13.1 part 5
                            )}>
                            <option value="az">A-Z</option>
                            <option value="za">Z-A</option>
                            <option value="h2l">Price: Highest To Lowest</option>
                            <option value="l2h">Price: Lowest to Highest</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger"></MessageBox>
                ) : (products.length === 0) ? (
                    <MessageBox>Product Not Found</MessageBox>
                ) : (
                    <div className="row center">
                        {
                            products.map((product) => (
                                <Product key={product._id} product={product} />
                            ))
                        }
                    </div>
                )

                }
            </div>


        </div>



    );
}

