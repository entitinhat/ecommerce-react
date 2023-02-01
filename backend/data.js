import bcrypt from 'bcryptjs'

const data = {
    users: [
        {
            name: 'Entiti',
            email: 'nhatktvn2001@gmail.com',
            password: bcrypt.hashSync('1234', 8),
            isAdmin: true,
        },
        {
            name: 'nguyenbui',
            email: 'buileanhnguyen@gmail.com',
            password: bcrypt.hashSync('123456', 8),
            isAdmin: false,
        },
        {
            name: 'vydinh',
            email: 'vydinh@gmail.com',
            password: bcrypt.hashSync('123456', 8),
            isAdmin: false,
        }
    ],
    products: [
        {
            name: 'Slim Fit Cotton Shirt',
            category: 'Shirts',
            image: '/images/model1.jpg',
            imageBack: '/images/model6.jpg', //imageback
            price: 120,
            brand: 'Nike',
            countInStock: 5,
            rating: 4.5,
            numReviews: 10,
            description: 'high quality product',
            color: 'blue',
        },
        {

            name: 'Striped Slim Fit Shirt',
            category: 'Shirts',
            image: '/images/model2striped.jpg',
            price: 120,
            brand: 'Nike',
            countInStock: 5,
            rating: 4.5,
            numReviews: 10,
            description: 'high quality product',
            color: 'blue',
        },
        {

            name: 'Regular Fit Striped Cotton Shirt',
            category: 'Shirts',
            image: '/images/model3.jpg',
            price: 120,
            brand: 'Nike',
            countInStock: 5,
            rating: 4.5,
            numReviews: 10,
            description: 'high quality product',
            color: 'blue',
        },
        {

            name: 'Raincoat Hooded Jacket',
            category: 'Shirts',
            image: '/images/model4.jpg',
            price: 120,
            brand: 'Nike',
            countInStock: 5,
            rating: 4.5,
            numReviews: 10,
            description: 'high quality product',
            color: 'blue',
        },
        {

            name: 'Wool Funnel Neck Coat',
            category: 'Shirts',
            image: '/images/model5.jpg',
            price: 120,
            brand: 'Nike',
            countInStock: 5,
            rating: 4.5,
            numReviews: 10,
            description: 'high quality product',
            color: 'blue',
        },
        {

            name: 'Jude skinny-fit jeans',
            category: 'Shirts',
            image: '/images/model6.jpg',
            price: 120,
            brand: 'Nike',
            countInStock: 5,
            rating: 4.5,
            numReviews: 10,
            description: 'high quality product',
            color: 'blue',
        },
    ]
};

export default data;