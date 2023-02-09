import express from 'express';
import data from './data.js'
import userRouter from './routers/userRouter.js';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv'
import productRouter from './routers/productRouter.js';
import uploadRouter from './routers/uploadRouter.js';
import searchRouter from './routers/searchRouter.js';
import sendEmailRouter from './routers/sendEmailRouter.js';
import cors from 'cors'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// const corsConfig = {
//     origin: true,
//     methods: 
//     credentials: true,
//     maxAge: 3600
//   };



mongoose.connect(process.env.MONGODB_URL, {
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
app.use('/', (req, res) => {
    res.send('hello')
})
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, '/frontend/build')));
// app.get('*', (req, res) =>
//     res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
// );

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("hello at http://localhost:5000");
});