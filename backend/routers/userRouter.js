import express from 'express';
import data from '../data.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs'
import expressAsyncHandler from 'express-async-handler';
import { generateToken, isAdmin, isAuth } from '../utils.js';

const userRouter = express.Router();

// UserList
userRouter.put('/profile',
    expressAsyncHandler(async (req, res) => {
        const userr = await User.findById(req.userr._id);
        if (userr) {
            userr.name = req.body.name || userr.name;
            userr.email = req.body.email || userr.email;
            if (req.body.password) {
                userr.password = bcrypt.hashSync(req.body.password, 8);
            }
            userr.isAdmin = req.body.isAdmin;

            const updatedUser = await userr.save();
            res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser),
            });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    })
);
userRouter.get('/',
    // isAuth,
    // isAdmin,
    expressAsyncHandler(async (req, res) => {
        const users = await User.find({});
        res.send({
            users
        })
    }))


userRouter.get('/seed',
    expressAsyncHandler(async (req, res) => {

        const createdUsers = await User.insertMany(data.users);
        res.send({ createdUsers });
    }));

userRouter.post('/signin',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    profileImage: user.profileImage,
                    token: generateToken(user),
                })
                return;
            }
        }
        res.status(401).send({ message: 'invalid password or email' });
    }))
userRouter.post('/register',
    expressAsyncHandler(async (req, res) => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            // address: req.body.address,
        })
        const createdUser = await user.save();
        res.send({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
            profileImage: createdUser.profileImage,
            // address: createdUser.address,
            token: generateToken(createdUser),
        });
    }))

userRouter.put('/:id',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.isAdmin = Boolean(req.body.isAdmin) || user.isAdmin;
            user.profileImage = req.body.profileImage || user.profileImage;
            const updatedUser = await user.save();
            res.send({ message: 'user updated', user: updatedUser })
        }
        else res.status(404).send({ message: 'user not found' })

    }))

userRouter.delete('/:id',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.isAdmin) {
                res.status(404).send({
                    message: 'Cannot delete admin'
                })

                return;
            }
            await user.remove();
            res.send({ message: 'user deleted' })
        }
        else res.status(404).send({ message: 'user not found' })
    }))


userRouter.get('/:id',
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            res.send(user);

        } else {
            res.status(404).send({ message: 'user not found' });

        }
    }))
export default userRouter;