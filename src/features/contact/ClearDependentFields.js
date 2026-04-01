// ClearDependentFields.js
import { useFormikContext } from 'formik';
import { useEffect, useRef } from 'react';

const ClearDependentFields = () => {
  const { values, setFieldValue } = useFormikContext();
  // Use a ref to track previous values so we clear the field only when a change occurs.
  const prevValues = useRef({
    maritalStatus: values.maritalStatus,
    groupHead: values.groupHead,
  });

  useEffect(() => {
    // If maritalStatus changes to something other than 'Married' and a date exists, clear it.
    if (values.maritalStatus !== 'Married' && values.anniversaryDate) {
      setFieldValue('anniversaryDate', null);
    }

    // If groupHead has changed from its previous value and a group head name exists, clear it.
    if (prevValues.current.groupHead !== values.groupHead && values.groupHeadName) {
      setFieldValue('groupHeadName', '');
    }

    // Update our ref with the latest values.
    prevValues.current = {
      maritalStatus: values.maritalStatus,
      groupHead: values.groupHead,
    };
  }, [
    values.maritalStatus,
    values.anniversaryDate,
    values.groupHead,
    values.groupHeadName,
    setFieldValue,
  ]);

  return null;
};

export default ClearDependentFields;
