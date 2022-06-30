import React from 'react';
import PropTypes from 'prop-types';

const HeadlineText = ({
  className, head, head2, subhead,
}) => {
  const head2Class = head2 ? 'text-[32px] font-bold font-lato text-primary-dark-plutus leading-11half' : 'hidden';
  return (
    <div className={className}>
      <h1 className="text-[32px] font-bold font-lato text-primary-dark-plutus leading-11half">
        {head}
      </h1>
      <h1 className={head2Class}>
        {head2}
      </h1>
      <p className="text-sm text-primary-grey-plutus font-lato">
        {subhead}
      </p>
    </div>
  );
};

HeadlineText.propTypes = {
  className: PropTypes.string.isRequired,
  head: PropTypes.string.isRequired,
  head2: PropTypes.string,
  subhead: PropTypes.string,
};

HeadlineText.defaultProps = {
  head2: '',
  subhead: '',
};

export default HeadlineText;
