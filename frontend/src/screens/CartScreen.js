import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { Link, useSearchParams } from 'react-router-dom';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import { addToCart, removeFromCart } from '../constants/cartActions';

export default function CartScreen(props) {
    const { id } = useParams();
    // const qty = props.location.search ? Number(props.location.search.split('=')[1]) : 1;
    const [searchParams] = useSearchParams();
    const cart = useSelector((state) => state.cart);
    const productDetail = useSelector((state) => state.productDetail);
    const { loading, product, error } = productDetail;
    const { cartItems } = cart;
    console.log('cartItems la', cartItems)
    const qty = searchParams.get('qty');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            dispatch(addToCart(id, qty))
        }
    }, [dispatch, id, qty]);
    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    }
    const checkoutHandler = () => {
        navigate('/signin?redirect=shipping');
    }
    return (
        <>
            <div className="row-image">
                < div className="col-3" >
                    <h1> Shopping Cart </h1>
                    <div>
                        {cartItems.length === 0 ? (
                            <MessageBox>
                                Cart is empty  <Link to="/"> Go Shopping </Link>
                            </MessageBox>
                        ) : (
                            <ul>
                                {cartItems.map((item) => (
                                    <li key={item.product}>
                                        <div className="row cart-list">
                                            <div>
                                                <img src={item.image} alt={item.name} className="small"></img>
                                            </div>
                                            <div>
                                                <Link to={`/product/${item.product}`}>{item.name} </Link>
                                            </div>
                                            <div>
                                                <select value={item.qty} className="select-item-tag"
                                                    onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))} >
                                                    {
                                                        [...Array(item.countInStock).keys()].map(
                                                            (x) => (
                                                                <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            )
                                                        )
                                                    }
                                                </select>
                                            </div>
                                            <div>${item.price}</div>
                                            <div>
                                                <button
                                                    type='button'
                                                    onClick={() => removeFromCartHandler(item.product)}>Delete</button>
                                            </div>

                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )
                        }
                    </div>
                </div >
                <div className="col-4 order-summary-row">
                    <h2>

                        SubTotal ({cartItems.reduce((a, c) => Number(a) + Number(c.qty), 0)} items) :
                        ${cartItems.reduce((a, c) => Number(a) + Number(c.price) * Number(c.qty), 0)}
                    </h2>
                    <div>
                        <button type='button' onClick={checkoutHandler} className="checkout-btn"
                            disabled={cartItems.length === 0}>
                            Proceed To Checkout
                        </button>
                    </div>
                </div>
            </div >

        </>
    )
}
