import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TextField } from 'js/components';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useActions } from '../../providers/actions.provider';

const DEBOUNCE_TIME = 300;

/**
 * @typedef {null | 'CONDITION_TYPE_UNSPECIFIED' | 'NUMBER_GREATER' | 'NUMBER_GREATER_THAN_EQ' | 'NUMBER_LESS' | 'NUMBER_LESS_THAN_EQ' | 'NUMBER_EQ' | 'NUMBER_NOT_EQ' | 'NUMBER_BETWEEN' | 'NUMBER_NOT_BETWEEN' | 'TEXT_CONTAINS' | 'TEXT_NOT_CONTAINS' | 'TEXT_STARTS_WITH' | 'TEXT_ENDS_WITH' | 'TEXT_EQ' | 'DATE_EQ' | 'DATE_BEFORE' | 'DATE_AFTER' | 'DATE_BETWEEN' | 'BLANK' | 'NOT_BLANK' | 'CUSTOM_FORMULA'} ConditionType
 * @typedef {{
 *  relativeDate?:
 *    | 'RELATIVE_DATE_UNSPECIFIED'
 *    | 'PAST_YEAR'
 *    | 'PAST_MONTH'
 *    | 'PAST_WEEK'
 *    | 'YESTERDAY'
 *    | 'TODAY'
 *    | 'TOMORROW';
 *  userEnteredValue?: string;
 * }} ConditionValue
 */

/** @type {React.FunctionComponent<{ index: number; conditionType: ConditionType; values: ConditionValue[]; }>} */
export const ConditionValues = ({ index, conditionType, values }) => {
  const styles = useStyles();
  const [value1, setValue1] = useState(
    values[0] && values[0].userEnteredValue ? values[0].userEnteredValue : ''
  );
  const [value2, setValue2] = useState(
    values[1] && values[1].userEnteredValue ? values[1].userEnteredValue : ''
  );

  const { changeFilterConditionValues } = useActions();

  const valuesRef = useRef(values);
  valuesRef.current = values;
  const conditionTypeRef = useRef(conditionType);
  conditionTypeRef.current = conditionType;
  const debounce1 = useCallback(
    /** @param {string} value */
    value => {
      if (
        conditionTypeRef.current === 'NUMBER_BETWEEN' ||
        conditionTypeRef.current === 'NUMBER_NOT_BETWEEN'
      ) {
        /** @type {any} */
        const value2 = valuesRef.current[1] || {
          userEnteredValue: ''
        };
        changeFilterConditionValues('filters', index, [
          {
            userEnteredValue: value
          },
          value2
        ]);
      } else {
        changeFilterConditionValues('filters', index, [
          {
            userEnteredValue: value
          }
        ]);
      }
    },
    [index, changeFilterConditionValues]
  );
  /** @type {React.MutableRefObject<any>} */
  const deferrer1 = useRef();
  const onChange1 = useCallback(
    /** @param {React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>} event */
    event => {
      const value = event.target.value;
      setValue1(value);
      if (deferrer1.current) clearTimeout(deferrer1.current);
      deferrer1.current = setTimeout(() => debounce1(value), DEBOUNCE_TIME);
    },
    [debounce1]
  );

  const debounce2 = useCallback(
    /** @param {string} value */
    value => {
      if (
        conditionTypeRef.current === 'NUMBER_BETWEEN' ||
        conditionTypeRef.current === 'NUMBER_NOT_BETWEEN'
      ) {
        /** @type {any} */
        const value1 = valuesRef.current[0] || {
          userEnteredValue: ''
        };
        changeFilterConditionValues('filters', index, [
          value1,
          {
            userEnteredValue: value
          }
        ]);
      } else {
        changeFilterConditionValues('filters', index, [
          {
            userEnteredValue: value
          }
        ]);
      }
    },
    [index, changeFilterConditionValues]
  );
  /** @type {React.MutableRefObject<any>} */
  const deferrer2 = useRef();
  const onChange2 = useCallback(
    /** @param {React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>} event */
    event => {
      const value = event.target.value;
      setValue2(value);
      if (deferrer2.current) clearTimeout(deferrer2.current);
      deferrer2.current = setTimeout(() => debounce2(value), DEBOUNCE_TIME);
    },
    [debounce2]
  );

  if (
    conditionType === 'BLANK' ||
    conditionType === 'NOT_BLANK' ||
    conditionType === null
  ) {
    return null;
  } else if (
    conditionType === 'NUMBER_BETWEEN' ||
    conditionType === 'NUMBER_NOT_BETWEEN'
  ) {
    return ((
      <div className={styles.row}>
        <TextField
          type="text"
          placeholder="Value or formula"
          variant="compact"
          onChange={onChange1}
          value={value1}
        />
        <Typography variant="caption" className={styles.and}>
          and
        </Typography>
        <TextField
          type="text"
          placeholder="Value or formula"
          variant="compact"
          onChange={onChange2}
          value={value2}
        />
      </div>
    ));
  }

  return ((
    <div className={styles.row}>
      <TextField
        type="text"
        placeholder="Value or formula"
        variant="compact"
        onChange={onChange1}
        value={value1}
      />
    </div>
  ));
};

const useStyles = makeStyles(
  /** @param {*} theme */
  theme => ({
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },

    and: {
      margin: '0px 8px',
      transform: 'translateY(2px)'
    }
  })
);
