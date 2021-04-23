import { useUpdateCustomReportMutation } from 'js/api/mutation/update-custom-report/use-update-custom-report.mutation';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef
} from 'react';
import { useQueryResult } from './query.provider';

/**
 * @typedef {(type: 'columns' | 'rows', index: number, sortOrder: 'ASCENDING' | 'DESCENDING') => void} ChangeOrderFn
 * @typedef {(type: 'values', index: number, summarizeFunction: 'SUM' | 'COUNTA' | 'COUNT' | 'COUNTUNIQUE' | 'AVERAGE' | 'MAX' | 'MIN' | 'MEDIAN' | 'PRODUCT' | 'STDEV' | 'STDEVP' | 'VAR' | 'VARP') => void} ChangeSummarizeFunctionFn
 * @typedef {(type: 'columns' | 'rows' | 'values' | 'filters', item: Partial<import('js/typings/custom-report-field').CustomReportField> | Partial<import('js/typings/custom-report-value').CustomReportValue>) => void} AddFieldFn
 * @typedef {(type: 'columns' | 'rows' | 'values' | 'filters', index: number) => void} RemoveFieldFn
 * @typedef {(sourceType: 'columns' | 'rows' | 'values' | 'filters', destinationType: 'columns' | 'rows' | 'values' | 'filters', sourceIndex: number, destinationIndex: number) => void} MoveFn
 * @typedef {(type: 'filters', index: number, conditionType: 'NUMBER_GREATER' | 'NUMBER_GREATER_THAN_EQ' | 'NUMBER_LESS' | 'NUMBER_LESS_THAN_EQ' | 'NUMBER_EQ' | 'NUMBER_NOT_EQ' | 'NUMBER_BETWEEN' | 'NUMBER_NOT_BETWEEN' | 'TEXT_CONTAINS' | 'TEXT_NOT_CONTAINS' | 'TEXT_STARTS_WITH' | 'TEXT_ENDS_WITH' | 'TEXT_EQ' | 'DATE_EQ' | 'DATE_BEFORE' | 'DATE_AFTER' | 'DATE_BETWEEN' | 'BLANK' | 'NOT_BLANK' | 'CUSTOM_FORMULA') => void} ChangeFilterConditionTypeFn
 * @typedef {(type: 'filters', index: number, conditionValues: {userEnteredValue: string}[]) => void} ChangeFilterConditionValuesFn
 * @typedef {(type: 'filters', index: number, visibleValues: string[]) => void} ChangeFilterVisibleValuesFn
 * @typedef {{
 *  changeOrder: ChangeOrderFn
 *  changeSummarizeFunction: ChangeSummarizeFunctionFn
 *  addField: AddFieldFn
 *  removeField: RemoveFieldFn
 *  move: MoveFn
 *  changeFilterConditionType: ChangeFilterConditionTypeFn
 *  changeFilterConditionValues: ChangeFilterConditionValuesFn
 *  changeFilterVisibleValues: ChangeFilterVisibleValuesFn
 * }} ActionsContextValue
 */

/** @type {any} */
const ACTIONS_CONTEXT_DEFAULT_VALUE = undefined;

/** @type {React.Context<ActionsContextValue>} */
const ActionsContext = createContext(ACTIONS_CONTEXT_DEFAULT_VALUE);

/**
 * @return {ActionsContextValue}
 */
export function useActions() {
  return useContext(ActionsContext);
}

export const ActionsProvider = ({ children }) => {
  const { data } = useQueryResult();
  const { mutate } = useUpdateCustomReportMutation();

  const dataRef = useRef(data);
  dataRef.current = data;
  const changeOrder = useCallback(
    /**
     * @param {'columns' | 'rows'} type
     * @param {number} index
     * @param {'ASCENDING' | 'DESCENDING'} sortOrder
     */
    (type, index, sortOrder) => {
      if (dataRef.current) {
        const data = { ...dataRef.current };
        data[type] = [
          ...data[type].slice(0, index),
          { ...data[type][index], sortOrder },
          ...data[type].slice(index + 1)
        ];
        mutate({ id: dataRef.current._id, data });
      }
    },
    [mutate]
  );

  const changeSummarizeFunction = useCallback(
    /**
     * @param {'values'} type
     * @param {number} index
     * @param {'SUM' | 'COUNTA' | 'COUNT' | 'COUNTUNIQUE' | 'AVERAGE' | 'MAX' | 'MIN' | 'MEDIAN' | 'PRODUCT' | 'STDEV' | 'STDEVP' | 'VAR' | 'VARP'} summarizeFunction
     */
    (type, index, summarizeFunction) => {
      if (dataRef.current) {
        const data = { ...dataRef.current };
        data[type] = [
          ...data[type].slice(0, index),
          { ...data[type][index], summarizeFunction },
          ...data[type].slice(index + 1)
        ];
        mutate({ id: dataRef.current._id, data });
      }
    },
    [mutate]
  );

  const addField = useCallback(
    /**
     * @param {'columns' | 'rows' | 'values' | 'filters'} type
     * @param {Partial<import('js/typings/custom-report-field').CustomReportField> | Partial<import('js/typings/custom-report-value').CustomReportValue>} item
     */
    (type, item) => {
      if (dataRef.current) {
        const data = { ...dataRef.current };
        if (type === 'columns' || type === 'rows') {
          data[type] = [
            ...data[type],
            {
              ...item,
              index: data[type].length,
              sortOrder: 'ASCENDING'
            }
          ];
        } else if (type === 'values') {
          data[type] = [
            ...data[type],
            {
              ...item,
              index: data[type].length,
              summarizeFunction: 'SUM'
            }
          ];
        } else if (type === 'filters') {
          data[type] = [
            ...data[type],
            {
              ...item,
              index: data[type].length,
              visibleValues: [],
              conditionType: null,
              conditionValues: []
            }
          ];
        }
        mutate({ id: dataRef.current._id, data });
      }
    },
    [mutate]
  );

  const removeField = useCallback(
    /**
     * @param {'columns' | 'rows' | 'values' | 'filters'} type
     * @param {number} index
     */
    (type, index) => {
      if (dataRef.current) {
        /** @type {any} */
        const data = { ...dataRef.current };
        data[type] = [
          ...data[type].slice(0, index),
          ...data[type].slice(index + 1)
        ];
        mutate({ id: dataRef.current._id, data });
      }
    },
    [mutate]
  );

  const move = useCallback(
    /**
     * @param {'columns' | 'rows' | 'values' | 'filters'} sourceType
     * @param {'columns' | 'rows' | 'values' | 'filters'} destinationType
     * @param {number} sourceIndex
     * @param {number} destinationIndex
     */
    (sourceType, destinationType, sourceIndex, destinationIndex) => {
      if (dataRef.current) {
        /** @type {any} */
        const data = { ...dataRef.current };
        /** @type {any} */
        let item = data[sourceType][sourceIndex];

        // Check if destination already has field, reject if it does
        const match = data[destinationType].find(
          i =>
            (i.customField &&
              item.customField &&
              i.customField._id === item.customField._id) ||
            (i.key && item.key && i.key === item.key)
        );
        if (match && destinationType !== sourceType) return;

        if (
          (sourceType === 'columns' ||
            sourceType === 'rows' ||
            sourceType === 'filters') &&
          destinationType === 'values'
        ) {
          // Move from columns/rows/filters to values changes shape
          delete item.sortOrder;
          delete item.conditionType;
          delete item.conditionValues;
          item = { ...item, summarizeFunction: 'SUM' };
        } else if (
          (sourceType === 'values' || sourceType === 'filters') &&
          (destinationType === 'columns' || destinationType === 'rows')
        ) {
          // Move from values/filters to columns/rows changes shape
          delete item.summarizeFunction;
          delete item.conditionType;
          delete item.conditionValues;
          item = { ...item, sortOrder: 'ASCENDING' };
        } else if (
          (sourceType === 'columns' ||
            sourceType === 'rows' ||
            sourceType === 'values') &&
          destinationType === 'filters'
        ) {
          // Move from columns/rows/values to filters changes shape
          delete item.sortOrder;
          delete item.summarizeFunction;
          item = {
            ...item,
            visibleValues: [],
            conditionType: null,
            conditionValues: []
          };
        }
        data[sourceType] = [
          ...data[sourceType].slice(0, sourceIndex),
          ...data[sourceType].slice(sourceIndex + 1)
        ];
        data[destinationType] = [
          ...data[destinationType].slice(0, destinationIndex),
          item,
          ...data[destinationType].slice(destinationIndex)
        ];
        mutate({ id: dataRef.current._id, data });
      }
    },
    [mutate]
  );

  const changeFilterConditionType = useCallback(
    /**
     * @param {'filters'} type
     * @param {number} index
     * @param {'NUMBER_GREATER' | 'NUMBER_GREATER_THAN_EQ' | 'NUMBER_LESS' | 'NUMBER_LESS_THAN_EQ' | 'NUMBER_EQ' | 'NUMBER_NOT_EQ' | 'NUMBER_BETWEEN' | 'NUMBER_NOT_BETWEEN' | 'TEXT_CONTAINS' | 'TEXT_NOT_CONTAINS' | 'TEXT_STARTS_WITH' | 'TEXT_ENDS_WITH' | 'TEXT_EQ' | 'DATE_EQ' | 'DATE_BEFORE' | 'DATE_AFTER' | 'DATE_BETWEEN' | 'BLANK' | 'NOT_BLANK' | 'CUSTOM_FORMULA' | '' | null} conditionType
     */
    (type, index, conditionType) => {
      conditionType = conditionType === '' ? null : conditionType;
      if (dataRef.current) {
        const data = { ...dataRef.current };
        let conditionValues = dataRef.current.filters[index].conditionValues;
        if (
          conditionType === 'BLANK' ||
          conditionType === 'NOT_BLANK' ||
          conditionType === null
        ) {
          conditionValues = [];
        } else if (
          conditionType === 'NUMBER_BETWEEN' ||
          conditionType === 'NUMBER_NOT_BETWEEN'
        ) {
          if (conditionValues.length === 0) {
            conditionValues = [
              { userEnteredValue: '' },
              { userEnteredValue: '' }
            ];
          } else if (conditionValues.length === 1) {
            conditionValues = [conditionValues[0], { userEnteredValue: '' }];
          }
        } else {
          if (conditionValues.length === 0) {
            conditionValues = [{ userEnteredValue: '' }];
          } else if (conditionValues.length === 2) {
            conditionValues = [conditionValues[0]];
          }
        }
        data[type] = [
          ...data[type].slice(0, index),
          { ...data[type][index], conditionType, conditionValues },
          ...data[type].slice(index + 1)
        ];
        mutate({ id: dataRef.current._id, data });
      }
    },
    [mutate]
  );

  const changeFilterConditionValues = useCallback(
    /**
     * @param {'filters'} type
     * @param {number} index
     * @param {{userEnteredValue: string}[]} conditionValues
     */
    (type, index, conditionValues) => {
      if (dataRef.current) {
        const data = { ...dataRef.current };
        data[type] = [
          ...data[type].slice(0, index),
          { ...data[type][index], conditionValues },
          ...data[type].slice(index + 1)
        ];
        mutate({ id: dataRef.current._id, data });
      }
    },
    [mutate]
  );

  const changeFilterVisibleValues = useCallback(
    /**
     * @param {'filters'} type
     * @param {number} index
     * @param {string[]} conditionValues
     */
    (type, index, visibleValues) => {
      if (dataRef.current) {
        const data = { ...dataRef.current };
        data[type] = [
          ...data[type].slice(0, index),
          { ...data[type][index], visibleValues },
          ...data[type].slice(index + 1)
        ];
        mutate({ id: dataRef.current._id, data });
      }
    },
    [mutate]
  );

  const context = useMemo(
    () => ({
      changeOrder,
      changeSummarizeFunction,
      addField,
      removeField,
      move,
      changeFilterConditionType,
      changeFilterConditionValues,
      changeFilterVisibleValues
    }),
    [
      changeOrder,
      changeSummarizeFunction,
      addField,
      removeField,
      move,
      changeFilterConditionType,
      changeFilterConditionValues,
      changeFilterVisibleValues
    ]
  );

  return (
    <ActionsContext.Provider value={context}>
      {children}
    </ActionsContext.Provider>
  );
};
