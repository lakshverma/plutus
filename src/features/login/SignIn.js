import React from "react";
import HeadlineText from "./HeadlineText";
import LoginForm from "./LoginForm";
import { ReactComponent as SignInImg} from "./signIn.svg"
import LoginMainLayout from "./LoginMainLayout";

const SignIn = () => {
  return (
    <LoginMainLayout 
    headline={<HeadlineText className="mt-28 2xl:mt-80" />}
    form={<LoginForm className="mt-16" />}
    img={<SignInImg />}
    />
  );
};

export default SignIn;
