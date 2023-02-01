import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom';
import LoadingBox from '../component/LoadingBox';
import MarkDownEditor from '../component/MarkDownEditor';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { loading: true, ...state }
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, products: action.payload.products }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload }
        case 'UPDATE_REQUEST':
            return { loadingUpdate: true, ...state }
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false }
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false }
        case 'UPLOAD_REQUEST':
            return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                loadingUpload: false,
                errorUpload: '',
            };
        case 'UPLOAD_FAIL':
            return { ...state, loadingUpload: false, errorUpload: action.payload };
        default:
            return state;
    }
}


const top = ['Shirts', 'Jackets', 'Coats'];
const bottom = ['Trousers', 'Jeans'];

export default function ProductEditScreen() {

    const [{ loading, products, error, loadingCreate, loadingUpload }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })


    const { id } = useParams();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [imageBack, setImageBack] = useState('');
    const [price, setPrice] = useState('');
    const [brand, setBrand] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('');
    const [type, setType] = useState('');
    const userSignin = useSelector(state => state.userSignin);
    const navigate = useNavigate();
    const { userInfo } = userSignin;
    console.log(id);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setName(data.name);
                setCategory(data.category);
                setImage(data.image);
                setImageBack(data.imageBack)
                setPrice(data.price);
                setBrand(data.brand);
                setCountInStock(data.countInStock);
                setDescription(data.description);
                setColor(data.color);
                setType(data.type);
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: data,
                })
            }
            catch (err) {
                dispatch({
                    type: 'FETCH_FAIL'
                })
            }
        }
        fetchData();
    }, [])
    console.log(type, 'tye la');
    const updateProductHandler = async (e) => {
        e.preventDefault();
        dispatch({
            type: 'UPDATE_REQUEST'
        })
        try {
            await axios.put(`/api/products/${id}`,
                {
                    _id: id,
                    name,
                    category,
                    image,
                    imageBack,
                    price,
                    brand,
                    countInStock,
                    description,
                    color,
                    type,
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                })
            dispatch({
                type: 'UPDATE_SUCCESS',

            })
            alert('update product successfully')
            navigate('/admin/productlist')
        }
        catch (err) {
            dispatch({
                type: 'UPDATE_FAIL',
            })
        }
    }
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        try {
            dispatch({ type: 'UPLOAD_REQUEST' });
            const { data } = await axios.post('/api/upload', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${userInfo.token}`,
                },
            });
            dispatch({ type: 'UPLOAD_SUCCESS' });
            alert('Image uploaded successfully');
            if (!image && !imageBack) {
                setImage(data.secure_url);
            }
            if (image && !imageBack) {
                setImageBack(data.secure_url);
            }
            if (!image && imageBack) {
                setImage(data.secure_url);
            }



        } catch (err) {
            dispatch({ type: 'UPLOAD_FAIL', payload: err.message });
        }
    };
    const handleCallback = (childData) => {
        setDescription(childData)
    }
    return (
        <div>
            <div>
                <form className="form" onSubmit={updateProductHandler}>
                    <div>
                        <h1>Edit Product {id}</h1>
                    </div>
                    <div>
                        <label htmlFor='name'>Name</label>
                        <input type='text' id='name'
                            value={name}
                            required
                            onChange={(e) => setName(e.target.value)} ></input>
                    </div>
                    <div>
                        <label htmlFor='category'>Category</label>
                        <input type='text' id='category'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)} ></input>
                    </div>
                    <div>
                        <label htmlFor='type'>Type</label>
                        <input type='text' id='type'
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor='image'>Image</label>
                        <input type='text' id='image'
                            value={image}
                            onChange={(e) => setImage(e.target.value)} ></input>
                    </div>
                    <div>
                        <label htmlFor='imageBack'>Image Back</label>
                        <input type='text' id='imageBack'
                            value={imageBack}
                            onChange={(e) => setImageBack(e.target.value)} ></input>
                    </div>
                    <div>
                        <label htmlFor='imageFile'>Image File</label>
                        <input type='file' id='imageFile'
                            disabled={image && imageBack}
                            onChange={uploadFileHandler}
                        ></input>
                    </div>
                    {loadingUpload && <LoadingBox></LoadingBox>}
                    <div>
                        <label htmlFor='price'>Price</label>
                        <input type='text' id='price'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)} ></input>
                    </div>
                    <div>
                        <label htmlFor='brand'>Brand</label>
                        <input type='text' id='brand'
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)} ></input>
                    </div>
                    <div>
                        <label htmlFor='countInStock'>Count In Stock</label>
                        <input type='text' id='countInStock'
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)} ></input>
                    </div>
                    <div>
                        <label htmlFor='description'>Description</label>
                        <input type='text' id='description'
                            value={description}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor='color'>Color</label>
                        <input type='text' id='color'
                            value={color}
                            onChange={(e) => setColor(e.target.value)} ></input>
                    </div>
                    <MarkDownEditor valueChild={handleCallback}></MarkDownEditor>
                    <div>
                        <button className="sign-in"> Update This Product </button>
                    </div>


                </form>
            </div>


        </div>
    )
}
