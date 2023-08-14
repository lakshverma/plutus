/**
 * NavItem Component
 *
 * Purpose:
 * - Renders a navigational item for the side Navigation bar using
 * `NavLink` from `react-router-dom`.
 *
 * Props:
 * - link (string): Path for navigation.
 * - iconClass (string): CSS class for the icon.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

function NavItem({ link, iconClass }) {
  const standardClass = 'flex justify-center w-[4.5rem] ml-[0.125rem]';
  const activeClass = `${standardClass} border-r-2 rounded-sm border-r-primary-blue-plutus bg-skyblue-plutus`;
  return (
    <NavLink
      to={link}
      className={({ isActive }) => (isActive ? activeClass : standardClass)}
    >
      <i className={`${iconClass} p-2 text-3xl rounded-lg text-primary-grey-plutus`} />
    </NavLink>
  );
}

NavItem.propTypes = {
  link: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
};

export default NavItem;
