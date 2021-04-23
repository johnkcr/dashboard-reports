import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
  createContext,
  useContext
} from 'react';
import URLSearchParams from '@ungap/url-search-params';
import { subMonths, startOfDay, endOfDay, format } from 'date-fns';
import { useServiceTypes } from 'js/global/hooks/use-service-types.hook';

const DATE_FILTER_REGEXP = /^(\d{4,4})\-(\d{2,2})\-(\d{2,2})$/;

/**
 * @param {string | null | undefined} param
 * @return {Date | undefined}
 */
function parseDate(param) {
  const match = param ? param.match(DATE_FILTER_REGEXP) : undefined;
  let date;
  if (match) {
    date = new Date(
      parseInt(match[1], 10),
      parseInt(match[2], 10) - 1,
      parseInt(match[3], 10)
    );
  }
  return date;
}

/**
 * @param {string | null | undefined} param
 * @param {import('js/typings/service-type').ServiceType[] | null | undefined} serviceTypes
 * @return {import('js/typings/service-type').ServiceType[] | undefined}
 */
function mapServiceTypes(param, serviceTypes) {
  /** @type {string[]} */
  let serviceTypesIds = [];
  try {
    if (param) serviceTypesIds = param.split(',');
  } catch (err) {}
  if (serviceTypesIds.length) {
    if (serviceTypes && serviceTypes.length) {
      /** @type {any} */
      const matches = serviceTypesIds
        .map(id => serviceTypes.find(s => s._id === id))
        .filter(s => !!s);
      return matches && matches.length ? matches : undefined;
    }
  }
  return undefined;
}

/** @type {any} */
const CONTEXT_DEFAULT_VALUE = undefined;

/** @type {React.Context<import('../typings/filters').Filters>} */
const FiltersContext = createContext(CONTEXT_DEFAULT_VALUE);
/** @type {React.Context<React.Dispatch<React.SetStateAction<import('../typings/filters').Filters>>>} */
const SetFiltersContext = createContext(CONTEXT_DEFAULT_VALUE);

/** @return {import('../typings/filters').Filters} */
export function useFilters() {
  return useContext(FiltersContext);
}

/** @return {React.Dispatch<React.SetStateAction<import('../typings/filters').Filters>>} */
export function useSetFilters() {
  return useContext(SetFiltersContext);
}

/** @type {React.FunctionComponent} */
export const FiltersProvider = ({ children }) => {
  const serviceTypes = useServiceTypes();
  const search = window.location.search;
  const params = useMemo(() => new URLSearchParams(search), [search]);
  /** @type {[import('../typings/filters').Filters, React.Dispatch<React.SetStateAction<import('../typings/filters').Filters>>]} */
  const [filters, setFilters] = useState(
    /** @return {import('../typings/filters').Filters} */
    () => {
      let startDate = parseDate(params.get('startDate'));
      if (startDate) {
        startDate = startOfDay(startDate);
      } else {
        startDate = startOfDay(subMonths(new Date(), 1));
      }
      let endDate = parseDate(params.get('endDate'));
      if (endDate) {
        endDate = endOfDay(endDate);
      } else {
        endDate = endOfDay(new Date());
      }
      return {
        startDate,
        endDate,
        serviceTypes:
          serviceTypes && serviceTypes.length
            ? mapServiceTypes(params.get('serviceTypes'), serviceTypes)
            : undefined
      };
    }
  );

  const prevServiceTypes = useRef(serviceTypes);
  useEffect(() => {
    if (
      serviceTypes &&
      (!prevServiceTypes.current ||
        serviceTypes.length !== prevServiceTypes.current.length)
    ) {
      prevServiceTypes.current = serviceTypes;
      setFilters(filters => ({
        ...filters,
        serviceTypes:
          filters.serviceTypes !== undefined
            ? filters.serviceTypes
            : mapServiceTypes(params.get('serviceTypes'), serviceTypes)
      }));
    }
  }, [serviceTypes, params]);

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  /** @type {React.Dispatch<React.SetStateAction<import('../typings/filters').Filters>>} */
  const setFiltersCallback = useCallback(prevState => {
    let nextState = { ...filtersRef.current };
    if (typeof prevState === 'function') {
      nextState = prevState(nextState);
    } else {
      nextState = { ...prevState };
    }

    const params = new URLSearchParams({
      startDate: format(nextState.startDate, 'yyyy-MM-dd'),
      endDate: format(nextState.endDate, 'yyyy-MM-dd')
    });
    if (nextState.serviceTypes) {
      params.set(
        'serviceTypes',
        nextState.serviceTypes.map(s => s._id).join(',')
      );
    }
    window.history.replaceState(
      undefined,
      '',
      `/?${params.toString()}${window.location.hash}`
    );
    setFilters(nextState);
  }, []);

  return ((
    <SetFiltersContext.Provider value={setFiltersCallback}>
      <FiltersContext.Provider value={filters}>
        {children}
      </FiltersContext.Provider>
    </SetFiltersContext.Provider>
  ));
};
