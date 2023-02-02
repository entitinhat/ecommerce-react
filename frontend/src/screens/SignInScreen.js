import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { signin } from '../constants/userActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignInScreen(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') ? 'shipping' : ''; // giá trị là shipping khi nhắn từ link thanh toán, lúc đầu nhấn sign in luôn thì sẽ là null
    const navigate = useNavigate();
    const userSignin = useSelector((state) => state.userSignin);

    const { userInfo, loading, error, success } = userSignin;
    const cart = useSelector((state) => state.cart);
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
    useEffect(() => {
        if (userInfo) {
            navigate(`/${redirect}`);
        }

    }, [userInfo, navigate, redirect]);

    const dispatch = useDispatch();
    const submitFormHandler = (e) => {
        e.preventDefault();
        dispatch(signin(email, password));
        // if (!success) {
        //     alert('Wrong password or email');
        // }

    }

    console.log(userInfo, 'test userinfo')

    return (
        <>


            <form className="form" onSubmit={submitFormHandler}>
                <div>
                    <h1> Sign In </h1>
                </div>
                <div>
                    <label htmlFor='email'>Email Address</label>
                    <input type='email' id='email' placeholder='Enter your email' required onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <div className="password-field">
                        <input type={typePassword} id='password' placeholder='Enter your password' required onChange={(e) => setPassword(e.target.value)} />
                        <span onClick={toggleEye}>{eye}</span>
                    </div>




                </div>
                <div>
                    <button className="sign-in"> Sign In </button>
                </div>
                <div>
                    New Customer? {<Link to="/register">Create your account</Link>}
                </div>

            </form>


        </>

    )
}


