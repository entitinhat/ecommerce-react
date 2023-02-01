import express from 'express'
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import { isAdmin, isAuth } from '../utils.js';


const searchRouter = express.Router();

searchRouter.get('/', expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
}))


searchRouter.get('/abc',
    expressAsyncHandler(async (req, res) => {
        const { query } = req;
        const category = query.category || '';
        const price = query.price || '';
        const color = query.color || '';
        const order = query.order || '';
        const searchQuery = query.query || '';



        const searchQueryFilter = searchQuery && searchQuery !== 'all' ? {
            name: {
                $regex: searchQuery,
                $options: 'i',
            }
        } : {};
        const categoryFilter = category && category !== 'all' ? { category } : {};
        const priceFilter = price && price !== 'all' ? {
            price: {
                $lte: Number(price),
            }
        } : {};

        const colorFilter = color && color !== 'all' ? {
            color: {
                $regex: color,
                $options: 'i',
            }
        } : {};

        const sortOrder = (order === 'az') ? {
            name: 1,
        } : (order === 'za') ? {
            name: -1,
        } : (order === 'h2l') ? {
            price: -1,
        } : (order === 'l2h') ? {
            price: 1,
        } : {};



        const products = await Product.find({
            ...searchQueryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...colorFilter,

        })
            .sort(sortOrder);


        const countProducts = await Product.countDocuments({
            ...searchQueryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...colorFilter,

        })  // countProducts step 4
        res.send({
            products,
            countProducts,
        });  // count pro step 5
    }))


//   Pants , Shirts




export default searchRouter;
