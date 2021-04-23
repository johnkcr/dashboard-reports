import { useCustomReportQuery } from 'js/api/queries/custom-report/use-custom-report.query';
import React, { createContext, useContext } from 'react';

/** @type {any} */
const QUERY_RESULT_CONTEXT_DEFAULT_VALUE = undefined;

/**
 * @type {React.Context<
 *  import('react-query').UseQueryResult<import('js/api/queries/custom-report/typings/custom-report-response').CustomReportResponse>
 *  | undefined
 * >}
 */
export const QueryResultContext = createContext(
  QUERY_RESULT_CONTEXT_DEFAULT_VALUE
);

/**
 * @returns {import('react-query').UseQueryResult<import('js/api/queries/custom-report/typings/custom-report-response').CustomReportResponse>}
 */
export function useQueryResult() {
  /** @type {any} */
  const context = useContext(QueryResultContext);
  return context;
}

/** @type {React.FunctionComponent<{ id: string }>} */
export const QueryProvider = ({ children, id }) => {
  const result = useCustomReportQuery(id);

  return ((
    <QueryResultContext.Provider value={result}>
      {children}
    </QueryResultContext.Provider>
  ));
};
