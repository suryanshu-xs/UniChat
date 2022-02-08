import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const SimpleSnackbar = ({ open, setSnackBarData, message }) => {

    const handleClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBarData({message:message,open:false})
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (

        <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            message={message}
            action={action}
            
        />

    );
}

export default SimpleSnackbar