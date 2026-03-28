import React from 'react';
import PropTypes from 'prop-types';
import SideBar from './SideBar';
import ContentHeader from './ContentHeader';
import ContentBody from './ContentBody';

const Content = ({
  bodyContentElement, headerText, headerButtons, sideBarContentElement, bodyBgClass,
}) => {
  if (sideBarContentElement) {
    return (
      <div className="grid h-screen grid-cols-12 grid-rows-[auto_1fr]">
        <SideBar sideBarContentElement={sideBarContentElement} />
        <ContentHeader
          headerText={headerText}
          headerButtons={headerButtons}
        />
        <ContentBody
          bodyContentElement={bodyContentElement}
          bodyBgClass={bodyBgClass}
        />
      </div>
    );
  }

  return (
    <div className="grid h-screen grid-cols-12 grid-rows-[auto_1fr]">
      <ContentHeader
        headerText={headerText}
        headerButtons={headerButtons}
        fullSize
      />
      <ContentBody
        bodyContentElement={bodyContentElement}
        fullSize
      />
    </div>
  );
};

Content.propTypes = {
  sideBarContentElement: PropTypes.element,
  bodyContentElement: PropTypes.element.isRequired,
  bodyBgClass: PropTypes.string,
  headerText: PropTypes.string.isRequired,
  headerButtons: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Content.defaultProps = {
  sideBarContentElement: null,
  bodyBgClass: 'bg-white',
};

export default Content;
