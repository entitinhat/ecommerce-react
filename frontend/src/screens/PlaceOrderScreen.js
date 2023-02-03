import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../component/CheckoutSteps'
import ShippingAddressScreen from './ShippingAddressScreen'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import EmailSending from '../component/EmailSending.js'
import { CART_CLEAR } from '../constants/cartConstants';



export default function PlaceOrderScreen() {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress, paymentMethod, cartItems } = cart;
    console.log(cartItems, 'cartItems in place order screen')
    const cartItemsClone = cartItems;
    // console.log(cartItemsClone[0].name, 'cartItems clone')
    // cartItemsClone.map((cartItem)=> {

    // })
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    console.log(userInfo, 'userInfo trong placeorder')

    const itemsPrice = (cartItems.reduce((a, c) => a + c.qty * c.price, 0)).toFixed(2);
    const shippingPrice = (itemsPrice > 100 ? 10 : 0).toFixed(2);
    const taxPrice = (itemsPrice * 0.1).toFixed(2);
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    const [email, setEmail] = useState(userInfo.email)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sendEmail = async (e) => {
        e.preventDefault();
        alert('Order Successfully! You can check your email to see your orders. Thanks for choosing our shop! Have A Nice Day ^^ ');
        // navigate('/home');
        dispatch({ type: CART_CLEAR });
        const res = await fetch('/api/send', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                cartItemsClone,
                userInfo
            })
        });

        const data = await res.json();
        console.log(data);

        if (data.status === 401 || !data) {
            console.log("error")
        } else {
            setEmail("");

            console.log("Email sentt")
        }


    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>

            <div className="placeorder-row">
                <div className="col-3">
                    <div className="card-body">
                        <div> <h1> Shipping</h1></div>
                        <div>Name: {shippingAddress.fullName} </div>
                        <div>Address:&nbsp;
                            {shippingAddress.address},&nbsp;
                            {shippingAddress.city},&nbsp;
                            {shippingAddress.postalCode},&nbsp;
                            {shippingAddress.country} </div>
                    </div>
                    <div className="card-body">
                        <div><h1>Payment</h1></div>
                        <p><strong>Method</strong>: {paymentMethod}</p>
                    </div>
                    <div className="card-body">
                        <div><h1>Order Items</h1></div>
                        <ul>
                            {cartItems.map((item) => (
                                <li key={item.product}>
                                    <div className="row">
                                        <div>
                                            <img src={item.image} alt={item.name} className="small"></img>
                                        </div>
                                        <div>
                                            <Link to={`/product/${item.product}`}>{item.name} </Link>
                                        </div>
                                        <div>{item.qty} x ${item.price}=${item.qty * item.price}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="col-4 order-summary-row">
                    <div>
                        <h1> Order Summary</h1>
                    </div>
                    <div className="row">
                        <div> Items:</div>
                        <div>${itemsPrice}</div>
                    </div>
                    <div className="row">
                        <div> Shipping:</div>
                        <div>${shippingPrice}</div>
                    </div>
                    <div className="row">
                        <div> Tax:</div>
                        <div>${taxPrice}</div>
                    </div>
                    <div className="row">
                        <div> <strong>Order Total: </strong></div>
                        <div>${totalPrice}</div>
                    </div>
                    <div>
                        <button className="order-btn" onClick={sendEmail}>Place Order</button>
                    </div>
                </div>

            </div>

        </div>
    )
}
