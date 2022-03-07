import React from "react";
import HeadlineText from "./HeadlineText";
import LoginMainLayout from "./LoginMainLayout";
import { ReactComponent as RecoverAccountImg } from "./recoverAccount.svg";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPassword = () => {
    return(
        <LoginMainLayout 
        headline={<HeadlineText 
        className="mt-28 2xl:mt-80"
        head="Let's Reset your Password."
        // head2="Enter your details to recover."
        subhead="In order to protect your account, make sure your password is longer than 7 characters." />}
        form={<ResetPasswordForm className="mt-16"/>}
        img={<RecoverAccountImg />}
        customWidth="400px"
        />
    )
}

export default ResetPassword;
