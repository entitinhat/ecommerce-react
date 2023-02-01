import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router';

export default function ProtectedRoute({ children }) {
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const navigate = useNavigate();
    console.log(userInfo)
    return userInfo ? children : navigate('/signin');
}
