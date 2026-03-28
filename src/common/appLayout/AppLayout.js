import React from 'react';
import PropTypes from 'prop-types';

import SideNav from './SideNav';
import Content from './Content';

// Needed props:
// 1. Content element that puts stuff inside the content body
// 2. Header text in Content Header
// 3. button classes for square buttons in Content Header, number of square buttons
// 4. Optional Sidebar element that puts stuff inside the sidebar (if needed)

// To add buttons to the header, add an object with icon class and action, as an array
// element. The search button appears by default. Other buttons appear in the order of their
// position inside the array.
const AppLayout = ({
  bodyContentElement, bodyBgClass, headerText, headerButtons, sideBarContentElement,
}) => (
  <div className="grid h-screen grid-cols-custom-sidenav-layout">
    <SideNav />
    <Content
      bodyContentElement={bodyContentElement}
      bodyBgClass={bodyBgClass}
      headerText={headerText}
      headerButtons={headerButtons}
      sideBarContentElement={sideBarContentElement}
    />
  </div>
);

AppLayout.propTypes = {
  bodyContentElement: PropTypes.element.isRequired,
  bodyBgClass: PropTypes.string,
  headerText: PropTypes.string.isRequired,
  headerButtons: PropTypes.arrayOf(PropTypes.object).isRequired,
  sideBarContentElement: PropTypes.element,
};

AppLayout.defaultProps = {
  sideBarContentElement: null,
  bodyBgClass: 'bg-white',
};

export default AppLayout;

// All the components
// 1. AppLayout
// 2. SideNav
// - SideNavHeader
// - SideNavMenu
//     - SideNavItem
// - SideNavFooter
// 3. Content
// - ContentHeader
//     - ContentHeaderText
//     - ContentSearch
//     - ContentAdd
// - ContentBody
