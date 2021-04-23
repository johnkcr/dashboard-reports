import React, { useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { DragSymbol } from './drag-symbol';
import { Select } from 'js/components/select';
import { Button } from 'js/components/button';
import Typography from '@material-ui/core/Typography';
import { useActions } from '../providers/actions.provider';
import { FilterSelect } from './filter-select/filter-select';

/**
 * @typedef {import('../../../typings/custom-report-value').CustomReportValue} CustomReportValue
 * @typedef {import('../../../typings/custom-report-field').CustomReportField} CustomReportField
 * @typedef {import('../../../typings/custom-report-filter').CustomReportFilter} CustomReportFilter
 */

/**
 * @typedef {{
 *   type: 'columns' | 'rows' | 'values' | 'filters'
 *   uid: string
 *   item: CustomReportValue | CustomReportField | CustomReportFilter
 *   index: number
 * }} Props
 */

/** @type {React.FunctionComponent<Props>} */
export const Field = ({ item, uid, index, type }) => {
  const { changeOrder, changeSummarizeFunction, removeField } = useActions();
  /** @type {any} */
  const anyItem = item;
  /** @type {any} */
  const anyType = type;

  const onOrderChange = useCallback(
    /** @param {React.ChangeEvent<{ name?: string; value: any }>} event */
    event => changeOrder(anyType, index, event.target.value),
    [changeOrder, anyType, index]
  );

  const onSummarizeFunctionChange = useCallback(
    /** @param {React.ChangeEvent<{ name?: string; value: any }>} event */
    event => changeSummarizeFunction(anyType, index, event.target.value),
    [changeSummarizeFunction, anyType, index]
  );

  const onRemoveClick = useCallback(() => removeField(anyType, index), [
    removeField,
    anyType,
    index
  ]);

  const styles = useStyles();

  return ((
    <Draggable key={uid} draggableId={uid} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.field}
          style={{
            ...provided.draggableProps.style,
            backgroundColor: index % 2 === 0 ? '#f7f7f7' : '#ffffff'
          }}
        >
          <div className={styles.dragSymbolContainer}>
            <DragSymbol />
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.nameContainer}>
              <Typography className={styles.name}>
                {item.customField ? item.customField.display : item.name}
              </Typography>
            </div>
            <div className={styles.optionsContainer}>
              {type === 'columns' || type === 'rows' ? (
                <div className={styles.orderContainer}>
                  <Typography variant="caption" className={styles.label}>
                    Order
                  </Typography>
                  <Select
                    value={anyItem.sortOrder || 'ASCENDING'}
                    autoWidth={false}
                    fullWidth={true}
                    onChange={onOrderChange}
                    className={styles.select}
                  >
                    <MenuItem value="ASCENDING">Ascending</MenuItem>
                    <MenuItem value="DESCENDING">Descending</MenuItem>
                  </Select>
                </div>
              ) : type === 'values' ? (
                <div className={styles.orderContainer}>
                  <Typography variant="caption" className={styles.label}>
                    Summarize function
                  </Typography>
                  <Select
                    value={anyItem.summarizeFunction || 'SUM'}
                    autoWidth={false}
                    fullWidth={true}
                    onChange={onSummarizeFunctionChange}
                    className={styles.select}
                  >
                    <MenuItem value="SUM">SUM</MenuItem>
                    <MenuItem value="COUNTA">COUNTA</MenuItem>
                    <MenuItem value="COUNT">COUNT</MenuItem>
                    <MenuItem value="COUNTUNIQUE">COUNTUNIQUE</MenuItem>
                    <MenuItem value="AVERAGE">AVERAGE</MenuItem>
                    <MenuItem value="MAX">MAX</MenuItem>
                    <MenuItem value="MIN">MIN</MenuItem>
                    <MenuItem value="MEDIAN">MEDIAN</MenuItem>
                    <MenuItem value="PRODUCT">PRODUCT</MenuItem>
                    <MenuItem value="STDEV">STDEV</MenuItem>
                    <MenuItem value="STDEVP">STDEVP</MenuItem>
                    <MenuItem value="VAR">VAR</MenuItem>
                    <MenuItem value="VARP">VARP</MenuItem>
                  </Select>
                </div>
              ) : type === 'filters' ? (
                <div className={styles.orderContainer}>
                  <Typography variant="caption" className={styles.label}>
                    Status
                  </Typography>
                  <FilterSelect
                    item={anyItem}
                    uid={uid}
                    index={index}
                    type={type}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <Button
            onClick={onRemoveClick}
            content={<Button.Glyph name="trash" />}
          />
        </div>
      )}
    </Draggable>
  ));
};

/** @type {any} */
const AnyDiv = 'div';

const useStyles = makeStyles(
  /** @param {*} theme */
  theme => ({
    field: {
      padding: '0.5rem 1rem',
      marginBottom: '8px',
      cursor: 'move',
      userSelect: 'none',
      border: '1px solid #e1e3e6',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },

    dragSymbolContainer: {
      marginRight: '12px',
      transform: 'translateY(1px)'
    },

    contentContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: '16px',
      overflow: 'hidden',
      [theme.breakpoints.down(760)]: {
        alignItems: 'flex-start',
        flexDirection: 'column'
      }
    },

    nameContainer: {
      marginRight: '16px',
      flex: 1,
      overflow: 'hidden',
      width: '100%'
    },

    name: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    },

    optionsContainer: {
      display: 'flex',
      flexDirection: 'row',
      [theme.breakpoints.down(760)]: {
        marginTop: '4px'
      },
      [theme.breakpoints.down(536)]: {
        flexDirection: 'column',
        width: '100%'
      }
    },

    orderContainer: {
      display: 'flex',
      flexDirection: 'column'
    },

    label: {
      display: 'none',
      [theme.breakpoints.down(760)]: {
        marginBottom: '2px',
        display: 'block',
        fontSize: '11px',
        lineHeight: '13px',
        letterSpacing: '0.37px',
        color: theme.palette.gray[600]
      }
    },

    select: {
      [theme.breakpoints.up(340)]: {
        width: '160px'
      }
    }
  })
);
