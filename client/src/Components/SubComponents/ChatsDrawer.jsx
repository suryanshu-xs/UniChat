import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ChatList from './ChatList';

import ChatsHeader from './ChatsHeader';
import SearchAutocomplete from './SearchAutocomplete';

const ChatsDrawer = ({ openDrawers, setOpenDrawers,friendsList,setFriendsList }) => {



    return (


        <Drawer
            anchor='left'
            open={openDrawers.chatsDrawer}
            onClose={() => setOpenDrawers({ optionsDrawer: false, chatsDrawer: false })}
        >
            <div className='chats-drawer-box'>
                <List >
                    <ChatsHeader />
                    <SearchAutocomplete friendsList={friendsList} />
                    <ChatList setOpenDrawers={setOpenDrawers} friendsList={friendsList} setFriendsList={setFriendsList} />
                </List>

            </div>
        </Drawer>



    );
}

export default ChatsDrawer