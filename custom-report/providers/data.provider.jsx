import { useCustomReportDataQuery } from 'js/api/queries/custom-report-data/use-custom-report.query';
import React, { createContext, useContext } from 'react';
import { useParams } from '../hooks/use-params.hook';
import { useFilters } from './filters.provider';
import { uniq } from 'lodash';

/**
 * @type {React.Context<any>}
 */
export const DataQueryResultContext = createContext(undefined);

/**
 * @returns {import('react-query').UseQueryResult<import('js/api/queries/custom-report-data/typings/custom-report-data-response').CustomReportDataResponse>}
 */
export function useDataQueryResult() {
  return useContext(DataQueryResultContext);
}

/**
 * @param {string | undefined | null} field
 * @return {undefined | unknown[]}
 */
export function useValuesForField(field = undefined) {
  const { data } = useDataQueryResult();
  if (data && field) {
    const index = data.headers.findIndex(f => f === field);
    if (index !== -1) {
      const values = uniq(
        data.rows
          .map(row => row[index])
          .filter(a => !!a)
          .map(a => `${a}`.trim())
      );
      values.sort();
      return values;
    }
  }
  return undefined;
}

/** @type {React.FunctionComponent} */
export const DataProvider = ({ children }) => {
  const { id } = useParams();
  const filters = useFilters();
  const result = useCustomReportDataQuery(id, {
    startDate: filters.startDate,
    endDate: filters.endDate
  });

  return ((
    <DataQueryResultContext.Provider value={result}>
      {children}
    </DataQueryResultContext.Provider>
  ));
};
