import React from "react";
import PropTypes from "prop-types";

const LoginMainLayout = ({ headline, form, img, customWidth}) => {
  const maxWidth = customWidth ? `max-w-[${customWidth}]` : "max-w-[361px]";
  return (
    <div className="grid h-screen grid-cols-11 grid-rows-1">
      <div className="z-10 flex flex-col items-center col-span-6 col-start-1 row-span-1 row-start-1 bg-white border-2 border-white rounded-r-xl">
        {/* This is to ensure that both the sibling elements have the same width. The headline text will wrap if the amount of text exceeds the max width.
        361px is the width of large form input element (including the width of the input icon) */}
        <div className={String(maxWidth)}>
            {headline}
            {form}
        </div>
      </div>
      <div className="col-span-6 col-start-6 row-span-1 row-start-1 overflow-hidden bg-primary-blue-plutus bg-gradient-radial-plutus">
        <div className="xl:-mt-10 2xl:-mt-24">{img}</div>
      </div>
    </div>
  );
};

LoginMainLayout.propTypes = {
  headline: PropTypes.element.isRequired,
  form: PropTypes.element.isRequired,
  img: PropTypes.element.isRequired,
  customWidth: PropTypes.string,
}

export default LoginMainLayout;
