import React, { useState, useEffect } from 'react'
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Avatar } from '@mui/material';
import { UserContext } from '../../App';
import { useContext } from 'react';
import { ActiveChatFriendContext } from '../Home';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../Data/config';

const ChatList = ({ setOpenDrawers,friendsList, setFriendsList  }) => {



    return (
        <div onClick={() => setOpenDrawers({
            optionsDrawer: false,
            chatsDrawer: false
        })}
            onKeyDown={() => setOpenDrawers({
                optionsDrawer: false,
                chatsDrawer: false
            })} className='chatlist-container' >

            <ChatListItem friendsList={friendsList} setFriendsList={setFriendsList} />


        </div>
    )
}

const ChatListItem = ({ friendsList, setFriendsList }) => {

    const [activeChatFriend, setactiveChatFriend] = useContext(ActiveChatFriendContext)
    const [activeuserslist, setactiveuserslist] = useState([])



    const [user] = useContext(UserContext)
    const user_online_dot = {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'green'
    }

    const handleChatFriendClick = (activeChatFriend) => {
        setactiveChatFriend(activeChatFriend);
    }

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'unichat-react-users', user.email), querySnapshot => {
            setFriendsList(querySnapshot.data().friends)

        })

        return unsub
    }, [activeChatFriend])

    useEffect(() => {

        const unsub = onSnapshot(collection(db, 'active-unichat-users'), querySnapshot => {
            let temp = []
            querySnapshot.forEach((doc) => {
                friendsList.map((user) => {
                    if (user.email === doc.data().user) {
                        temp.push(doc.data().user)
                    }
                })
            })
            setactiveuserslist(temp)
        })
        return unsub

    }, [friendsList])


    return (
        <>
            {
                friendsList ? friendsList.map((friend, index) => (
                    <ListItem button key={index} onClick={() => handleChatFriendClick(friend)} >
                        <Avatar src={friend.photoURL ? friend.photoURL : 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png'} sx={{ mr: 1 }} />
                        <ListItemText primary={friend.name} />

                        {
                            activeuserslist.includes(friend.email) ? <span style={user_online_dot} ></span> : null
                        }

                    </ListItem>
                )) : null
            }

        </>
    )
}

export default ChatList
export { ChatListItem }
