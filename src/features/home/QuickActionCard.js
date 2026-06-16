import React from 'react';
import PropTypes from 'prop-types';

const QuickActionCard = ({
  title, description, icon, color, iconColor, onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-start p-5 text-left transition-all bg-white border rounded-lg shadow-sm border-outline-grey-plutus hover:shadow-md hover:border-primary-blue-plutus group"
  >
    <div className={`p-3 mr-4 rounded-lg ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
      <i className={`${icon} text-2xl ${iconColor}`} />
    </div>
    <div className="flex-1">
      <h3 className="mb-1 text-base font-bold transition-colors text-primary-dark-plutus font-lato group-hover:text-primary-blue-plutus">
        {title}
      </h3>
      <p className="text-sm text-primary-grey-plutus font-lato">
        {description}
      </p>
    </div>
    <i className="mt-1 ml-2 text-xl transition-colors las la-arrow-right text-primary-grey-plutus group-hover:text-primary-blue-plutus" />
  </button>
);

QuickActionCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
  iconColor: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

QuickActionCard.defaultProps = {
  color: 'bg-primary-blue-plutus',
  iconColor: 'text-primary-blue-plutus',
};

export default QuickActionCard;
