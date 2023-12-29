/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useDebounce from '../../common/useDebounce';
import { clearResults, setQuery, setResults } from './searchSlice';
import searchService from './searchService';
import SearchResultItem from './SearchResultItem';
import { ReactComponent as NoResultsFound } from './NoResultsFound.svg';

const SearchDialog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchValue = useSelector((state) => state.search.query);
  const searchResultsState = useSelector((state) => state.search.results);
  const debouncedValue = useDebounce(searchValue, 1000);

  useEffect(() => {
    async function fetchResults() {
      try {
        const searchResults = await searchService.search(debouncedValue);
        dispatch(setResults({ data: searchResults.data, status: searchResults.status }));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/');
          toast.error('Your session has expired. Please login again.');
        } else {
          navigate('/');
          toast.error('Your session has expired. Please login again.');
        }
      }
    }
    if (debouncedValue.trim().length >= 3) fetchResults();
    if (debouncedValue.trim().length < 3) dispatch(clearResults());
  }, [debouncedValue, dispatch, navigate]);

  const performSearch = async ({ target }) => {
    dispatch(setQuery(target.value));
  };
  // 1. If the search value and search result states are empty, render only the search bar
  // 2. If search value exists and search results are empty, render search bar with results dialog
  // and say no results found
  // 3. If both the value and results exist, render search bar with results

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <span className="p-[0.625rem] rounded-lg bg-outline-grey-plutus hover:bg-primary-blue-plutus hover:text-white my-3">
          <i className="las la-search" />
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-primary-dark-plutus/30" />
        {
          // When there are search results
          ((searchResultsState.status === 200 && searchResultsState.data !== '' && Array.isArray(searchResultsState.data) && searchResultsState.data.length !== 0)) && (
          <Dialog.Content className="fixed flex w-7/12 -translate-x-1/2 bg-white shadow h-1/2 rounded-xl left-1/2 top-32">
            <Dialog.Title className="flex flex-col w-full rounded-xl">
              <div className="p-3 text-sm border-b-2 sm:text-lg md:text-xl lg:text-3xl text-primary-grey-plutus">
                <i className="-rotate-90 las la-search" />
                <input value={searchValue} onChange={performSearch} className="w-11/12 ml-2 focus:outline-white caret-primary-blue-plutus" placeholder="Type to search a contact, activity or task" />
              </div>
              <div className="overflow-y-scroll">
                {searchResultsState.data.map((result) => (
                  <SearchResultItem
                    type={result.type}
                    title={result.result_title}
                    description={result.result_desc}
                    key={searchResultsState.data.indexOf(result)}
                  />
                )) }
              </div>
            </Dialog.Title>
            <Dialog.Description />
            <Dialog.Close />
          </Dialog.Content>
          )
        }
        {
          // When there are no search results
          (searchResultsState.status === 200 && Array.isArray(searchResultsState.data)
          && searchResultsState.data.length === 0) && (
          <Dialog.Content className="fixed w-7/12 h-20 p-3 -translate-x-1/2 bg-white shadow sm md:h-24 lg:h-80 rounded-xl left-1/2 top-32">
            <Dialog.Title className="text-base md:text-xl lg:text-3xl text-primary-grey-plutus">
              <i className="-rotate-90 las la-search" />
              <input value={searchValue} onChange={performSearch} className="w-11/12 sm:ml-2 focus:outline-white caret-primary-blue-plutus" placeholder="Type to search a contact, activity or task" />
              <div className="hidden lg:block lg:w-48 lg:h-48 lg:my-0 lg:mx-auto">
                <NoResultsFound />
              </div>
              <div className="text-sm text-center md:text-base lg:text-lg sm:my-1 md:my-2 lg:my-4 text-primary-grey-plutus">We could not find any results.</div>
            </Dialog.Title>
            <Dialog.Description />
            <Dialog.Close />
          </Dialog.Content>
          )
        }
        {
          // When the search hasn't been made yet/Search state is empty.
          // Need to add a case when status code is not 200
          !searchResultsState && (
          <Dialog.Content className="fixed w-7/12 h-12 p-3 -translate-x-1/2 bg-white shadow sm md:h-14 lg:h-16 rounded-xl left-1/2 top-32">
            <Dialog.Title className="text-sm sm:text-base md:text-xl lg:text-3xl text-primary-grey-plutus">
              <i className="-rotate-90 las la-search" />
              <input value={searchValue} onChange={performSearch} className="w-11/12 ml-2 focus:outline-white caret-primary-blue-plutus" placeholder="Type to search a contact, activity or task" />
            </Dialog.Title>
            <Dialog.Description />
            <Dialog.Close />
          </Dialog.Content>
          )
        }
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SearchDialog;
