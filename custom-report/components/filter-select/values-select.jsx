import React, { useCallback, useRef } from 'react';
import { MultiSelect } from '../multi-select';
import { makeStyles } from '@material-ui/core/styles';
import { useValuesForField } from '../../providers/data.provider';
import { useActions } from '../../providers/actions.provider';

/**
 * @typedef {import('../../../../typings/custom-report-value').CustomReportValue} CustomReportValue
 * @typedef {import('../../../../typings/custom-report-field').CustomReportField} CustomReportField
 * @typedef {import('../../../../typings/custom-report-filter').CustomReportFilter} CustomReportFilter
 */

/**
 * @typedef {{
 *   item: CustomReportValue | CustomReportField | CustomReportFilter
 *   values: string[]
 *   index: number
 * }} Props
 */

/** @type {React.FunctionComponent<Props>} */
export const ValuesSelect = ({ index, item, values: selectedValues }) => {
  const { changeFilterVisibleValues } = useActions();

  const valuesRef = useRef(selectedValues);
  valuesRef.current = selectedValues;
  const onChange = useCallback(
    /**
     * @param {boolean} checked
     * @param {{ groupID: string; id: string, label: string }} option
     */
    (checked, option) => {
      if (checked) {
        changeFilterVisibleValues('filters', index, [
          ...valuesRef.current,
          option.id
        ]);
      } else {
        changeFilterVisibleValues(
          'filters',
          index,
          valuesRef.current.filter(i => i !== option.id)
        );
      }
    },
    [index, changeFilterVisibleValues]
  );

  const values = useValuesForField(item.name);

  const styles = useStyles();

  return ((
    <MultiSelect
      className={styles.select}
      label={
        selectedValues && selectedValues.length
          ? selectedValues.join(', ')
          : '\u00A0'
      }
      onChange={onChange}
      options={
        values
          ? values.map(value => ({
              label: value,
              id: value,
              groupID: 'Value'
            }))
          : []
      }
      selectedOptions={selectedValues.map(value => ({
        label: value,
        id: value,
        groupID: 'Value'
      }))}
      disabled={!values || !values.length}
    />
  ));
};

const useStyles = makeStyles({
  select: {
    width: '100%'
  }
});
