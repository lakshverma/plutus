import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { BeatLoader } from 'react-spinners';
import Button from './form/Button';

const ConfirmationDialog = ({
  title,
  message,
  children,
  onConfirm,
  onCancel,
  confirmButtonText,
  cancelButtonText,
  confirmButtonClass,
  confirmButtonType,
  confirmButtonFormId,
  isLoading,
  disabled,
  widthClass,
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel, isLoading]);

  const isActionDisabled = isLoading || disabled;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60"
      aria-labelledby="confirmation-dialog-title"
      role="dialog"
      aria-modal="true"
    >
      <div className={`w-full ${widthClass} p-6 bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto`}>
        <h2 id="confirmation-dialog-title" className="mb-2 text-lg font-bold text-primary-dark-plutus">{title}</h2>
        {message && <p className="mb-6 text-sm text-primary-grey-plutus">{message}</p>}
        {children && <div className="mb-6">{children}</div>}
        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <BeatLoader color="#5E81F4" size={10} />
          </div>
        ) : (
          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              buttonText={cancelButtonText}
              onClick={onCancel}
              disabled={isActionDisabled}
              className="!bg-gray-200 !text-gray-800 hover:!bg-gray-300"
              colorVariant="secondary"
            />
            <Button
              type={confirmButtonType}
              // Note: The Button component must support the 'form' attribute or spread
              // rest props for this to work
              // If Button.js doesn't support 'form', this prop might be ignored,
              // but it's the correct HTML5 way.
              form={confirmButtonFormId}
              onClick={onConfirm}
              className={`${confirmButtonClass} min-w-[100px]`}
              buttonText={confirmButtonText}
              disabled={isActionDisabled}
              colorVariant="primary"
            />
          </div>
        )}
      </div>
    </div>
  );
};

ConfirmationDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  children: PropTypes.node,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  confirmButtonClass: PropTypes.string,
  confirmButtonType: PropTypes.string,
  confirmButtonFormId: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  widthClass: PropTypes.string,
};

ConfirmationDialog.defaultProps = {
  message: '',
  children: null,
  confirmButtonText: 'Confirm',
  cancelButtonText: 'Cancel',
  confirmButtonClass: 'bg-primary-blue-plutus text-white hover:bg-blue-700',
  confirmButtonType: 'button',
  confirmButtonFormId: undefined,
  isLoading: false,
  disabled: false,
  widthClass: 'max-w-md',
};

export default ConfirmationDialog;
