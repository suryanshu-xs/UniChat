import { Avatar, Button, IconButton } from '@mui/material'
import Tooltip from '@mui/material/Tooltip';
import React, { useContext, useEffect, useState } from 'react'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Box } from '@mui/system';
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import MessagesBox from './MessagesBox';
import { ActiveChatFriendContext, SocketContext } from '../Home';
import { UserContext } from '../../App';
import { formatRoomName } from '../../Data/functions';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../Data/config';
import { AlertDialog } from './Backdrop';
import CloseIcon from '@mui/icons-material/Close';
import Picker from 'emoji-picker-react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';






const MessageSection = () => {


    const [activeChatFriend, setactiveChatFriend] = useContext(ActiveChatFriendContext)
    const [user] = useContext(UserContext)
    const socket = useContext(SocketContext)
    const [messageArray, setMessageArray] = useState([])



    useEffect(async () => {
        const messageRef = doc(db, 'unichat-react-users', user.email, 'messages', activeChatFriend.email)

        onSnapshot(messageRef, querySnapshot => {

            if (querySnapshot.data() !== undefined) {
                if (Object.keys(querySnapshot.data()).length !== 0) {
                    setMessageArray(querySnapshot.data().messages)
                } else {

                    setMessageArray([])
                }
            } else {
                setMessageArray([])
            }

        })
    }, [activeChatFriend])


    return (
        <div className='message-section' style={{
            backgroundImage: `url(${user.backgroundLink})`,
        }} >

            <HeaderSection activeChatFriend={activeChatFriend} socket={socket} user={user} setactiveChatFriend={setactiveChatFriend} />

            <MessagesBox activeChatFriend={activeChatFriend} messageArray={messageArray} setMessageArray={setMessageArray} user={user} />

            <SendSection activeChatFriend={activeChatFriend} user={user} socket={socket} />

        </div>
    )
}



const HeaderSection = ({ activeChatFriend, socket, user, setactiveChatFriend }) => {


    const [anchorEl, setAnchorEl] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isActive, setIsActive] = useState(false)
    const [openAlertDialog, setOpenAlertDialog] = useState({
        open: false,
        dialogTitle: '',
        dialogText: '',
        action: ''
    })
    const [customName, setCustomName] = useState('')

    useEffect(() => {

        socket.on('active_user_typing', () => {
            setIsTyping(true)
        })
        socket.on('active_user_stopped_typing', () => {
            setIsTyping(false)
        })

        socket.on('active_chat_friend_updated_data', (data) => {
            setactiveChatFriend(data.activeChatFriend)
        })

    }, [socket])

    useEffect(() => {
        const docRef = doc(db, 'active-unichat-users', activeChatFriend.email)
        onSnapshot(docRef, (querySnapshot) => {
            if (querySnapshot.data()) {
                setIsActive(true)
            } else {
                setIsActive(false)
            }
        })
    }, [activeChatFriend])

    const handleCustomNameSave = () => {
        if (customName && customName !== activeChatFriend.name) {
            socket.emit('edit_user_name', {
                user: user.email,
                targetUser: activeChatFriend.email,
                newName: customName
            })
        }
        setAnchorEl(null)
        setCustomName('')
    }


    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <div className="message-section-header">

                <div className="header-chat-user">
                    <Avatar src={activeChatFriend.photoURL ? activeChatFriend.photoURL : "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"} />
                    <span className='header-chat-user-details' >
                        <span className="chat-user-name"> {activeChatFriend.name} </span>
                        {
                            isTyping ? <span className="chat-user-active-status"> Typing... </span> : <span className="chat-user-active-status"> {isActive ? 'Online' : ""} </span>
                        }
                    </span>

                </div>

                <div className="header-chat-options">

                    <Tooltip title='Close Chat' >
                        <IconButton onClick={() => setactiveChatFriend(null)} >
                            <CloseIcon />

                        </IconButton>
                    </Tooltip>


                    <Tooltip title='More Options' >
                        <IconButton onClick={handleMenu} >
                            <MoreVertRoundedIcon />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}

                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingY: '0.75rem',
                            paddingX: '1.5rem'
                        }} >
                            <Avatar sx={{ width: 130, height: 130 }} src={activeChatFriend.photoURL ? activeChatFriend.photoURL : "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"} />
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginY: '10px'
                        }}>
                            <input type="text" className='chat-user-name-input' placeholder={`Edit ${activeChatFriend.name.split(' ')[0]}'s Name`} value={customName} onChange={(e) => setCustomName(e.target.value)} />
                        </Box>

                        <MenuItem
                            sx={{
                                fontSize: '15px'
                            }}
                            onClick={() => setOpenAlertDialog({ open: true, dialogTitle: 'Clear Chat', dialogText: `Clearing chat will delete all your messages with ${activeChatFriend.name}.`, action: 'clear_chat' })}
                        >
                            Clear Chat
                        </MenuItem>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginY: '10px',
                            marginX: '10px'
                        }}>
                            <Button size='small' onClick={handleCustomNameSave} > Save </Button>
                            <Button size='small' onClick={handleClose} > Cancel </Button>
                        </Box>
                    </Menu>
                </div>
            </div>
            <AlertDialog open={openAlertDialog} setOpen={setOpenAlertDialog} setAnchorEl={setAnchorEl} />
        </>
    )
}




const SendSection = ({ activeChatFriend, user, socket }) => {

    const [messageText, setMessageText] = useState('')
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)

    const onEmojiClick = (event, emojiObject) => {
        setMessageText(messageText + emojiObject.emoji)
    };




    const sendMessage = async (event) => {
        event.preventDefault()

        if (messageText) {
            const messageData = {
                sender: user.email,
                message: messageText,
                room: formatRoomName(user.email, activeChatFriend.email),
                receiver: activeChatFriend.email,
            }
            try {
                await socket.emit("send_message", messageData)
                setMessageText('')

            } catch (error) {
                setMessageText('')
                alert('Some error occured while sending the message.')
            }
        }

    }


    useEffect(async () => {
        try {
            if (messageText.length > 0) {
                await socket.emit('user_typing', {
                    room: formatRoomName(user.email, activeChatFriend.email),
                    user: user.email
                })
            } else {
                await socket.emit('user_stopped_typing', {
                    room: formatRoomName(user.email, activeChatFriend.email),
                    user: user.email
                })
            }
        } catch (error) {
            console.log(error);
        }
        return () => {

        }
    }, [messageText])


    return (
        <div className="message-section-send-message-box">

            {
                showEmojiPicker ? <div className="emoji-picker-container">

                    <Tooltip title='Close' >
                    <IconButton onClick={()=>setShowEmojiPicker(false)} >
                        <CloseRoundedIcon style={{
                            color:'white'
                        }} />
                    </IconButton>
                    </Tooltip>

                    <Picker onEmojiClick={onEmojiClick} pickerStyle={{
                        width: '300px',
                        boxShadow: 'none'
                    }} />
                </div> : <></>
            }

            <div className="footer-option">

                <Tooltip title='Emojis' >
                    <IconButton size='small' className='emoji-icon' onClick={() => setShowEmojiPicker(!showEmojiPicker)} >
                        <EmojiEmotionsRoundedIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip title='Attach Files' >
                    <IconButton size='small'>
                        <AttachFileRoundedIcon />
                    </IconButton>
                </Tooltip>
            </div>

            <form className="footer-input-container" onSubmit={sendMessage}>

                <input
                    type="text"
                    className='message-input'
                    placeholder='Type a message'
                    onChange={(e) => setMessageText(e.target.value)}
                    value={messageText}
                    autoFocus
                />

                <Tooltip title='Send' >
                    <IconButton size='medium' className='send-icon' type='submit' >
                        <SendRoundedIcon />
                    </IconButton>
                </Tooltip>
            </form>


        </div>
    )



}

export default MessageSection
