import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { register } from '../constants/userActions';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') ? 'shipping' : 'register'; // giá trị là shipping khi nhắn từ link thanh toán, lúc đầu nhấn sign in luôn thì sẽ là null
    const navigate = useNavigate();
    const userRegister = useSelector((state) => state.userRegister);
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    console.log('cartitems', cartItems);
    const { userInfo, loading, error } = userRegister;

    useEffect(() => {
        if (userInfo) { navigate('/register'); }
        console.log(userInfo);
    }, [userInfo, navigate]);
    // console.log(redirect);
    const dispatch = useDispatch();
    const submitRegisterFormHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('password and confirm password are not match');
        }
        else { dispatch(register(name, email, password)); }
        navigate('/');
    }
    const [eye, setEye] = useState(<i className="fa fa-eye-slash eye-icon"></i>);
    const [typePassword, setTypePassword] = useState("password");
    const toggleEye = () => {
        if (typePassword === "password") {

            setEye(<i className="fa fa-eye eye-icon"></i>);
            setTypePassword("text");
        } else if (typePassword === "text") {
            setEye(<i className="fa fa-eye-slash eye-icon"></i>);
            setTypePassword("password");
        }
    }
    return (
        <div>
            <form className="form" onSubmit={submitRegisterFormHandler}>
                <div>
                    <h1> Create An Account </h1>
                </div>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input type='text' id='name' placeholder='Enter your name' required onChange={(e) => setName(e.target.value)}></input>
                </div>
                <div>
                    <label htmlFor='email'>Email Address</label>
                    <input type='email' id='email' placeholder='Enter your email' required onChange={(e) => setEmail(e.target.value)}></input>
                </div>
                <div >
                    <label htmlFor='password'>Password</label>
                    <div className="password-field">
                        <input type={typePassword} id='password' placeholder='Enter your password' required onChange={(e) => setPassword(e.target.value)}></input>
                        <span onClick={toggleEye}>{eye}</span>
                    </div>
                </div>
                <div>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <div className="password-field">
                        <input type={typePassword} id='confirmPassword' placeholder='Confirm your password' required onChange={(e) => setConfirmPassword(e.target.value)}></input>
                        <span onClick={toggleEye}>{eye}</span>
                    </div>
                </div>
                <div>
                    <button className="sign-in"> Register </button>
                </div>
                <div>
                    Already a member? {<Link to="/signin">Sign In</Link>}
                </div>

            </form>
        </div>
    )
}
