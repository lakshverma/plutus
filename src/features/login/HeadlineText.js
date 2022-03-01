import React from "react";

const HeadlineText = (props) => {
  return (
    <div className={props.className}>
      <h1 className="text-[32px] font-bold font-lato text-primary-dark-plutus leading-11half">
        Welcome to Plutus CRM. Sign In to continue.
      </h1>
      <p className="text-sm text-primary-grey-plutus font-lato">
        Enter your details to proceed further.
      </p>
    </div>
  );
};

export default HeadlineText;
