import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  useMediaQuery,
  Typography,
  DialogContent,
  useTheme,
  IconButton,
} from "@mui/material";
import { grey, red, } from "@mui/material/colors";
import React from "react";
import CloseIcon from '@mui/icons-material/Close';

export default function ConfirmationDialog({
  title,
  content,
  route,
  openDialog,
  closeDialog,
  onSubmit,
  onCancel,
  hideCancel,
  OkButtonText,
  CancelButtonText,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  OkButtonText = OkButtonText ? OkButtonText : "Ok";
  CancelButtonText = CancelButtonText ? CancelButtonText : "Cancel";

  const handleClose = () => {
    closeDialog(false);
  };

  return (
    <div>
      <Dialog
        sx={{ ".MuiDialog-paper": { borderRadius: "10px" } }}
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth="xs"
        open={openDialog}
        aria-labelledby="responsive-dialog-title"
        id={title}
        classes={{
          paper: {
            padding: "2px",
            position: "absolute",
            top: "5px",
          },
        }}
      >
        <DialogTitle id="responsive-dialog-title" onClose={handleClose} style={{ paddingRight: "0px" }}>
          <div style={{ display: "flex" }}>
            <Typography
              variant="h6"
              component="div"
              style={{ flexGrow: 1, marginTop: "5px" }}
            >
              {title}
            </Typography>
            <IconButton sx={{ mr: 2 }} onClick={handleClose}>
              <CloseIcon color="action" />
            </IconButton>
          </div>
        </DialogTitle>
        {content && (
          <DialogContent>
            <Typography variant="subtitle1">{content}</Typography>
          </DialogContent>
        )}
        <DialogActions sx={{ marginRight: "20px", marginBottom: "15px" }}>
          {!hideCancel && (
            <Button
              onClick={
                onCancel
                  ? onCancel
                  : () => {
                    closeDialog(false);
                  }
              }
              variant="outlined"
              sx={{ ":hover": { color: grey[50] } }} className="mpl-secondary-btn"
            >
              {CancelButtonText}
            </Button>
          )}
          <Button href={route} onClick={onSubmit} variant="outlined" sx={{ ":hover": { color: grey[50], background: red[700] }, color: grey[50], background: red[500] }}>
            {OkButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
