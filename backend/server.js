import express from 'express';
import data from './data.js'
import userRouter from './routers/userRouter.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import productRouter from './routers/productRouter.js';
import uploadRouter from './routers/uploadRouter.js';
import searchRouter from './routers/searchRouter.js';
import sendEmailRouter from './routers/sendEmailRouter.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/base-react-redux', {
    useNewUrlParser: true,
    useUnifiedTopology: true,

});

// app.get('/api/products/:id', (req, res) => {
//     const product = data.products.find((x) => x._id === req.params.id);
//     if (product) {
//         res.send(product);
//     }
//     else {
//         res.status(404).send({ message: 'product not found' });
//     }
// })

// app.get('/api/products', (req, res) => {
//     res.send(data.products);

// });



app.use('/api/products', productRouter);

app.use('/api/users', userRouter);
app.use('/api/send', sendEmailRouter);

app.use('/api/upload', uploadRouter);
app.get('/', (req, res) => {
    res.send('helrlo');
});

app.listen(5000, () => {
    console.log("hello at http://localhost:5000");
});