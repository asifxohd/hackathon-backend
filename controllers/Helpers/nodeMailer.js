import nodemailer from 'nodemailer';


// ***** NODEMAILER TO SEND MAIL TO USERS *****
async function sendEmail( email, html , fromMail = 'farzinahammedabc@gmail.com', subject = 'For Verification OTP') {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        requireTLS: true,
        auth: {
            user: 'farzinahammedabc@gmail.com',
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: fromMail,
        to: email,
        subject: subject,
        // html : '<h2> Welcome <span style="color:blue">'+name+'<span> .</h2>'+'<h4>Your OTP :<b>'+otp+'</b></h4>'+'<h3>Thank You For Joinig...</h3>'
        html: html
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw new Error('Mail Sending Failed')
        } else {
            console.log("Email is to be sented", info.response);
        }
    })
}

export default sendEmail;