import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { OpenSnackbarContext, UserContext } from '../../App';
import { SocketContext, ActiveChatFriendContext } from '../Home';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { AboutUs, Account, Themes } from './Options';
import { uploadProfilePicture } from '../../Data/functions';

export default function FormDialog({ openFormDialogue, setOpenFormDialogue }) {

    const setSnackBarData = useContext(OpenSnackbarContext)
    const [addChatEmail, setAddChatEmail] = useState('')
    const socket = useContext(SocketContext)
    const [user] = useContext(UserContext)
    const handleClose = () => {
        setOpenFormDialogue(false);
    };

    const handleAddButtonClick = () => {
        if (!addChatEmail || !addChatEmail.includes('@')) {
            setSnackBarData({ open: true, message: 'Please enter a valid email address' })
            return
        }
        if (addChatEmail === user.email) {
            setSnackBarData({ open: true, message: 'You can not add yourself' })
            return
        }

        try {
            socket.emit('add_user_to_chat', {
                user: user.email,
                name: user.name,
                targetUser: addChatEmail
            })
        } catch (error) {
            setSnackBarData({ open: true, message: 'There was some error sending the request.' })
        }
        setOpenFormDialogue(false)
    }

    return (
        <div>
            <Dialog open={openFormDialogue} onClose={handleClose}>

                <DialogTitle>Add New Chat</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the email address of the user you want to add.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        fullWidth
                        variant="standard"
                        required
                        value={addChatEmail}
                        onChange={(e) => setAddChatEmail(e.target.value)}
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleAddButtonClick}>Add</Button>
                    <Button onClick={() => setOpenFormDialogue(false)}>Cancel</Button>
                </DialogActions>

            </Dialog>
        </div>
    );
}


function AlertDialog({ open, setOpen, setAnchorEl }) {

    const setSnackBarData = useContext(OpenSnackbarContext)
    const socket = useContext(SocketContext)
    const [user, setUser] = useContext(UserContext)
    const [activeChatFriend] = useContext(ActiveChatFriendContext)

    const handleClose = () => {
        setOpen({ ...open, open: false, });
        if (setAnchorEl) {
            setAnchorEl(null)
        }
    };

    const handleContinueAction = () => {
        try {
            if (open.action !== 'logout_user') {
                socket.emit(open.action, {
                    user: user.email,
                    targetUser: activeChatFriend.email,
                })
            } else {
                socket.emit(open.action, {
                    user: user.email,
                })
                // console.log(open.action)
                setUser(null)
            }
            setOpen({ ...open, open: false, });
            if (setAnchorEl) {
                setAnchorEl(null)
            }
        } catch (error) {

            setSnackBarData({ open: true, message: 'Error occured while sending request.' })
            setOpen({ ...open, open: false, });
            if (setAnchorEl) {
                setAnchorEl(null)
            }
        }
    }

    return (
        <div>
            <Dialog
                open={open.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {open.dialogTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {open.dialogText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button size='small' variant="contained" onClick={handleContinueAction} autoFocus color="error" >
                        Continue
                    </Button>
                    <Button size='small' onClick={handleClose} variant="contained" color="primary">Cancel</Button>

                </DialogActions>
            </Dialog>
        </div>
    );
}



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function FullScreenDialog({ openFullScreenDialog, setOpenFullScreenDialog }) {

    const handleClose = () => {
        setOpenFullScreenDialog({
            ...openFullScreenDialog, open: false
        });
    };
    let elementToRender = <></>
    const socket = useContext(SocketContext)
    const [file,setFile] = useState(null)
    const [user] = useContext(UserContext)
    const setSnackBarData = useContext(OpenSnackbarContext)
    const [editedName,setEditedName] = useState('')
    const [socketData, setsocketData] = useState({
        event: '',
        data: {}
    })


    const handleSaveButtonClick = () => {
        
        if(file){
            uploadProfilePicture(file,user,setSnackBarData,setFile,socket)
        }
        if(editedName){
            socket.emit('modify_name',{
                user:user.email,
                editedName:editedName
            })
            setEditedName('')
        }
        setOpenFullScreenDialog({
            ...openFullScreenDialog, open: false
        });

    }

    if (openFullScreenDialog.action === 'account') {
        elementToRender = <Account file={file} setFile={setFile} setEditedName={setEditedName} />
    }
    else if (openFullScreenDialog.action === 'themes') {

        elementToRender = <Themes socketData={socketData} setsocketData={setsocketData} handleSaveButtonClick={handleSaveButtonClick} />
    }
    else {
        elementToRender = <AboutUs socketData={socketData} setsocketData={setsocketData} handleSaveButtonClick={handleSaveButtonClick} />
    }


    return (

        <Dialog
            fullScreen
            open={openFullScreenDialog.open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"

                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1, fontSize: 18 }} component="div">
                        {openFullScreenDialog.title}
                    </Typography>
                    {
                        !openFullScreenDialog.isDisabled ? <Button autoFocus color="inherit" onClick={handleSaveButtonClick}>
                            save
                        </Button> : null
                    }
                </Toolbar>
            </AppBar>

            {elementToRender}


        </Dialog>

    );
}






export { AlertDialog, FullScreenDialog }