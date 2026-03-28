import React from 'react';
import PropTypes from 'prop-types';

/**
 * SidebarNavItem Component
 *
 * Purpose:
 * - Renders a navigational item for content sidebars (like Settings).
 * - Mimics the 'active' styling of the main NavItem (background + colored right border).
 * - Supports disabled state and description text.
 */
const SidebarNavItem = ({
  label, description, iconClass, onClick, isActive, disabled,
}) => {
  // Base styling for the container
  const baseClass = 'flex items-center p-3 mb-2 transition-colors duration-150 rounded-sm select-none';

  // Active state: Skyblue background and blue right border
  const activeClass = 'bg-skyblue-plutus';

  // Inactive state: Hover gray effect
  const inactiveClass = 'hover:bg-gray-50 text-primary-grey-plutus';

  // Disabled state
  const disabledClass = 'opacity-50 cursor-not-allowed';

  let containerClass = baseClass;

  if (disabled) {
    containerClass = `${baseClass} ${disabledClass} text-primary-grey-plutus`;
  } else if (isActive) {
    containerClass = `${baseClass} cursor-pointer ${activeClass}`;
  } else {
    containerClass = `${baseClass} cursor-pointer ${inactiveClass}`;
  }

  return (
    <div
      onClick={disabled ? undefined : onClick}
      onKeyDown={(event) => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) onClick();
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      className={containerClass}
    >
      {iconClass && (
        <i
          className={`${iconClass} px-3 text-2xl ${
            isActive ? 'text-primary-blue-plutus' : 'inherit'
          }`}
        />
      )}
      <div className="flex flex-col">
        <span className={`font-semibold ${isActive ? 'text-primary-blue-plutus' : 'inherit'}`}>
          {label}
        </span>
        {description && (
          <p className="text-xs opacity-80">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

SidebarNavItem.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  iconClass: PropTypes.string,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  disabled: PropTypes.bool,
};

SidebarNavItem.defaultProps = {
  description: null,
  iconClass: null,
  onClick: () => {},
  isActive: false,
  disabled: false,
};

export default SidebarNavItem;
