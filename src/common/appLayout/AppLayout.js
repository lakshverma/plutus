import React from 'react';
import PropTypes from 'prop-types';

import SideNav from './SideNav';
import Content from './Content';

// Needed props:
// 1. Content element that puts stuff inside the content body
// 2. Header text in Content Header
// 3. button classes for square buttons in Content Header, number of square buttons
// 4. Optional Sidebar element that puts stuff inside the sidebar (if needed)

const AppLayout = ({
  bodyContentElement, headerText, headerButtons, sideBar,
}) => (
  <div className="grid h-screen grid-cols-custom-sidenav-layout">
    <SideNav />
    <Content
      bodyContentElement={bodyContentElement}
      headerText={headerText}
      headerButtons={headerButtons}
      sideBar={sideBar}
    />
  </div>
);

AppLayout.propTypes = {
  bodyContentElement: PropTypes.element.isRequired,
  headerText: PropTypes.string.isRequired,
  headerButtons: PropTypes.arrayOf(PropTypes.object).isRequired,
  sideBar: PropTypes.bool,
};

AppLayout.defaultProps = {
  sideBar: false,
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
