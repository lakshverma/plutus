import React from "react";
import HeadlineText from "./HeadlineText";
import LoginForm from "./LoginForm";
import { ReactComponent as SignInImg } from "./signIn.svg";
import LoginMainLayout from "./LoginMainLayout";

const SignIn = () => {
  return (
    <LoginMainLayout
      headline={
        <HeadlineText
          className="mt-28 2xl:mt-80"
          head="Welcome to Plutus CRM. Sign In to continue."
          subhead="Enter your details to proceed further."
        />
      }
      form={<LoginForm className="mt-16" />}
      img={<SignInImg />}
    />
  );
};

export default SignIn;
