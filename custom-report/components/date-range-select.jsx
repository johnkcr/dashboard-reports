import React, { useState, useMemo, useCallback } from 'react';
import MomentUtils from '@date-io/moment';
import RichTooltip from 'js/components/rich-tooltip/rich-tooltip';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateRangePicker from 'js/components/date-range-picker/date-range-picker';
import { SelectButton } from 'js/components';
import { useFilters, useSetFilters } from '../providers/filters.provider';
import { format } from 'date-fns';

export const DateRangeSelect = ({}) => {
  const [popOverVisible, setPopOverVisibility] = useState(false);
  const { endDate, startDate } = useFilters();
  const setFilters = useSetFilters();

  const label = useMemo(() => {
    const startYear = startDate.getFullYear();
    const currentYear = new Date().getFullYear();
    let start;
    if (startYear === currentYear) {
      start = format(startDate, 'MMM d');
    } else {
      start = format(startDate, 'MMM d, yyyy');
    }
    const end = format(endDate, 'MMM d, yyyy');
    return `${start} - ${end}`;
  }, [endDate, startDate]);

  const onChange = useCallback(
    /** @param {{ startDate: Date; endDate: Date }} value */
    ({ startDate, endDate }) => {
      setFilters(filters => ({ ...filters, startDate, endDate }));
    },
    [setFilters]
  );

  const present = useCallback(() => {
    setPopOverVisibility(true);
  }, []);

  const dismiss = useCallback(() => {
    setPopOverVisibility(false);
  }, []);

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <RichTooltip
        content={
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={onChange}
          />
        }
        open={popOverVisible}
        placement="bottom"
        onClose={dismiss}
      >
        <SelectButton onClick={present} marginRight={16} marginTop={16}>
          {label}
        </SelectButton>
      </RichTooltip>
    </MuiPickersUtilsProvider>
  );
};
