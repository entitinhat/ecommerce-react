import axios from "axios";
import { PRODUCT_DETAIL_FAIL, PRODUCT_DETAIL_REQUEST, PRODUCT_DETAIL_SUCCESS, PRODUCT_LIST_FAIL, PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS } from "./productConstants"
import { BASE_URL } from "../helper.js";

export const listProduct = () => async (dispatch) => {
    dispatch({
        type: PRODUCT_LIST_REQUEST
    });
    try {
        const { data } = await axios.get(`${BASE_URL}/api/products`);
        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        })
    }
    catch (err) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: err.message
        })
    }
}

export const listDetail = (productId) => async (dispatch) => {
    dispatch({
        type: PRODUCT_DETAIL_REQUEST,
        payload: productId
    })
    try {
        const { data } = await axios.get(`${BASE_URL}/api/products/${productId}`)
        dispatch({
            type: PRODUCT_DETAIL_SUCCESS,
            payload: data
        })
    }
    catch (error) {
        dispatch({
            type: PRODUCT_DETAIL_FAIL,
            payload: error.message
        })

    }
}