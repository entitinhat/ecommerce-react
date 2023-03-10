import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Rating from './Rating';

export default function Product(props) {

    // Toggle Thumbnail
    const { product } = props;
    const [image, setImage] = useState(product.image);
    const toggleImage = () => {
        // setTimeout(() => {
        //     if (image === product.image) {
        //         if (product.imageBack) {
        //             setImage(product.imageBack);
        //         }

        //     } else {
        //         setImage(product.image);
        //     }
        // }, 150)
        if (image === product.image) {
            if (product.imageBack) {
                setImage(product.imageBack);
            }

        } else {
            setImage(product.image);
        }
    }
    return (
        <div key={product._id} className="card">
            <Link to={`/product/${product._id}`}>
                <img className="medium" src={image} alt={product.name} onMouseOver={toggleImage} onMouseOut={toggleImage} />
            </Link>
            <div className="card-body">
                <Link to={`/product/${product._id}`}>
                    <h2>{product.name}</h2>
                </Link>
                <div className="price">${product.price}</div>
                <div className='row-left'>
                    <Rating
                        rating={product.rating} numReviews={product.numReviews}
                    />
                    <span className="num-review">{product.numReviews} {product.numReviews > 1 ? 'reviews' : 'review'}</span>
                </div>

            </div>

        </div>
    )
}
