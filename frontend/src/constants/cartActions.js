import axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHIPPING_ADDRESS } from './cartConstants';
import { BASE_URL } from '../helper.js';


export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data
    })
    localStorage.setItem('paymentMethod', JSON.stringify(data));
}

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data
    })
    localStorage.setItem('shippingAddress', JSON.stringify(data));
}

export const addToCart = (productID, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`${BASE_URL}/api/products/${productID}`);
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            name: data.name,
            price: data.price,
            countInStock: data.countInStock,
            image: data.image,
            product: data._id,
            qty,
        }
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));

}

export const removeFromCart = (productID) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: productID
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}