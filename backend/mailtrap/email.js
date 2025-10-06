import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";


export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verifying you email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        })
        console.log("Email sent successfully ", response);
    } catch (error) {
        console.log("Error in sending email", error);
        throw new Error("Error in sending verification email", error)
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "4d837bab-f256-473e-96f9-1b5c9bc12cac",
            template_variables:{
                company_info_nam: "The Reset Company",
                name: name,
            }
        })
        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.log("Error in sending welcome email", error);
        throw new Error("Error in sending welcome email", error);
    }
}