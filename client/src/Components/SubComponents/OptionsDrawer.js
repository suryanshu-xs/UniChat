import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Logo from '../../Images/logo.png'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import AccessibilityNewRoundedIcon from '@mui/icons-material/AccessibilityNewRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import FormDialog, { FullScreenDialog } from './Backdrop';
import { UserContext } from '../../App';




const OptionsDrawer = ({ openDrawers, setOpenDrawers }) => {

    const [openDialogue, setOpenDialogue] = useState(false)
    const [openFullScreenDialog, setOpenFullScreenDialog] = useState({
        open: false,
        title: '',
        isDisabled: false,
        action: ''

    })
    const [user] = useContext(UserContext)


    return (
        <>

            <Drawer
                anchor='right'
                open={openDrawers.optionsDrawer}
                onClose={() => setOpenDrawers({ optionsDrawer: false, chatsDrawer: false })}
            >
                <Box
                    sx={{ width: 220 }}
                    role="presentation"
                    onClick={() => setOpenDrawers({
                        optionsDrawer: false,
                        chatsDrawer: false
                    })}
                    onKeyDown={() => setOpenDrawers({
                        optionsDrawer: false,
                        chatsDrawer: false
                    })}
                >

                    <div className='options-drawer-logo-container' >

                        <img src={Logo} alt="" />
                        <span> Hello {user?.name} </span>
                    </div>

                    <List>

                        <ListItem button onClick={() => setOpenFullScreenDialog({
                            open: true,
                            title: 'Account Settings',
                            isDisabled: false,
                            action: 'account'

                        })} >
                            <ListItemIcon>
                                <PersonRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary='Account' />
                        </ListItem>

                        <ListItem button onClick={() => setOpenDialogue(true)} >
                            <ListItemIcon>
                                <PersonAddAlt1RoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary='Add Contact' />
                        </ListItem>

                        <ListItem button >
                            <ListItemIcon>
                                <GroupsRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary='New Group' />
                        </ListItem>

                        <ListItem button onClick={() => setOpenFullScreenDialog({
                            open: true,
                            title: 'Set Themes',
                            isDisabled: false,
                            action: 'themes'
                        })} >
                            <ListItemIcon>
                                <PaletteRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary='Themes' />
                        </ListItem>

                        <ListItem button onClick={() => setOpenFullScreenDialog({
                            open: true,
                            title: 'About Us',
                            isDisabled: true,
                            action: 'aboutUs'
                        })} >
                            <ListItemIcon>
                                <AccessibilityNewRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary='About Us' />
                        </ListItem>

                    </List>
                </Box>
            </Drawer>
            <FormDialog openFormDialogue={openDialogue} setOpenFormDialogue={setOpenDialogue} />
            <FullScreenDialog openFullScreenDialog={openFullScreenDialog} setOpenFullScreenDialog={setOpenFullScreenDialog} />

        </>
    );
}

export default OptionsDrawer