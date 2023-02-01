// import React from 'react'
// import nodemailer from 'nodemailer'



// const sendEmail = async (receiverEmail) => {
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         host: "smtp.gmail.email",
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: process.env.EMAIL_APP, // generated ethereal user
//             pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
//         },
//     });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//         from: '"From Entiti 👻" <nhatktvn2001@gmail.com>', // sender address
//         to: receiverEmail, // list of receivers
//         subject: "Hello ✔", // Subject line
//         text: "Hello world?", // plain text body
//         html: "<b>Hello world?</b>", // html body
//     });

// }

// export { sendEmail }
