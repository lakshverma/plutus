import React from 'react';
import PropTypes from 'prop-types';

const DashboardCard = ({
  title, value, icon, iconColor, bgColor, isNumeric,
}) => (
  <div className="p-6 bg-white border rounded-lg shadow-sm border-outline-grey-plutus">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="mb-2 text-sm font-medium text-primary-grey-plutus font-lato">
          {title}
        </p>
        <p className="text-3xl font-bold text-primary-dark-plutus font-lato">
          {isNumeric ? value.toLocaleString() : value}
        </p>
      </div>
      <div className={`p-3 rounded-lg ${bgColor}`}>
        <i className={`${icon} text-3xl ${iconColor}`} />
      </div>
    </div>
  </div>
);

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.string.isRequired,
  iconColor: PropTypes.string,
  bgColor: PropTypes.string,
  isNumeric: PropTypes.bool,
};

DashboardCard.defaultProps = {
  iconColor: 'text-primary-blue-plutus',
  bgColor: 'bg-skyblue-plutus',
  isNumeric: true,
};

export default DashboardCard;
