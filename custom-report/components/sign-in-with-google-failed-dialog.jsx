import React, { useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextButton } from 'js/components';
import { useSignInWithGoogleDialog } from '../providers/google-sheets.provider';

/** @type {React.FunctionComponent} */
export const SignInWithGoogleFailedDialog = () => {
  const [
    showSignInWithGoogleDialog,
    setShowSignInWithGoogleDialog
  ] = useSignInWithGoogleDialog();

  const onRequestClose = useCallback(() => {
    setShowSignInWithGoogleDialog(false);
  }, [setShowSignInWithGoogleDialog]);

  return ((
    <Dialog open={showSignInWithGoogleDialog} onClose={onRequestClose}>
      <DialogTitle>Sign in with Google failed</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please make sure that pop-up windows are enabled and that you sign in
          with your Google account.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <TextButton onClick={onRequestClose}>OK</TextButton>
      </DialogActions>
    </Dialog>
  ));
};
