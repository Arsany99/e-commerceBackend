import nodemailer  from "nodemailer";




export const sendEmail = async(to,subject,html , attachments = [])=>{

const transporter = nodemailer.createTransport({
    service:'gmail',    
  auth: {
    user: process.env.EMAILSENDER,
    pass: process.env.PASSWORD,
  },
});

  const info = await transporter.sendMail({
    from: `"Arsany 👻" ${process.env.EMAILSENDER}`, 
    to: to?to:'',
    subject:subject?subject: "Hello ✔", 
    html:html?html: "<b>Hello world?</b>", 
    attachments
  });
if (info.accepted.length) {
    return true
    
}
return false



}