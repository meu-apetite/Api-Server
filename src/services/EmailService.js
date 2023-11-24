import nodemailer from 'nodemailer';

export class EmailService {
  #userEmail = 'gnerisdev@gmail.com';
  #passEmail = 'arlh ukcb avre jnjs';
  #serviceEmail = 'gmail';

  getTransporter = () => {
    return nodemailer.createTransport({
      service: this.#serviceEmail, auth: { user: this.#userEmail, pass: this.#passEmail }
    });
  }

  send = (mailOptions) => {
    const data = { 
      from: this.#userEmail, 
      to: mailOptions.to, 
      subject: mailOptions.subject, 
      text: mailOptions.text
    };

    const transporter = this.getTransporter();

    transporter.sendMail(data, function (error, info) {
      if (error) {
        console.error(error);
      } else {
        console.log("E-mail enviado com sucesso: " + info.response);
      }
    });
  }
}
