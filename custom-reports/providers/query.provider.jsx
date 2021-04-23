import { useCustomReportsQuery } from 'js/api/queries/custom-reports/use-custom-reports.query';
import React, { createContext, useContext } from 'react';

/** @type {any} */
const QUERY_RESULT_CONTEXT_DEFAULT_VALUE = undefined;

/**
 * @type {React.Context<
 *  import('react-query').UseQueryResult<import('js/api/queries/custom-reports/typings/custom-reports-response').CustomReportsResponse>
 *  | undefined
 * >}
 */
export const QueryResultContext = createContext(
  QUERY_RESULT_CONTEXT_DEFAULT_VALUE
);

/**
 * @returns {import('react-query').UseQueryResult<import('js/api/queries/custom-reports/typings/custom-reports-response').CustomReportsResponse>}
 */
export function useQueryResult() {
  /** @type {any} */
  const context = useContext(QueryResultContext);
  return context;
}

/** @type {React.FunctionComponent} */
export const QueryProvider = ({ children }) => {
  const result = useCustomReportsQuery();

  return ((
    <QueryResultContext.Provider value={result}>
      {children}
    </QueryResultContext.Provider>
  ));
};
