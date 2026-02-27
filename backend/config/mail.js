import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const getEmailCreds = () => {
  const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : "";
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : "";
  return { user, pass };
};

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        ...getEmailCreds(),
    },
});

//for verification
export const verifyMail = async ()=>{
    try{
        await transporter.verify();
        console.log("✅ Mail server ready");
    } catch(error){
        console.log("❌ Mail server error:",error.message);
    }
};