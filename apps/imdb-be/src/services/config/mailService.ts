import * as nodemailer from "nodemailer"
import { existsSync } from "fs";
import { renderFile } from "ejs"
import { resolve } from "path";



const transport = nodemailer.createTransport({
  host: process.env.NX_MAILTRAP_HOST,
  port: process.env.NX_MAILTRAP_PORT,
  auth: {
    user: process.env.NX_MAILTRAP_USER,
    pass: process.env.NX_MAILTRAP_PASSWORD

  }
});

export const sendMail = async (to: string[], subject: string, text: string, file: string, variable: object = {}) => {

  const path = `/home/dusan/Desktop/Praksa/imdb-app/imdb-be/apps/imdb-be/emails/${file}.ejs`

  if (!existsSync(path)) {
    console.warn('Template not found')
    return
  }
  const htmlRender = await renderFile(path, variable, {
    async: true
  })


  try {
    for (let i = 0; i < to.length; i++) {
      const message = {
        from: "NoReplay@mail.com",
        to: to[i],
        subject,
        text,
        html: htmlRender
      };
      await transport.sendMail(message)
    }
    return true
  } catch (error) {
    console.log(error);
    return false
  }

}

