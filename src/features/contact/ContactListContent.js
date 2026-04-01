import React, {
  useState, useEffect, Fragment,
} from 'react';
import PropTypes from 'prop-types';
import { BeatLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import contactService from './ContactService';
import ConfirmationDialog from '../../common/ConfirmationDialog';

// Helper function to generate page numbers with ellipsis
const generatePageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const maxVisible = 5; // Max number of page links shown (excluding prev/next/ellipsis)

  if (totalPages <= maxVisible + 2) { // Show all pages if not many total
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    // Calculate boundaries for middle pages
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Ellipsis after first page?
    if (startPage > 2) {
      pages.push('...');
    }

    // Middle pages
    for (let i = startPage; i <= endPage; i += 1) {
      pages.push(i);
    }

    // Ellipsis before last page?
    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page
    pages.push(totalPages);
  }
  return pages;
};

// Helper to format date strings
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    // Adjust options as needed for desired format
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

// Helper to format boolean values
const formatBoolean = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return value ? 'Yes' : 'No';
};

// Define columns as a constant outside the component
const columns = [
  {
    key: 'contact_name', label: 'Name', sortable: true, apiSortKey: 'first_name',
  },
  { key: 'contact_type_name', label: 'Contact Type', sortable: true },
  { key: 'referred_by_name', label: 'Referred By', sortable: true },
  {
    key: 'dob', label: 'DOB', sortable: true, format: formatDate,
  },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'correspondence_email', label: 'Correspondence Email', sortable: true },
  { key: 'personal_address', label: 'Personal Address', sortable: false },
  { key: 'personal_city_name', label: 'Personal City', sortable: true },
  { key: 'personal_pincode', label: 'Personal Pincode', sortable: false },
  { key: 'personal_phone', label: 'Personal Phone', sortable: false },
  { key: 'personal_mobile', label: 'Personal Mobile', sortable: false },
  { key: 'org_name', label: 'Org Name', sortable: true },
  { key: 'industry', label: 'Industry', sortable: true },
  { key: 'work_address', label: 'Work Address', sortable: false },
  { key: 'work_city_name', label: 'Work City', sortable: true },
  { key: 'work_pincode', label: 'Work Pincode', sortable: false },
  { key: 'work_phone', label: 'Work Phone', sortable: false },
  { key: 'work_mobile', label: 'Work Mobile', sortable: false },
  { key: 'birth_place_city_name', label: 'Birth City', sortable: true },
  { key: 'group_head_name', label: 'Group Head Name', sortable: true },
  {
    key: 'group_head', label: 'Is Group Head', sortable: true, format: formatBoolean,
  },
  { key: 'group_head_relation', label: 'Group Head Relation', sortable: true },
  { key: 'marital_status', label: 'Marital Status', sortable: true },
  {
    key: 'anniversary_date', label: 'Anniversary', sortable: true, format: formatDate,
  },
  { key: 'gross_annual_income', label: 'Annual Income', sortable: true },
  {
    key: 'political_exposure', label: 'Political Exposure', sortable: true, format: formatBoolean,
  },
  { key: 'residence_status_name', label: 'Residence Status', sortable: true },
  { key: 'non_res_tax_id', label: 'Non-Res Tax ID', sortable: false },
  { key: 'profession_name', label: 'Profession', sortable: true },
  { key: 'loan_details', label: 'Loan Details', sortable: false },
  { key: 'risk_profile', label: 'Risk Profile', sortable: true },
  { key: 'contact_owner_name', label: 'Owner', sortable: true },
  { key: 'contact_status', label: 'Contact Status', sortable: true },
  { key: 'contact_source', label: 'Contact Source', sortable: true },
];

const ContactListContent = ({ initialData, initialError }) => {
  // Initialize state from props
  const [contacts, setContacts] = useState(initialData?.data || []);
  const [pagination, setPagination] = useState(initialData?.pagination || {
    page: 1, pageSize: 7, totalItems: 0, totalPages: 1,
  });
  const [selectedRows, setSelectedRows] = useState([]);
  // Loading state for subsequent fetches (pagination, sort)
  const [loading, setLoading] = useState(false);
  // Error state initialized from prop, updated on subsequent fetch errors
  const [error, setError] = useState(initialError || null);
  // Default sort state
  const [sortParams, setSortParams] = useState([{ column: 'first_name', order: 'asc' }]);
  // State for delete button visibility
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  // State for confirmation dialog
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  // State for delete confirmation loading
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  // Fetch data for subsequent page/sort changes
  const fetchContactsData = async (
    currentPage,
    currentSortParams,
  ) => {
    setLoading(true);
    setError(null); // Clear previous errors for new fetch
    // setSelectedRows([]); // Clearing selection here might be too early if fetch fails
    try {
      const responseData = await contactService.getContacts({
        page: currentPage,
        sortParams: currentSortParams,
      });

      setContacts(responseData.data || []); // Ensure data is always an array
      setPagination({ // Update pagination based on response
        ...responseData.pagination,
        page: parseInt(responseData.pagination.page, 10),
      });
      // Clear selected rows only after successful fetch
      setSelectedRows([]);
    } catch (err) {
      const errorMsg = err.error || err.message || 'Failed to fetch contacts.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Effect to update internal error state if the initialError prop changes
  useEffect(() => {
    setError(initialError);
    // If parent signals an error, it might imply data is invalid
    if (initialError) {
      setContacts([]);
      setPagination((prev) => ({
        ...prev, totalItems: 0, totalPages: 0, page: 1,
      }));
    }
  }, [initialError]);

  // Show delete button if any rows are selected
  useEffect(() => {
    setShowDeleteButton(selectedRows.length > 0);
  }, [selectedRows]);

  const handleContactClick = (contactId) => {
    navigate(`/contacts/${contactId}`);
  };

  const handleDeleteContacts = async () => {
    setIsDeleting(true);
    const selectedContactObjects = selectedRows
      .map((id) => contacts.find((c) => c.contact_id === id))
      .filter(Boolean);

    try {
      if (selectedRows.length === 1) {
        const contactToDelete = selectedContactObjects[0];
        const contactName = contactToDelete ? `${contactToDelete.first_name || ''} ${contactToDelete.last_name || ''}`.trim() : 'Contact';
        await contactService.deleteContact(selectedRows[0]);
        toast.success(`${contactName} deleted successfully!`);
      } else {
        const result = await contactService.batchDeleteContacts(selectedRows);
        if (result.status === 'all_successful') {
          toast.success(`All ${selectedRows.length} selected contacts deleted successfully!`);
        } else if (result.status === 'partial_success' && result.details) {
          const { success, failed } = result.details;
          const successfulNames = success
            .map((id) => {
              const contact = selectedContactObjects.find((c) => c.contact_id === id);
              return contact ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim() : id;
            })
            .join(', ');
          const failedItems = failed
            .map((item) => {
              const contact = selectedContactObjects.find((c) => c.contact_id === item.id);
              const name = contact ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim() : item.id;
              return `${name} (${item.reason || 'Failed'})`;
            })
            .join('; ');

          toast.warn(
            <div>
              <p className="font-semibold">Batch Deletion Processed</p>
              {success && success.length > 0 && (
              <p>
                Successfully deleted:
                {successfulNames || 'None'}
              </p>
              )}
              {failed && failed.length > 0 && (
              <p>
                Failed to delete:
                {failedItems || 'None'}
              </p>
              )}
            </div>,
            { style: { backgroundColor: '#F4BE5E', color: '#1C1D21' } }, // secondary-yellow-plutus, primary-dark-plutus
          );
        } else {
          toast.error('An unexpected issue occurred during batch deletion. Please check the contact list.', { style: { backgroundColor: '#FF808B', color: '#FFFFFF' } });
        }
      }
      fetchContactsData(pagination.page, sortParams);
      setSelectedRows([]);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to delete contacts:', err);
      }
      let errorMessage = 'An error occurred during contact deletion.';
      if (err.response && err.response.data) {
        if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          errorMessage = err.response.data.errors.map((e) => e.msg || 'Validation error').join(', ');
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage, { style: { backgroundColor: '#FF808B', color: '#FFFFFF' } });
    } finally {
      setIsDeleting(false);
      setShowConfirmationDialog(false);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prevSelected) => (prevSelected.includes(id)
      ? prevSelected.filter((rowId) => rowId !== id)
      : [...prevSelected, id]));
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(contacts.map((contact) => contact.contact_id));
    } else {
      setSelectedRows([]);
    }
  };

  const handlePageChange = (newPage) => {
    const isValidPage = newPage >= 1 && newPage <= pagination.totalPages;
    if (!loading && isValidPage && newPage !== pagination.page) {
      fetchContactsData(newPage, sortParams);
    }
  };

  const handleSort = (columnKey) => {
    if (loading) return;

    const colDefinition = columns.find((c) => c.key === columnKey || c.apiSortKey === columnKey);
    const sortField = colDefinition?.apiSortKey || colDefinition?.key || columnKey;

    let newOrder = 'asc';
    const currentSort = sortParams[0];
    if (currentSort && currentSort.column === sortField) {
      newOrder = currentSort.order === 'asc' ? 'desc' : 'asc';
    }
    const newSortParams = [{ column: sortField, order: newOrder }];

    setSortParams(newSortParams);
    const newPage = 1;
    fetchContactsData(newPage, newSortParams);
  };

  const getSortIcon = (columnKey) => {
    const colDefinition = columns.find((c) => c.key === columnKey || c.apiSortKey === columnKey);
    const sortField = colDefinition?.apiSortKey || colDefinition?.key || columnKey;
    const currentSort = sortParams.find((s) => s.column === sortField);
    if (currentSort) {
      return currentSort.order === 'asc' ? 'las la-sort-up' : 'las la-sort-down';
    }
    return 'las la-sort';
  };

  const isSelected = (id) => selectedRows.includes(id);
  const isAllSelected = Array.isArray(contacts)
        && contacts.length > 0
        && selectedRows.length === contacts.length;

  const cellClasses = 'px-3 py-6 text-sm whitespace-nowrap text-primary-dark-plutus';
  const checkboxClasses = 'rounded form-checkbox text-primary-blue-plutus border-outline-grey-plutus focus:ring-primary-blue-plutus focus:ring-opacity-50';
  const headerBaseClasses = 'px-3 py-3 text-xs font-medium tracking-wider text-left sticky top-0 z-10 bg-background-lightgrey-plutus bg-opacity-95';
  const headerTextClasses = 'uppercase text-primary-grey-plutus';
  const headerSortClasses = `${headerBaseClasses} ${headerTextClasses} cursor-pointer hover:bg-gray-200`;
  const headerNoSortClasses = `${headerBaseClasses} ${headerTextClasses}`;
  const checkboxHeaderClasses = `${headerBaseClasses} py-3 pl-4 pr-3 text-left w-12`;

  const renderTableBody = () => {
    if (!loading && !error && contacts.length === 0 && pagination.totalItems === 0) {
      return (
        <tr>
          <td colSpan={columns.length + 1} className="h-64 text-center text-primary-grey-plutus">
            No contacts found.
          </td>
        </tr>
      );
    }

    if (Array.isArray(contacts) && contacts.length > 0) {
      return contacts.map((contact) => {
        const fullName = [contact.first_name, contact.middle_name, contact.last_name]
          .filter(Boolean).join(' ');
        const rowClasses = `${isSelected(contact.contact_id) ? 'bg-skyblue-plutus' : ''} hover:bg-gray-50`;
        return (
          <tr key={contact.contact_id} className={rowClasses}>
            <td className="w-12 py-6 pl-4 pr-3 whitespace-nowrap">
              <input
                type="checkbox"
                className={checkboxClasses}
                checked={isSelected(contact.contact_id)}
                onChange={() => handleSelectRow(contact.contact_id)}
              />
            </td>
            {columns.map((col) => {
              let cellValue = col.key === 'contact_name' ? fullName : contact[col.key];
              if (col.format) {
                cellValue = col.format(cellValue);
              }
              cellValue = (cellValue === null || cellValue === undefined) ? 'N/A' : cellValue;

              // Make contact name clickable
              if (col.key === 'contact_name') {
                return (
                  <td key={col.key} className={cellClasses}>
                    <button
                      type="button"
                      onClick={() => handleContactClick(contact.contact_id)}
                      className="font-medium rounded hover:text-primary-blue-plutus hover:underline focus:outline-none focus:ring-2 focus:ring-primary-blue-plutus focus:ring-offset-1"
                    >
                      {cellValue}
                    </button>
                  </td>
                );
              }

              return (
                <td key={col.key} className={cellClasses}>
                  {cellValue}
                </td>
              );
            })}
          </tr>
        );
      });
    }
    return null;
  };

  const pageNumbers = generatePageNumbers(pagination.page, pagination.totalPages);
  const baseButtonClasses = 'px-3 py-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue-plutus disabled:opacity-50 disabled:cursor-not-allowed';
  const prevNextButtonClasses = `${baseButtonClasses} bg-gray-200 text-gray-700 enabled:hover:bg-gray-300`;
  const pageNumberButtonClasses = `${baseButtonClasses} bg-white text-gray-700 hover:bg-gray-100 border border-gray-300`;
  const activePageNumberClasses = `${baseButtonClasses} bg-primary-blue-plutus text-white border border-primary-blue-plutus`;
  const ellipsisClasses = 'px-1 py-1 text-sm text-gray-500';

  return (
    <div className="flex flex-col w-full h-full px-6 pt-2 pb-6 bg-background-lightgrey-plutus">
      <div className="relative flex flex-col flex-grow overflow-hidden bg-white rounded-lg shadow">
        <div className="flex justify-end p-4 bg-white border-b rounded-t-lg border-outline-grey-plutus">
          {showDeleteButton && (
            <button
              type="button"
              className="flex items-center px-3 py-1 mr-2 text-xs font-semibold rounded bg-secondary-pink-plutus text-background-lightgrey-plutus hover:bg-opacity-10 hover:text-secondary-pink-plutus focus:outline-none focus:ring-1 focus:ring-secondary-pink-plutus"
              onClick={() => setShowConfirmationDialog(true)}
            >
              <i className="text-base las la-trash-alt" />
            </button>
          )}
          <button
            type="button"
            title="Coming Soon!"
            className="flex items-center px-3 py-2 text-xs font-semibold border rounded cursor-not-allowed text-primary-grey-plutus border-outline-grey-plutus bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-blue-plutus"
          >
            <i className="mr-1 las la-filter" />
            FILTERS
            <i className="ml-1 las la-angle-down" />
          </button>
        </div>

        <div className="relative flex-grow overflow-auto">
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-75">
              <BeatLoader size={15} color="#5E81F4" loading={loading} />
            </div>
          )}
          {error && !loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center text-red-600 bg-white bg-opacity-90">
              <p className="mb-2 font-semibold">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <table className="min-w-full border-collapse divide-y divide-outline-grey-plutus">
            <thead>
              <tr>
                <th scope="col" className={checkboxHeaderClasses}>
                  <input
                    type="checkbox"
                    className={checkboxClasses}
                    disabled={loading || contacts.length === 0}
                    checked={!loading && isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                {columns.map((col) => {
                  const sortKey = col.apiSortKey || col.key;
                  const thClasses = col.sortable ? headerSortClasses : headerNoSortClasses;
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      className={thClasses}
                      onClick={col.sortable ? () => handleSort(sortKey) : undefined}
                      style={{ minWidth: col.label.length > 15 ? '180px' : '120px' }}
                    >
                      <span className="inline-flex items-center whitespace-nowrap">
                        {col.label}
                        {col.sortable && <i className={`ml-1 ${getSortIcon(sortKey)}`} />}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-outline-grey-plutus">
              {!loading && !error && renderTableBody()}
            </tbody>
          </table>
        </div>
      </div>

      {!error && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center pt-4 space-x-1">
          <button
            type="button"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={loading || pagination.page <= 1}
            className={prevNextButtonClasses}
          >
            &lt; PREV
          </button>
          {pageNumbers.map((page, index) => (
            <Fragment key={page === '...' ? `ellipsis-${index}` : page}>
              {page === '...' ? (
                <span className={ellipsisClasses}>...</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handlePageChange(page)}
                  disabled={loading || pagination.page === page}
                  className={pagination.page === page
                    ? activePageNumberClasses
                    : pageNumberButtonClasses}
                >
                  {page}
                </button>
              )}
            </Fragment>
          ))}
          <button
            type="button"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={loading || pagination.page >= pagination.totalPages}
            className={prevNextButtonClasses}
          >
            NEXT &gt;
          </button>
        </div>
      )}

      {showConfirmationDialog && (
        <ConfirmationDialog
          title="Confirm Deletion"
          message={`Are you sure you want to delete ${selectedRows.length} contact(s)? This action cannot be undone.`}
          onConfirm={handleDeleteContacts}
          onCancel={() => setShowConfirmationDialog(false)}
          isLoading={isDeleting}
          confirmButtonClass="bg-secondary-pink-plutus text-white hover:bg-red-700 focus:ring-secondary-pink-plutus"
          confirmButtonText="Delete"
        />
      )}
    </div>
  );
};

ContactListContent.propTypes = {
  initialData: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.shape({
      page: PropTypes.number,
      pageSize: PropTypes.number,
      totalItems: PropTypes.number,
      totalPages: PropTypes.number,
    }),
  }),
  initialError: PropTypes.string,
};

ContactListContent.defaultProps = {
  initialData: null,
  initialError: null,
};

export default ContactListContent;
