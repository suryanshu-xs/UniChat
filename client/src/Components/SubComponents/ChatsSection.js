import React, { useState } from 'react'
import List from '@mui/material/List';
import ChatsHeader from './ChatsHeader';
import SearchAutocomplete from './SearchAutocomplete';
import { ChatListItem } from './ChatList';

const ChatsSection = ({friendsList,setFriendsList}) => {

    
    return (
        <div className='chats-section' >

            <List >
                <ChatsHeader />
                <SearchAutocomplete friendsList={friendsList} />
                <ChatListItem friendsList={friendsList} setFriendsList={setFriendsList}  />
            </List>

        </div>
    )
}




export default ChatsSection
