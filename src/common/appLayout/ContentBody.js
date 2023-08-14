import React from 'react';
import PropTypes from 'prop-types';

const ContentBody = ({ bodyContentElement, fullSize }) => (
  <div className={`${fullSize ? 'col-span-full' : 'col-span-9'} row-span-11 bg-background-lightgrey-plutus flex`}>{bodyContentElement}</div>
);

ContentBody.propTypes = {
  bodyContentElement: PropTypes.element.isRequired,
  fullSize: PropTypes.bool,
};

ContentBody.defaultProps = {
  fullSize: false,
};

export default ContentBody;
