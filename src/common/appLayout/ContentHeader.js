import React from 'react';
import PropTypes from 'prop-types';

import SqButton from './sqButton';

// [{class, action, actionType}

const ContentHeader = ({ headerText, headerButtons, fullSize }) => (
  <div className={`flex justify-between items-center ${fullSize ? 'col-span-full' : 'col-span-9'} row-span-1 bg-background-lightgrey-plutus`}>
    <h3 className="my-3 ml-10 text-xl font-semibold font-lato text-primary-dark-plutus">
      {headerText}
    </h3>
    <div className="flex space-x-2 text-2xl mr-7 text-primary-grey-plutus">
      {headerButtons.map((button, index) => (
        // Since this is a array of button components that is static, we use index as key.
        // Alternatively, we'd need to map over the array as we init it and give it unique ids.
        // eslint-disable-next-line react/no-array-index-key
        <SqButton key={index} buttonClass={button.class} action={button.action} />
      ))}
    </div>
  </div>
);

ContentHeader.propTypes = {
  headerText: PropTypes.string.isRequired,
  headerButtons: PropTypes.arrayOf(PropTypes.object).isRequired,
  fullSize: PropTypes.bool,
};

ContentHeader.defaultProps = {
  fullSize: false,
};

export default ContentHeader;
