import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from 'js/components/button';
import { Table } from 'js/components/table';
import Palette from 'js/theme/palette';
import React, { useCallback } from 'react';
import { useActions } from '../providers/actions.provider';

/**
 * @typedef {import('js/typings/custom-report').CustomReport} CustomReport
 * @typedef {{
 *  customReport: CustomReport
 * }} Props
 */

/** @type {React.FunctionComponent<Props>} */
export const Row = ({ customReport }) => {
  const {
    presentDeleteConfirmationDialog,
    presentEditCustomReportDrawer
  } = useActions();

  const onEditClick = useCallback(
    e => {
      e.stopPropagation();
      presentEditCustomReportDrawer(customReport._id);
    },
    [presentEditCustomReportDrawer, customReport._id]
  );

  const onDeleteClick = useCallback(
    e => {
      e.stopPropagation();
      presentDeleteConfirmationDialog(customReport)();
    },
    [presentDeleteConfirmationDialog, customReport]
  );

  const goToCustomReport = useCallback(() => {
    window.location.href = `/#/reports/custom-report/${customReport._id}`;
  }, [customReport._id]);

  const styles = useStyles();

  return ((
    <Table.Row key={customReport._id}>
      <Table.Cell onClick={goToCustomReport} style={{ cursor: 'pointer ' }}>
        <Typography variant="subtitle1">{customReport.name}</Typography>
        {!customReport.rows.length && !customReport.columns.length ? (
          <Typography component="span" style={{ color: Palette.gray.light }}>
            Empty
          </Typography>
        ) : (
          <>
            {customReport.rows.length ? (
              <div className={styles.fields}>
                <Typography
                  component="span"
                  style={{ color: Palette.gray.main }}
                >
                  Rows:{'\u00A0'}
                </Typography>
                <Typography
                  className={styles.fieldsList}
                  component="span"
                  style={{ color: Palette.gray.main }}
                >
                  {customReport.rows
                    .map(
                      row =>
                        row.name ||
                        (row.customField ? row.customField.display : '')
                    )
                    .join(', ')}
                </Typography>
              </div>
            ) : null}
            {customReport.columns.length ? (
              <div className={styles.fields}>
                <Typography
                  component="span"
                  style={{ color: Palette.gray.main }}
                >
                  Columns:{'\u00A0'}
                </Typography>
                <Typography
                  className={styles.fieldsList}
                  component="span"
                  style={{ color: Palette.gray.main }}
                >
                  {customReport.columns
                    .map(
                      column =>
                        column.name ||
                        (column.customField ? column.customField.display : '')
                    )
                    .join(', ')}
                </Typography>
              </div>
            ) : null}
          </>
        )}
      </Table.Cell>
      <Table.Cell
        onClick={goToCustomReport}
        style={{ cursor: 'pointer ' }}
        align="right"
      >
        <Button
          onClick={onEditClick}
          content={<Button.Glyph name="pen" />}
          marginRight={4}
        />
        <Button
          onClick={onDeleteClick}
          content={<Button.Glyph name="trash" />}
        />
      </Table.Cell>
    </Table.Row>
  ));
};

const useStyles = makeStyles({
  fields: {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center'
  },

  fieldsList: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
});
