import express from 'express'
import { v2 as cloudinary } from 'cloudinary';

import streamifier from 'streamifier';
// import { isAdmin, isAuth } from '../utils';
import multer from 'multer';

const uploadRouter = express.Router();

const upload = multer();

uploadRouter.post('/',
    // isAuth,
    // isAdmin,
    upload.single('file'),
    async (req, res) => {
        cloudinary.config({
            cloud_name: "dxucktn2g",
            api_key: "627215598775438",
            api_secret: "vDYr4ykAJIDjMAJdn4rNacc5_gU"
        });
        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            })
        }
        const result = await streamUpload(req);
        res.send(result);
    })

export default uploadRouter;