import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { Select } from 'js/components/select';
import React, { useCallback } from 'react';
import { useFilterSelectContext } from './filter-select';
import { useActions } from '../../providers/actions.provider';

/** @type {React.FunctionComponent<{ index: number; value: string | null }>} */
export const ConditionTypeSelect = ({ index, value }) => {
  const { changeFilterConditionType } = useActions();

  const setKeepOpen = useFilterSelectContext();

  const onOpen = useCallback(() => {
    setKeepOpen(true);
  }, [setKeepOpen]);

  const onClose = useCallback(() => {
    setTimeout(() => setKeepOpen(false), 100);
  }, [setKeepOpen]);

  const styles = useStyles();

  const onChange = useCallback(
    /** @param {React.ChangeEvent<{ name?: string, value: any }>} event */
    event => {
      changeFilterConditionType('filters', index, event.target.value);
    },
    [changeFilterConditionType, index]
  );

  return ((
    <Select
      className={styles.select}
      value={value || ''}
      onChange={onChange}
      onOpen={onOpen}
      onClose={onClose}
    >
      <MenuItem value="">None</MenuItem>
      <MenuItem className={styles.divider} disabled />
      <MenuItem value="BLANK">Is empty</MenuItem>
      <MenuItem value="NOT_BLANK">Is not empty</MenuItem>
      <MenuItem value="TEXT_CONTAINS">Text contains</MenuItem>
      <MenuItem value="TEXT_NOT_CONTAINS">Text does not contain</MenuItem>
      <MenuItem value="TEXT_STARTS_WITH">Text starts with</MenuItem>
      <MenuItem value="TEXT_ENDS_WITH">Text ends with</MenuItem>
      <MenuItem value="TEXT_EQ">Text is exactly</MenuItem>
      <MenuItem className={styles.divider} disabled />
      <MenuItem value="DATE_EQ">Date is</MenuItem>
      <MenuItem value="DATE_BEFORE">Date is before</MenuItem>
      <MenuItem value="DATE_AFTER">Date is after</MenuItem>
      <MenuItem className={styles.divider} disabled />
      <MenuItem value="NUMBER_GREATER">Greater than</MenuItem>
      <MenuItem value="NUMBER_GREATER_THAN_EQ">
        Greater than or equal to
      </MenuItem>
      <MenuItem value="NUMBER_LESS">Less than</MenuItem>
      <MenuItem value="NUMBER_LESS_THAN_EQ">Less than or equal to</MenuItem>
      <MenuItem value="NUMBER_EQ">Is equal to</MenuItem>
      <MenuItem value="NUMBER_BETWEEN">Is between</MenuItem>
      <MenuItem value="NUMBER_NOT_BETWEEN">Is not between</MenuItem>
      <MenuItem className={styles.divider} disabled />
      <MenuItem value="CUSTOM_FORMULA">Custom formula is</MenuItem>
    </Select>
  ));
};

const useStyles = makeStyles(
  /** @param {any} theme */
  theme => ({
    select: {
      width: '100%'
    },
    divider: {
      pointerEvents: 'none',
      minHeight: 1,
      background: theme.palette.gray[400],
      padding: 0,
      marginTop: 2,
      marginBottom: 2
    }
  })
);
