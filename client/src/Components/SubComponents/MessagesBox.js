import React, { useEffect, useRef } from 'react'
import { formatMessageTime } from '../../Data/functions'

const MessagesBox = ({ messageArray, user }) => {

    const scrollRef = useRef()

    useEffect(() => {
        
        scrollRef.current?.scrollIntoView()
        
    }, [messageArray])

    

    return (
        <div className='message-section-message-box'  >
    
                <div className="message-wrapper"    >

                    {
                        messageArray.map((messageData, index) => {
                            return <div ref={scrollRef}  key={index} className={`${messageData.sender === user.email ? 'sender' : 'receiver'} message-container `}  >

                                <p className={`${messageData.sender === user.email ? 'message-sender' : 'message-receiver'} message-text `} >  {messageData.message} </p>
                                <span className='message-timestamp' > {formatMessageTime(messageData.createdAt)} </span>


                            </div> 

                        })
                    }
                </div>

        </div>
    )
}
















const tempMessages = [
    {
        sender: 'sahil@gmail.com',
        message: 'Hey Suryanshu',
    },
    {
        sender: 'suryanshu@gmail.com',
        message: 'Hey Bro!'
    },
    {
        sender: 'sahul@gmail.com',
        message: "How's Life",

    },

]




export default MessagesBox
