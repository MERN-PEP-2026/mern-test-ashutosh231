import {transporter} from "../config/mail.js"

export const sendMail= async ({to,subject,html}) =>{
    try{
        const info=await transporter.sendMail({
            from:`"Task Manager" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log("Email sent:",info.messageId);
        return info;
    }catch(error){
        console.error("❌ Email failed:", error?.message || error);
        throw new Error("Email could not be sent");
    }
}