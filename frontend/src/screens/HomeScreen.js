import React, { useEffect, useState } from 'react'
import Product from '../component/Product'
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { listProduct } from '../constants/productActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from 'react-router';

export default function HomeScreen() {

    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList);
    const { loading, error, products } = productList;

    useEffect(() => {
        dispatch(listProduct())
    }, [dispatch]);
    const navigate = useNavigate();
    return (
        <div>

            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger"> {error} </MessageBox>
            ) : (
                <>
                    <div className="row center">
                        <div className="row center cover-wrapper" onClick={() => navigate(`/search?type=top`)}>
                            <img className="cover" src="/images/top.jpg" alt="top"></img>
                            <p className="cover-name">TOP</p>
                        </div>
                        <div className="row center cover-wrapper" onClick={() => navigate(`/search?type=bottom`)}>
                            <img className="cover" src="/images/trousers.jpg" alt="trousers"></img>
                            <p className="cover-name">BOTTOM</p>
                        </div>
                        <div className="row center cover-wrapper" onClick={() => navigate(`/search?type=backpack`)}>
                            <img className="cover" src="/images/accessories.jpg" alt="accessories"></img>
                            <p className="cover-name">BACKPACK</p>
                        </div>
                    </div>

                    <div className="row center">

                        {

                            products.map((product) => (
                                <Product key={product._id} product={product} />
                            ))

                        }

                    </div>
                </>
            )}
        </div>
    )
}