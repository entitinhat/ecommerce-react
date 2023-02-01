
import express from 'express'
import nodemailer from 'nodemailer'


const sendEmailRouter = express.Router();
// send mail
sendEmailRouter.post("/", (req, res) => {
    const { email, cartItemsClone } = req.body;
    const nameItem = cartItemsClone.map((cartItem) => (cartItem.name));
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD
            }
        });

        const mailOptions = {
            from: '"Entiti Nhật 💖" <nhatktvn2001@gmail.com>',
            to: email,
            subject: "Your order is successful!!!",
            html: `<table style=" border: 1px solid;
            text-align: center;">
            <thead>
                <tr>
                    <th>Num</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th colSpan={2}>Actions</th>
                </tr>
            </thead>
            <tbody>
           
            <tr>
                    <td>name1</td>
                    <td>{cartItem.name}</td>
                    <td>heading</td>
                    <td>heading</td>
                    <td>heading</td>
                    <td>heading</td>
                </tr>
            </tbody>
            </table>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error" + error)
            } else {
                alert('Order successfully ^^ Please check your email to see your order and wait a few days to receive.')
                console.log("Email sent:" + info.response);
                res.status(201).json({ status: 201, info })
            }
        })
        // console.log('hello')

    } catch (error) {
        console.log("Error" + error);
        res.status(401).json({ status: 401, error })
    }
});


export default sendEmailRouter;