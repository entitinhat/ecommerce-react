import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router';
import CheckoutSteps from '../component/CheckoutSteps'
import { savePaymentMethod } from '../constants/cartActions';

export default function PaymentMethodScreen() {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const submitPaymentHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    }
    return (
        <div>
            <CheckoutSteps step1 step2 step3></CheckoutSteps>
            <form className="form" onSubmit={submitPaymentHandler}>
                <div><h1> Payment Method</h1></div>
                <div>
                    <div>
                        <div className="payment-row">
                            <input type='radio' id="paypal" name='paymentMethod' value='PayPal'
                                required checked onChange={(e) => setPaymentMethod(e.target.value)}></input>
                            <label htmlFor="paypal">PayPal</label>
                        </div>
                        <div className="payment-row">
                            <input type='radio' id='payoneer' name='paymentMethod' value='Payoneer'
                                required onChange={(e) => setPaymentMethod(e.target.value)}></input>
                            <label htmlFor="payoneer">Payoneer</label>
                        </div>

                    </div>


                </div>
                <div>
                    <button className="add-cart" type='submit'> Continuee </button>
                </div>

            </form>
        </div>
    )
}
