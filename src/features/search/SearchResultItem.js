import React from 'react';
import PropTypes from 'prop-types';

const SearchResultItem = ({ type, title, description }) => {
  let iconClass;

  switch (type) {
    case 'contact':
      iconClass = 'las la-id-card';
      break;
    case 'note':
      iconClass = 'las la-sticky-note';
      break;
    case 'email':
      iconClass = 'las la-envelope';
      break;
    case 'meeting':
      iconClass = 'las la-handshake';
      break;
    case 'task':
      iconClass = 'las la-tasks';
      break;
    default:
      iconClass = '';
  }

  return (
    <div className="p-3">
      <div className="text-sm md:text-base lg:text-m xl:text-lg">
        <i className={`pr-2 ${iconClass}`} />
        <span className="font-medium">
          {title}
        </span>
      </div>
      <div className="pb-3 text-sm border-b-2 text-primary-grey-plutus sm:text-sm lg:text-m xl:text-lg">
        {description}
      </div>
    </div>
  );
};

SearchResultItem.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default SearchResultItem;
