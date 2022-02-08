import { Avatar, IconButton, ListItem, Tooltip } from '@mui/material'
import React, { useContext, useState } from 'react'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import FormDialog, { AlertDialog } from './Backdrop';
import { UserContext } from '../../App';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';



const ChatsHeader = () => {

    const [openDialogue, setOpenDialogue] = useState(false)
    const [user] = useContext(UserContext)
    const [openAlertDialog, setOpenAlertDialog] = useState({
        open: false,
        dialogTitle: '',
        dialogText: '',
        action: ''
    })

    const handleLogOutButtonClick = () => {
        setOpenAlertDialog({
            open:true,
            dialogTitle:'Logout?',
            dialogText: 'Are you sure to logout. Click continue to logout.',
            action: 'logout_user'
        })
    }

    return (
        <>
            <ListItem  >

                <div className="chats-section-header">
                    <Avatar src={`${user.photoURL ? user.photoURL : 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png'}`} />

                    <div className="chats-section-header-icons">

                        <Tooltip title='New Group' >
                            <IconButton>
                                <GroupRoundedIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title='New Chat' >
                            <IconButton onClick={() => setOpenDialogue(true)} >
                                <PersonAddAlt1RoundedIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title='LogOut' >
                            <IconButton onClick={handleLogOutButtonClick} >
                                <LogoutRoundedIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>

            </ListItem>
            <FormDialog openFormDialogue={openDialogue} setOpenFormDialogue={setOpenDialogue} />
            <AlertDialog open={openAlertDialog} setOpen={setOpenAlertDialog} />
        </>
    )
}

export default ChatsHeader
