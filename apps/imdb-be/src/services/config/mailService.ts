import * as nodemailer from "nodemailer"
import { existsSync } from "fs";
import { renderFile } from "ejs"



const transport = nodemailer.createTransport({
  host: process.env.NX_MAILTRAP_HOST,
  port: process.env.NX_MAILTRAP_PORT,
  auth: {
    user: process.env.NX_MAILTRA_USER,
    pass: process.env.NX_MAILTRA_PASSWORD

  }
});

export const sendMail = async (to: string[], subject: string, text: string, file: string, variable: object = {}) => {

  const path = `/home/dusan/Desktop/Praksa/imdb-app/imdb-be/apps/imdb-be/emails/${file}.ejs`

  if (!existsSync(path)) {
    throw new Error("Email template not foud!")
  }
  const htmlRender = await renderFile(path, variable, {
    async: true
  })


  try {
    to.forEach(user => {
      const message = {
        from: "NoReplay@mail.com",
        to: user,
        subject,
        text,
        html: htmlRender
      };
      transport.sendMail(message)
    })
    return true
  } catch (error) {
    console.log(error);
    return false
  }

}
