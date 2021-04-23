import React, { useCallback, useRef } from 'react';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot
} from 'react-beautiful-dnd';
import { Paper } from './paper';
import { Field } from './field';
import Typography from '@material-ui/core/Typography';
import { TableHeader } from './table-header';
import { FieldsSelect } from './fields-select';
import { useQueryResult } from '../providers/query.provider';
import uuidv1 from 'uuid/v1';
import styled from 'styled-components';
import { useActions } from '../providers/actions.provider';

/**
 * @typedef {import('../../../typings/custom-report').CustomReport} CustomReport
 * @typedef {import('../../../typings/custom-report-value').CustomReportValue} CustomReportValue
 * @typedef {import('../../../typings/custom-report-field').CustomReportField} CustomReportField
 * @typedef { import('js/typings/custom-report-filter').CustomReportFilter} CustomReportFilter
 */

/**
 * @typedef {{
 *   uid: string
 *   item: CustomReportValue | CustomReportField | CustomReportFilter
 * }} Item
 */

/**
 * @typedef {{
 *   columns: Item[]
 *   rows: Item[]
 *   values: Item[]
 * }} State
 */

/**
 * @param {'columns' | 'rows' | 'values' | 'filters'} type
 * @param {Item[]} prevItems
 * @param {Array<CustomReportValue | CustomReportField | CustomReportFilter>} nextItems
 * @return {Item[]}
 */
function merge(type, prevItems, nextItems) {
  prevItems = [...prevItems];
  let finalItems = [];
  for (const item of nextItems) {
    const prevItemIndex = prevItems.findIndex(p => {
      if (
        p.item.customField &&
        item.customField &&
        p.item.customField._id === item.customField._id
      ) {
        return true;
      } else if (p.item.key === item.key) {
        return true;
      }
    });
    if (prevItemIndex !== -1) {
      finalItems.push({ ...prevItems[prevItemIndex], item });
      prevItems = [
        ...prevItems.slice(0, prevItemIndex),
        ...prevItems.slice(prevItemIndex + 1)
      ];
    } else {
      finalItems.push({ uid: uuidv1(), item });
    }
  }
  return finalItems;
}

export const Fields = () => {
  const { data } = useQueryResult();
  const { move } = useActions();

  /** @type {any} */
  const prevItems = useRef({
    columns: [],
    rows: [],
    values: [],
    filters: []
  });
  const items = {
    columns: merge(
      'columns',
      prevItems.current.columns,
      data ? data.columns : []
    ),
    rows: merge('rows', prevItems.current.rows, data ? data.rows : []),
    values: merge('values', prevItems.current.values, data ? data.values : []),
    filters: merge(
      'filters',
      prevItems.current.filters,
      data ? data.filters : []
    )
  };
  prevItems.current = items;

  const onDragEnd = useCallback(
    ({ source, destination }) => {
      if (!destination) {
        return;
      }

      return move(
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    },
    [move]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="rows">
        {renderDroppable('Rows', 'rows', items.rows)}
      </Droppable>
      <Droppable droppableId="columns">
        {renderDroppable('Columns', 'columns', items.columns)}
      </Droppable>
      <Droppable droppableId="values">
        {renderDroppable('Values', 'values', items.values)}
      </Droppable>
      <Droppable droppableId="filters">
        {renderDroppable('Filters', 'filters', items.filters)}
      </Droppable>
    </DragDropContext>
  );
};

/**
 * @param {string} title
 * @param {'columns' | 'rows' | 'values' | 'filters'} type
 * @param {Item[]} items
 */
function renderDroppable(title, type, items) {
  return (
    /**
     * @param {DroppableProvided} provided
     * @param {DroppableStateSnapshot} snapshot
     */
    (provided, snapshot) => (
      <Paper
        ref={provided.innerRef}
        {...provided.droppableProps}
        marginBottom={16}
      >
        <Typography variant="h5" style={{ marginTop: -6, marginBottom: 16 }}>
          {title}
        </Typography>
        {items && items.length ? <TableHeader type={type} /> : null}
        {items.map(({ uid, item }, index) => (
          <Field key={uid} index={index} item={item} uid={uid} type={type} />
        ))}
        {!items || !items.length ? <FieldEmptyState /> : null}
        {provided.placeholder}
        <FieldsSelect type={type} />
      </Paper>
    )
  );
}

const FieldEmptyState = styled('div')`
  height: 48px;
  border: 1px dashed #e1e3e6;
  border-radius: 5px;
  margin-bottom: 8px;
`;
