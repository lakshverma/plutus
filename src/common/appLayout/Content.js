import React from 'react';
import PropTypes from 'prop-types';

import ContentBody from './ContentBody';
import ContentHeader from './ContentHeader';
import SideBar from './SideBar';

const Content = ({
  bodyContentElement, headerText, headerButtons, sideBar,
}) => {
  if (sideBar) {
    return (
      <div className="grid grid-cols-12 grid-rows-12">
        <SideBar />
        <ContentHeader headerText={headerText} headerButtons={headerButtons} />
        <ContentBody bodyContentElement={bodyContentElement} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 grid-rows-[fit-content(10%) repeat(11, minmax(0, 1fr)]">
      <ContentHeader headerText={headerText} headerButtons={headerButtons} fullSize />
      <ContentBody bodyContentElement={bodyContentElement} fullSize />
    </div>
  );
};

Content.propTypes = {
  bodyContentElement: PropTypes.element.isRequired,
  headerText: PropTypes.string.isRequired,
  headerButtons: PropTypes.arrayOf(PropTypes.object).isRequired,
  sideBar: PropTypes.bool,
};

Content.defaultProps = {
  sideBar: false,
};

export default Content;
