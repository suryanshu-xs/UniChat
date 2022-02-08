import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';



const HomePageHeader = ({ setOpenDrawers }) => {

    

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{
                    background: "linear-gradient(196deg,rgba(2, 0, 36, 1) 0%,rgba(15, 103, 226, 1) 0%,rgba(0, 212, 255, 1) 100%)",

                }}>
                    <Toolbar>
                        
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            UniChat
                        </Typography>
                        <div>
                        <IconButton
                            size="medium"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            className='chat-open-icon'
                            onClick={() => setOpenDrawers({
                                optionsDrawer: false,
                                chatsDrawer: true
                            })}
                        >
                            <MapsUgcIcon />
                        </IconButton>
                            <IconButton
                                size="medium"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ ml: -0.5 }}
                                onClick={() => setOpenDrawers({
                                    optionsDrawer: true,
                                    chatsDrawer: false
                                })}
                            >
                                <MenuIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
            

        </>
    );
}
export default HomePageHeader