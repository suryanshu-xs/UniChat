import React, { useContext, useState } from 'react'
import Button from '@mui/material/Button';
import FormDialog from './Backdrop';
import { UserContext } from '../../App';

const NoChatsSelected = ({ setOpenDrawers }) => {
    const [openDialogue, setOpenDialogue] = useState(false)
    const [user] = useContext(UserContext)

    return (
        <>
            <div className='no-chat-selected-container' style={{
                backgroundImage: `url(${user.backgroundLink})`,
                flex: 1,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',


            }} >

                <h1 className='no-chat-selected-container-heading' > Select or Add New Chat </h1>

                <div className='no-chat-selected-container-btn-container' >
                    <Button variant='contained' size='small' onClick={() => setOpenDialogue(true)} > Add Chat </Button>

                    <Button
                        variant='contained'
                        size='small'
                        className='no-chat-selected-container-btn-container-openchats'
                        onClick={() => setOpenDrawers({
                            optionsDrawer: false,
                            chatsDrawer: true
                        })}
                    > Open Chats </Button>
                </div>

                <FormDialog openFormDialogue={openDialogue} setOpenFormDialogue={setOpenDialogue} />
            </div>

        </>
    )
}

export default NoChatsSelected
