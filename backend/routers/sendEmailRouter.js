
import express from 'express'
import nodemailer from 'nodemailer'


const sendEmailRouter = express.Router();
// send mail
sendEmailRouter.post("/", (req, res) => {
    const { email, cartItemsClone, userInfo } = req.body;
    const separator = '<hr></hr>';
    const item = cartItemsClone.map((cartItem) => (`${cartItem.qty} * ${cartItem.name}`));
    const newItem = item.join(separator)
    const priceItem = cartItemsClone.map((cartItem) => (cartItem.qty) * (cartItem.price)).join(separator);
    const totalPriceItem = cartItemsClone.map((cartItem) => (cartItem.qty) * (cartItem.price)).reduce((a, c) => a + c)

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
            html: `
            <p>Hello <strong>${userInfo.name}<strong>!!!</p>
            <p>This email is sent to confỉrm that you have successfully order at 4MENS SHOP!<p>
            <h2>Here is your order list</h2>
            <table style=" border: 1px solid;
            text-align: center; padding: 1rem">
            <thead>
                <tr>
                    <th>Items</th>
                    <th>Price</th>
                    
                </tr> 
            </thead>
            <tbody>
            <tr>
                    <td style="text-align:left">${newItem}</td>
                    <td>${priceItem}</td>    
                </tr>
                <tr>
                    <th>Total Price</th>
                    <td>${totalPriceItem}</td>
                </tr>
            </tbody>
            </table>
            <p> If you have any questions, please contact me via this email or my <span><a href="https://www.facebook.com/NttNhat/">Facebook</a></span> for further information ^^ <p>
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