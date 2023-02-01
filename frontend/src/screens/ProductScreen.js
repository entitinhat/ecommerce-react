import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import Rating from '../component/Rating'
import { listDetail } from '../constants/productActions';




export default function ProductScreen(props) {

    // const { id } = useParams();
    // const product = data.products[id - 1];
    const { id } = useParams();
    console.log(id)
    const [qty, setQty] = useState(1);
    const navigate = useNavigate();
    const productDetail = useSelector((state) => state.productDetail);
    const { loading, product } = productDetail;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listDetail(id))
    }, [dispatch, id])
    const AddToCartHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`);
    }
    const stringToHTML = function (str) {
        var dom = document.createElement('div');
        dom.innerHTML = str;
        return dom;
    };

    function createMarkup() {
        return { __html: product.description };
    }    // for render HTML in JSX
    if (!loading) {
        console.log(productDetail)
        return (
            <div>
                {/* {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger"> {error} </MessageBox>
            ) : (
                 <Link to="/"> Back to result </Link> */}



                <div className="row-image">
                    <div className="col-2 row-image">
                        <div>
                            <img className="large"
                                src={product.image} alt={product.name}>
                            </img>
                        </div>
                        <div>
                            <img className="large"
                                src={product.imageBack} alt={product.name}>
                            </img>
                        </div>
                    </div>
                    <div className="col-1">
                        <ul>
                            <li className="product-title"> {product.name} </li>
                            <li> Price: ${product.price}</li>
                            <Rating
                                rating={product.rating} numReviews={product.numReviews} />


                        </ul>
                        <ul className="product-ul">
                            {/* <li>
                                <div className="row-image">
                                    <div> Price: </div>
                                    <div>${product.price}</div>
                                </div>
                            </li> */}
                            <li>
                                <div className="row-image">
                                    <div> Status: </div>
                                    <div>
                                        {product.countInStock > 0 ?
                                            (<span className="success"> In Stock</span>) :
                                            (<span className="error"> Unavailable</span>)}
                                    </div>
                                </div>
                            </li>


                            {
                                product.countInStock > 0 && (
                                    <>
                                        <li>
                                            <div className="row-image">
                                                <div>Quantity: </div>

                                                <div>
                                                    <select value={qty} onChange={(e) => setQty(e.target.value)}>
                                                        {
                                                            [...Array(product.countInStock).keys()].map(
                                                                (x) => (
                                                                    <option key={x + 1} value={x + 1}>
                                                                        {x + 1}
                                                                    </option>
                                                                )
                                                            )
                                                        }
                                                    </select>

                                                </div>
                                            </div>
                                            <div className="row-mini-img">
                                                <img className="mini-color" src={`/images/${product.color}.jpg`} alt='blue'></img>
                                                <p>{product.color}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <h1>Description</h1>
                                            <div dangerouslySetInnerHTML={createMarkup()}></div>
                                        </li>
                                        <li>
                                            <button className="add-cart" onClick={AddToCartHandler}>Add to Cart </button>
                                        </li>

                                    </>

                                )
                            }



                        </ul>
                    </div>
                    {/* <div className="col-1 card-body">

                    </div> */}
                </div>
            </div>


        )
    }

}
