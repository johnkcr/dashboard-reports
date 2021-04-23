import React, { useCallback, useState } from 'react';
import { Table as TableBase } from 'js/components';
import { useQueryResult } from '../providers/query.provider';
import { Row } from './row';
import styled from 'styled-components';
import { sortBy } from 'lodash';

/**
 * @typedef {{ by: string; direction: 'asc' | 'desc' }} Sort
 */

/** @type {any} */
const DEFAULT_STATE = { by: 'name', direction: 'asc' };

/**
 * @param {import('js/typings/custom-report').CustomReport[] | undefined} data
 * @param {Sort} sort
 * @return {import('js/typings/custom-report').CustomReport[]}
 */
function sortData(data, sort) {
  const result = sortBy(data || [], sort.by);
  if (sort.direction === 'desc') return result.reverse();
  return result;
}

/** @type {React.FunctionComponent} */
export const Table = ({}) => {
  const { data } = useQueryResult();
  /** @type {[Sort, React.Dispatch<React.SetStateAction<Sort>>]} */
  const [sort, setSort] = useState(DEFAULT_STATE);

  const sortBy = useCallback(
    by => () => {
      setSort(s => ({
        by,
        direction:
          s.by === by ? (s.direction === 'asc' ? 'desc' : 'asc') : 'asc'
      }));
    },
    []
  );

  return ((
    <TableBase style={{ tableLayout: 'fixed' }}>
      <TableBase.Head>
        <TableBase.Row>
          <TableBase.Cell>
            <TableBase.SortLabel
              active={sort.by === 'name'}
              direction={sort.direction}
              onClick={sortBy('name')}
            >
              Name
            </TableBase.SortLabel>
          </TableBase.Cell>
          <TableHeaderActionsCell />
        </TableBase.Row>
      </TableBase.Head>
      <TableBase.Body>
        {sortData(data, sort).map(customReport => (
          <Row key={customReport._id} customReport={customReport} />
        ))}
      </TableBase.Body>
    </TableBase>
  ));
};

const TableHeaderActionsCell = styled(TableBase.Cell)`
  // 126 = buttons (68), padding-right (38), padding-left (20)
  width: 126px;
`;
