import { useCustomReportsFieldsQuery } from 'js/api/queries/custom-reports-fields/use-custom-reports-fields.query';
import React, { createContext, useContext } from 'react';

/** @type {any} */
const DEFAULT_VALUE = undefined;

/** @type {React.Context<import('react-query').UseQueryResult<import('js/api/queries/custom-reports-fields/typings/custom-reports-fields-response').CustomReportsFieldsResponse> | undefined>} */
export const FieldsQueryResultContext = createContext(DEFAULT_VALUE);

/** @returns {import('react-query').UseQueryResult<import('js/api/queries/custom-reports-fields/typings/custom-reports-fields-response').CustomReportsFieldsResponse>} */
export function useFieldsQueryResult() {
  /** @type {any} */
  const context = useContext(FieldsQueryResultContext);
  return context;
}

/** @returns {import('js/api/queries/custom-reports-fields/typings/custom-reports-fields-response').CustomReportsFieldsResponse} */
export function useFields() {
  /** @type {any} */
  const context = useContext(FieldsQueryResultContext);
  return context.data ? context.data : [];
}

/** @type {React.FunctionComponent} */
export const FieldsProvider = ({ children }) => {
  const result = useCustomReportsFieldsQuery();

  return ((
    <FieldsQueryResultContext.Provider value={result}>
      {children}
    </FieldsQueryResultContext.Provider>
  ));
};
