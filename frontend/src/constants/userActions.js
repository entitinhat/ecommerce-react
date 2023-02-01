import axios from "axios"
import {
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_SIGNIN_FAIL,
    USER_SIGNIN_REQUEST,
    USER_SIGNIN_SUCCESS,
    USER_SIGNOUT,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
} from "./userConstants"


export const updateUser = (user) => async (dispatch, getState) => {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST, payload: user });
    const {
        userSignin: { userInfo },
    } = getState();
    try {
        const { data } = await axios.put(`/api/users/${user._id}`, user, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: USER_UPDATE_FAIL, payload: message });
    }
};



export const updateUserProfile = (user) => async (dispatch, getState) => {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST, payload: user });
    const { userSignin: { userInfo } } = getState();
    try {
        const { data } = await axios.put(`/api/users/${userInfo._id}`, user, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data })
        // dispatch({ type: USER_SIGNIN_SUCCESS, payload: data })
        // localStorage.setItem('userInfo', JSON.stringify(data));
        // localStorage.setItem('shippingAddress', JSON.stringify(data));
        alert('Change your profile successfully');

    }
    catch (error) {
        dispatch({ type: USER_UPDATE_PROFILE_FAIL, payload: error.message });
    }

}


export const detailsUser = (userId) => async (dispatch, getState) => {
    dispatch({ type: USER_DETAILS_REQUEST, payload: userId });
    const {
        userSignin: { userInfo },
    } = getState();
    try {
        const { data } = await axios.get(`/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: USER_DETAILS_FAIL, payload: message });
    }
};



export const register = (name, email, password) => async (dispatch) => {
    dispatch({ type: USER_REGISTER_REQUEST, payload: { name, email, password } })
    try {
        const { data } = await axios.post('/api/users/register', { name, email, password });
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })
        dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: data
        })
        localStorage.setItem('userInfo', JSON.stringify(data));
    }
    catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.message
        })
    }
}

export const signin = (email, password) => async (dispatch) => {
    dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } })
    try {
        const { data } = await axios.post('/api/users/signin', { email, password });
        dispatch({
            type: USER_SIGNIN_SUCCESS,
            payload: data
        })
        alert('Login successfully!')
        localStorage.setItem('userInfo', JSON.stringify(data));
    }
    catch (error) {
        dispatch({
            type: USER_SIGNIN_FAIL,
            payload: error.message
        })
        alert('Wrong password or email')
    }
}

export const signout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('cartItems');
    dispatch({ type: USER_SIGNOUT });
}