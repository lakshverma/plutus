import React from "react";

const LoginMainLayout = (props) => {
  return (
    <div className="grid h-screen grid-cols-11 grid-rows-1">
      <div className="z-10 flex flex-col items-center col-span-6 col-start-1 row-span-1 row-start-1 bg-white border-2 border-white rounded-r-xl">
        {/* This is to ensure that both the sibling elements have the same width. The headline text will wrap if the amount of text exceeds the max width.
        361px is the width of large form input element (including the width of the input icon) */}
        <div className="max-w-[361px]">
            {props.headline}
            {props.form}
        </div>
      </div>
      <div className="col-span-6 col-start-6 row-span-1 row-start-1 overflow-hidden bg-primary-blue-plutus bg-gradient-radial-plutus">
        <div className="xl:-mt-10 2xl:-mt-24">{props.img}</div>
      </div>
    </div>
  );
};

export default LoginMainLayout;
