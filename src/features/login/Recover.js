import React from "react";
import HeadlineText from "./HeadlineText";
import LoginMainLayout from "./LoginMainLayout";
import RecoveryForm from "./RecoveryForm";
import { ReactComponent as RecoverAccountImg } from "./recoverAccount.svg";


const Recover = () => {
    return(
        <LoginMainLayout 
        headline={<HeadlineText 
        className="mt-28 2xl:mt-80"
        head="Lost your password?"
        head2="Enter your details to recover."
        subhead="Please enter your registered email to proceed further." />}
        form={<RecoveryForm className="mt-16"/>}
        img={<RecoverAccountImg />}
        customWidth="410px"
        />
    )
}

export default Recover;