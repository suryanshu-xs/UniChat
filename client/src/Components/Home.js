import React, { useState, useEffect, useContext, createContext } from 'react'
import '../Styles/Home.css'
import HomePageHeader from './SubComponents/HomepageHeader'
import OptionsDrawer from './SubComponents/OptionsDrawer'
import ChatsDrawer from './SubComponents/ChatsDrawer'
import ChatsSection from './SubComponents/ChatsSection'
import MessageSection from './SubComponents/MessageSection'
import NoChatsSelected from './SubComponents/NoChatsSelected'
import { io } from 'socket.io-client'
import { UserContext, OpenSnackbarContext } from '../App'
import { formatRoomName } from '../Data/functions'




const RoomContext = createContext()
const ActiveChatFriendContext = createContext()
const SocketContext = createContext(io.connect('https://unichat-node-deploy.herokuapp.com/'))


const Home = () => {

    const [room, setroom] = useState(null)
    const [activeChatFriend, setactiveChatFriend] = useState(null)
    const [user] = useContext(UserContext)
    const setSnackBarData = useContext(OpenSnackbarContext)
    const [friendsList,setFriendsList] = useState([])


    useEffect(() => {

        if (user) {
            SocketContext._currentValue.emit('user_connected', {
                user: user.email,
            })
            document.title = `UniChat - ${user.name}`
        }
    

    }, [user,SocketContext._currentValue]);


    useEffect(() => {
        (
            SocketContext._currentValue.on('receive_server_message', (data) => {
                setSnackBarData({ open: true, message: data.msessage })
            }))

    }, [SocketContext._currentValue])


    useEffect(() => {

        if (activeChatFriend && user) {
            SocketContext._currentValue.emit('join_room', formatRoomName(user.email, activeChatFriend.email))

            document.title = `UniChat - ${user.name} | ${activeChatFriend.name} `
        }
        if(!activeChatFriend){
            document.title = `UniChat - ${user.name}`
        }

    }, [activeChatFriend])


    const [openDrawers, setOpenDrawers] = useState({
        optionsDrawer: false,
        chatsDrawer: false
    })


    return (
        <RoomContext.Provider value={[room, setroom]} >
            <ActiveChatFriendContext.Provider value={[activeChatFriend, setactiveChatFriend]} >
                <SocketContext.Provider value={SocketContext._currentValue} >
                    <div className='home-page' >
                        <HomePageHeader setOpenDrawers={setOpenDrawers} />

                        <div className="home-body">

                            <ChatsSection friendsList={friendsList} setFriendsList={setFriendsList} />
                            {
                                activeChatFriend ? <MessageSection /> : <NoChatsSelected setOpenDrawers={setOpenDrawers} />
                            }

                        </div>

                    </div>


                    <OptionsDrawer openDrawers={openDrawers} setOpenDrawers={setOpenDrawers} />
                    <ChatsDrawer openDrawers={openDrawers} setOpenDrawers={setOpenDrawers} friendsList={friendsList} setFriendsList={setFriendsList} />
                </SocketContext.Provider>
            </ActiveChatFriendContext.Provider>
        </RoomContext.Provider>
    )
}

export default Home
export { ActiveChatFriendContext, RoomContext, SocketContext }
