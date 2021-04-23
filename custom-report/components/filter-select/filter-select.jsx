import React, {
  useState,
  useCallback,
  createContext,
  useContext,
  useRef
} from 'react';
import RichTooltip from 'js/components/rich-tooltip/rich-tooltip';
import { SelectButton } from 'js/components/select-button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ConditionTypeSelect } from './condition-type-select';
import { ValuesSelect } from './values-select';
import { ConditionValues } from './condition-values';

/**
 * @typedef {import('../../../../typings/custom-report-value').CustomReportValue} CustomReportValue
 * @typedef {import('../../../../typings/custom-report-field').CustomReportField} CustomReportField
 * @typedef {import('../../../../typings/custom-report-filter').CustomReportFilter} CustomReportFilter
 */

/** @type {React.Context<any>} */
const FilterSelectContext = createContext(undefined);

/** @return {(value: boolean) => void} */
export function useFilterSelectContext() {
  return useContext(FilterSelectContext);
}

/**
 * @typedef {{
 *   type: 'columns' | 'rows' | 'values' | 'filters'
 *   uid: string
 *   item: CustomReportFilter
 *   index: number
 * }} Props
 */

/** @type {React.FunctionComponent<Props>} */
export const FilterSelect = ({ type, uid, item, index }) => {
  const [popOverVisible, setPopOverVisibility] = useState(false);

  const present = useCallback(() => {
    setPopOverVisibility(true);
  }, []);

  const keepOpenRef = useRef(false);
  const dismiss = useCallback(() => {
    if (!keepOpenRef.current) {
      setPopOverVisibility(false);
    }
  }, []);

  const setKeepOpen = useCallback(value => {
    keepOpenRef.current = value;
  }, []);

  const styles = useStyles();

  let showAll = true;
  if (item.conditionType || (item.visibleValues && item.visibleValues.length)) {
    showAll = false;
  }

  return ((
    <FilterSelectContext.Provider value={setKeepOpen}>
      <RichTooltip
        content={
          <div className={styles.popover}>
            <Typography variant="body2" className={styles.groupLabel}>
              Filter by condition
            </Typography>
            <ConditionTypeSelect index={index} value={item.conditionType} />
            <ConditionValues
              index={index}
              conditionType={item.conditionType}
              values={item.conditionValues}
            />
            <div className={styles.divider} />
            <Typography variant="body2" className={styles.groupLabel}>
              Filter by values
            </Typography>
            <div className={styles.row}>
              <ValuesSelect
                index={index}
                item={item}
                values={item.visibleValues}
              />
            </div>
          </div>
        }
        open={popOverVisible}
        placement="bottom"
        onClose={dismiss}
      >
        <SelectButton onClick={present} className={styles.select}>
          {showAll ? 'Showing all items' : 'Showing some items'}
        </SelectButton>
      </RichTooltip>
    </FilterSelectContext.Provider>
  ));
};

const useStyles = makeStyles(
  /** @param {*} theme */
  theme => ({
    select: {
      [theme.breakpoints.up(340)]: {
        width: '160px'
      }
    },

    popover: {
      width: 320
    },

    groupLabel: {
      display: 'block',
      marginBottom: 4
    },

    divider: {
      height: 1,
      backgroundColor: theme.palette.gray[400],
      margin: '16px 0'
    },

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
