import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router';

export default function AdminRoute({ children }) {
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const navigate = useNavigate();

    return userInfo && userInfo.isAdmin ? children : navigate('/signin');
}
