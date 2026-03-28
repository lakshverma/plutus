import React from 'react';
import PropTypes from 'prop-types';

const SideBar = ({ sideBarContentElement }) => (
  <div className="h-screen col-span-3 row-span-2 row-start-1 overflow-y-auto bg-white border-r-2 border-outline-grey-plutus">
    {sideBarContentElement}
  </div>
);

SideBar.propTypes = {
  sideBarContentElement: PropTypes.element.isRequired,
};

export default SideBar;
