import axios from 'axios';
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import Rating from '../component/Rating'
import { listDetail } from '../constants/productActions';
import { PRODUCT_LIST_FAIL } from '../constants/productConstants';
import { BASE_URL } from '../helper.js';

const reducer = (state, action) => {
    switch (action.type) {
        case 'REFRESH_PRODUCT':
            return { ...state, productUpdate: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreateReview: true };
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreateReview: false };
        case 'CREATE_FAIL':
            return { ...state, loadingCreateReview: false };
        default:
            return state;
    }
}


export default function ProductScreen(props) {
    const [{ loadingCreateReview, productUpdate, }, dispatch] =
        useReducer(reducer, {
            loadingCreateReview: true,
            //   product: [],
            //   loading: true,

        });

    const dispatchh = useDispatch();
    const { id } = useParams();
    console.log(id)
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [qty, setQty] = useState(1);
    const navigate = useNavigate();
    const productDetail = useSelector((state) => state.productDetail);
    const { loading, product } = productDetail;
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const reviewsRef = useRef();


    useEffect(() => {
        dispatchh(listDetail(id))
    }, [dispatchh, id])
    const AddToCartHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`);
    }
    const stringToHTML = function (str) {
        var dom = document.createElement('div');
        dom.innerHTML = str;
        return dom;
    };

    const createMarkup = () => {
        return { __html: product.description };
    }    // for render HTML in JSX
    const submitFormReview = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${BASE_URL}/api/products/${product._id}/reviews`, {
                name: userInfo.name, comment, rating
            }, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            })
            dispatch({
                type: 'CREATE_SUCCESS'
            })
            alert('send review successfully')
            product.reviews.unshift(data.review); // review là 1 object định nghĩa trong router sau
            product.numReviews = data.numReviews;
            product.rating = data.rating;
            dispatch({
                type: 'REFRESH_PRODUCT', payload: product,
            })
            window.scrollTo({
                behavior: 'smooth',
                top: reviewsRef.current.offsetTop,
            })
        }
        catch (error) {
            alert('You have already submitted your review');
            dispatch({ type: 'CREATE_FAIL' })
        }
    }
    if (!loading) {
        console.log(productDetail)
        return (
            <>
                <div>
                    {/* {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger"> {error} </MessageBox>
            ) : (
                 <Link to="/"> Back to result </Link> */}



                    <div className="row-image">
                        <div className="col-2 row-image">
                            <div>
                                <img className="large"
                                    src={product.image} alt={product.name}>
                                </img>
                            </div>
                            <div>
                                <img className="large"
                                    src={product.imageBack} alt={product.name}>
                                </img>
                            </div>
                        </div>
                        <div className="col-1">
                            <ul>
                                <li className="product-title"> {product.name} </li>
                                <li> Price: ${product.price}</li>
                                <div className="row-left">
                                    <Rating
                                        rating={product.rating} numReviews={product.numReviews} />
                                    <span className="num-review">{product.numReviews} {product.numReviews > 1 ? 'reviews' : 'review'}</span>
                                </div>
                            </ul>
                            <ul className="product-ul">
                                {/* <li>
                                <div className="row-image">
                                    <div> Price: </div>
                                    <div>${product.price}</div>
                                </div>
                            </li> */}
                                <li>
                                    <div className="row-image">
                                        <div> Status: </div>
                                        <div>
                                            {product.countInStock > 0 ?
                                                (<span className="success"> In Stock</span>) :
                                                (<span className="error"> Unavailable</span>)}
                                        </div>
                                    </div>
                                </li>


                                {
                                    product.countInStock > 0 && (
                                        <>
                                            <li>
                                                <div className="row-image">
                                                    <div>Quantity: </div>

                                                    <div>
                                                        <select value={qty} onChange={(e) => setQty(e.target.value)}>
                                                            {
                                                                [...Array(product.countInStock).keys()].map(
                                                                    (x) => (
                                                                        <option key={x + 1} value={x + 1}>
                                                                            {x + 1}
                                                                        </option>
                                                                    )
                                                                )
                                                            }
                                                        </select>

                                                    </div>
                                                </div>
                                                <div className="row-mini-img">
                                                    <img className="mini-color" src={`/images/${product.color}.jpg`} alt='blue'></img>
                                                    <p>{product.color}</p>
                                                </div>
                                            </li>
                                            <li>
                                                <h1>Description</h1>
                                                <div dangerouslySetInnerHTML={createMarkup()}></div>
                                            </li>
                                            <li>
                                                <button className="add-cart" onClick={AddToCartHandler}>Add to Cart </button>
                                            </li>

                                        </>

                                    )
                                }



                            </ul>
                        </div>
                        {/* <div className="col-1 card-body">

                    </div> */}
                    </div>
                </div>
                <div className="review-section">
                    <div>
                        <h1 ref={reviewsRef}>Reviews</h1>
                        <div>
                            {product.reviews.length === 0 && (
                                <MessageBox>There is no reviews</MessageBox>
                            )}
                        </div>
                    </div>
                    <div className=''>
                        {product.reviews.map((review) => (
                            <>
                                <ul className="review-comment">
                                    <li key={review._id}>
                                        <strong>{review.name}</strong>
                                        <div>
                                            <Rating rating={review.rating}></Rating>
                                            {review.createdAt.substring(0, 10)}
                                        </div>
                                        <p>{review.comment}</p>
                                    </li>
                                </ul>
                            </>
                        ))}
                    </div>
                    <div className=''>
                        {/* onSubmit={submitFormReview} */}
                        {userInfo ? (
                            <form className="review-form" onSubmit={submitFormReview}>
                                <h1>Write a review for this product</h1>
                                <div className=''>
                                    <label name='rating' >Rating</label>
                                    <i className="fa fa-smile-o" aria-hidden="true"></i>
                                    <select value={rating}
                                        required onChange={(e) => setRating(e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                                <div className=''>
                                    <label name='comment'>Write your comment here!</label>
                                    <i className="fa fa-commenting-o" aria-hidden="true"></i>
                                    <textarea value={comment} rows='3'
                                        onChange={(e) => setComment(e.target.value)}>

                                    </textarea>
                                </div>
                                <div>
                                    <button type='submit' className='sign-in'
                                    >Send your comment</button>
                                </div>
                            </form>) : (
                            <button className='login-review' onClick={() => navigate(`/signin`)}>
                                Log In To Write Your Review
                            </button>)}

                    </div>
                </div>

            </>

        )
    }

}
