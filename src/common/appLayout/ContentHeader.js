import React from 'react';
import PropTypes from 'prop-types';

import SqButton from './sqButton';
import SearchDialog from '../../features/search/SearchDialog';

// To add buttons to the header, pass objects { class, action } in headerButtons.
// Search now always appears last.
const ContentHeader = ({ headerText, headerButtons, fullSize }) => (
  <div className={`flex justify-between items-center ${fullSize ? 'col-span-full' : 'col-span-9'} row-start-1 bg-background-lightgrey-plutus px-10 py-3`}>
    <h3 className="text-xl font-semibold font-lato text-primary-dark-plutus">
      {headerText}
    </h3>
    <div className="flex space-x-2 text-2xl text-primary-grey-plutus">
      {headerButtons.map((button, index) => (
        <SqButton
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          action={button.action}
          buttonClass={button.class}
        />
      ))}
      <SearchDialog />
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
