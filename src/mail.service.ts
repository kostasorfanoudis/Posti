import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService{
    private transporter: nodemailer.Transporter;
    constructor() {
      // Creating a temporary Ethereal account for testing
      nodemailer.createTestAccount((err, account) => {
        if (err) {
          console.error('Failed to create test account. ' + err.message);
          return;
        }
  
        // Create a transporter using the Ethereal SMTP settings
        this.transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure, // true for 465, false for other ports
          auth: {
            user: account.user, // generated ethereal user
            pass: account.pass, // generated ethereal password
          },
        });
      });
    }
    
      async sendPasswordResetEmail(to: string, token: string) {
        const resetLink = `http://posti.com/reset-password?token=${token}`;
        const mailOptions = {
          from: 'Auth-backend service',
          to: to,
          subject: 'Password Reset Request',
          html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`,
        };
        console.log(token, to);
        await this.transporter.sendMail(mailOptions);
      }
    

}