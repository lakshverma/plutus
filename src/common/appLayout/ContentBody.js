import React from 'react';
import PropTypes from 'prop-types';

const ContentBody = ({ bodyContentElement, fullSize, bodyBgClass }) => (
  <div
    className={`overflow-y-auto ${bodyBgClass} ${
      fullSize ? 'col-span-full' : 'col-span-9'
    } row-start-2`}
  >
    {bodyContentElement}
  </div>
);

ContentBody.propTypes = {
  bodyContentElement: PropTypes.element.isRequired,
  fullSize: PropTypes.bool,
  bodyBgClass: PropTypes.string,
};

ContentBody.defaultProps = {
  fullSize: false,
  bodyBgClass: 'bg-white',
};

export default ContentBody;
