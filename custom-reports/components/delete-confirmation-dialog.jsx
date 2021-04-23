import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextButton } from 'js/components';
import t from '../i18n/en.json';

/**
 * @typedef {{
 *  visible: boolean
 *  onRequestClose: () => void
 *  onDeleteCustomReport: () => void
 * }} Props
 */

/** @type {React.FunctionComponent<Props>} */
export const DeleteConfirmationDialog = ({
  visible,
  onRequestClose,
  onDeleteCustomReport
}) => {
  return ((
    <Dialog open={visible} onClose={onRequestClose}>
      <DialogTitle>{t.deleteConfirmationDialog.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t.deleteConfirmationDialog.body}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <TextButton onClick={onRequestClose}>
          {t.deleteConfirmationDialog.cancel}
        </TextButton>
        <TextButton onClick={onDeleteCustomReport} scheme="red">
          {t.deleteConfirmationDialog.delete}
        </TextButton>
      </DialogActions>
    </Dialog>
  ));
};
