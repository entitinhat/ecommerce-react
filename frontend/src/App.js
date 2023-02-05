
import React, { useEffect, useReducer, useState } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { increaseCounter, decreaseCounter } from './redux/action/counterAction';
import data from './data';




import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SignInScreen from './screens/SignInScreen';
import { detailsUser, signout } from './constants/userActions';
import RegisterScreen from './screens/RegisterScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProfileUserScreen from './screens/ProfileUserScreen';
import SearchBox from './component/SearchBox';
import SearchScreen from './screens/SearchScreen';
import axios from 'axios';
import ProtectedRoute from './component/ProtectedRoute';
import AdminRoute from './component/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import LoadingBox from './component/LoadingBox';
import MessageBox from './component/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from './constants/userConstants';
import { ToastContainer } from 'react-toastify';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { loading: true, ...state }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, nameUpdate: action.payload.name, emailUpdate: action.payload.email }
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelelte: false }
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelelte: true }
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelelte: false }
    default:
      return state;
  }
}

function App(props) {

  // const [{ loading, error, nameUpdate, emailUpdate, successDelelte }, dispatch] = useReducer(reducer, {
  //   loading: true,
  //   error: ''
  // })
  const dispatch = useDispatch();

  const [sideBar, setSideBar] = useState(false);
  const [categories, setCategories] = useState([]);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  // const dispatch = useDispatch();

  const [nameUpdatee, setNameUpdate] = useState('');
  const [profileImage, setProfileImage] = useState('');
  // const [userss, setUserss] = useState({})

  // console.log(loading)
  useEffect(() => {

    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/users/${userInfo._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setNameUpdate(data.name)
        setProfileImage(data.profileImage);
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: data,
        })
      }
      catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: err.message
        })
      }

    }
    fetchData();

  }, [userInfo])
  // const namee = user.name;
  console.log(user, 'user in userDetails in app.js')
  // console.log(nameUpdate, 'user name update in backend')
  // console.log(users, 'user backend in app.js')



  // useEffect(() => {
  //   if (!user) {
  //     dispatch({ type: USER_UPDATE_PROFILE_RESET });
  //     dispatch(detailsUser(userInfo._id));
  //   } else {
  //     setName(user.name);

  //     // setPassword(user.password);
  //     // setAddress(user.address);
  //     // setCity(user.city);
  //     // setCountry(user.country);
  //   }

  // }, [dispatch, userInfo, user]);
  // useEffect(() => {
  //   let api = `/api/users/${userInfo._id}`;
  //   fetch(api)
  //     .then((response) => response.json())
  //   // .then((datas) => setUserss(datas))
  // }, [])
  console.log(userInfo, 'hook users')

  const signOutHandler = () => {
    dispatch(signout());
  }
  const viewProfileHandler = () => {

  }
  // const searchSubmitHandler = (e) => {
  //   e.preventDefault();
  //   navigate(`/search/hello`);
  // }
  console.log('user in app.js', user);
  console.log('userInfo in app.js', userInfo)
  console.log('profile img', profileImage)
  // console.log(users, 'user la ig')
  return (
    <>
      {/* {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger"> {error} </MessageBox>
      ) : ( */}
      <BrowserRouter>
        {/* <ToastContainer /> */}
        <div className={
          !sideBar
            ? "container"
            : "container active-sidebar"
        }>

          <header className="row">
            <div>
              {/* <button className="sidebar-btn" onClick={() => setSideBar(!sideBar)}>
                <i className="fa fa-bars"></i>
              </button> */}
              <Link className="brand" to="/">4Mens</Link>
            </div>

            <SearchBox></SearchBox>

            <div className='testdropdown'>
              <Link to="/cart">
                <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                My Cart
                {cartItems.length > 0 && (
                  <span className="badge">{cartItems.length}</span>
                )}

              </Link>
              {userInfo && !userInfo.isAdmin ? (
                <div className="dropdown">
                  <Link to="#" className='row center'>
                    {nameUpdatee}
                    <img src={profileImage} alt='' className="profile-pic-mini"></img>
                    {/* <img src={} alt=""></img> */}
                    {/* <i className="fa fa-caret-down"></i> */}
                  </Link>
                  <ul className="dropdown-content">
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/profile" onClick={viewProfileHandler}>View Profile</Link></li>
                    <li><Link to="/signin" onClick={signOutHandler}>Log Out</Link></li>
                  </ul>
                </div>

              ) : (userInfo && userInfo.isAdmin) ? (
                <>
                  <div className="admin-dropdown">
                    <Link to="#">Admin<i className="fa fa-caret-down"></i></Link>
                    <ul className="admin-dropdown-content">
                      <li><Link to="/admin/productlist">Products</Link></li>
                      <li><Link to="/admin/users">Users</Link></li>
                    </ul>
                  </div>
                  <div className="dropdown">
                    <Link to="#" className="row center">{nameUpdatee}
                      <img src={profileImage} alt='' className="profile-pic-mini"></img>
                    </Link>
                    <ul className="dropdown-content">
                      <li><Link to="/home">Home</Link></li>
                      <li><Link to="/profile" onClick={viewProfileHandler}>View Profile</Link></li>
                      <li><Link to="/signin" onClick={signOutHandler}>Log Out</Link></li>
                    </ul>
                  </div>

                </>

              ) : (
                <Link to="/signin">Sign In
                  <i className="fa fa-user-o" aria-hidden="true"></i></Link>
              )}

            </div>


          </header>


          <main>

            <div className={
              !sideBar
                ? "sidebar"
                : "sidebar active-sidebar"
            }>
              <div className="categories">

                <ul>
                  {categories.map((category) => (
                    <li key={category}>
                      <Link to={`/search?category=${category}`}>{category}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Routes>
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/cart/:id" element={<CartScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/home" element={<HomeScreen />} exact />
              <Route path="/signin" element={<SignInScreen />} />
              <Route index element={<HomeScreen />} />
              <Route path="/profile" element={
                // <ProtectedRoute>
                <ProfileUserScreen />
                // </ProtectedRoute>
              } />

              <Route path="/admin/productlist" element={
                <AdminRoute>
                  <ProductListScreen />
                </AdminRoute>} />
              <Route path="/admin/productlist/:id" element={
                <AdminRoute>
                  <ProductEditScreen />
                </AdminRoute>} />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <UserListScreen />
                </AdminRoute>} />
              <Route path="/admin/users/:id" element={
                <AdminRoute>
                  <UserEditScreen />
                </AdminRoute>} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />

              <Route path="/product/:id" element={<ProductScreen data={data} />} />
            </Routes>


          </main >

          <footer className="row center">
            All right reserved
          </footer>


        </div >
        {/* )} */}
      </BrowserRouter>
      {/* )} */}
    </>
  );
}

export default App;
