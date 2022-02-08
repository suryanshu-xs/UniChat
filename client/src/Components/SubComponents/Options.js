import { Avatar, TextField } from '@mui/material'
import React, { useContext } from 'react'
import { UserContext } from '../../App'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useState } from 'react';
import { useEffect } from 'react';
import themes from '../../Data/themesData';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { SocketContext } from '../Home';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import '../../Styles/about.css'



const Input = styled('input')({
    display: 'none',
});

const Account = ({ file, setFile, setEditedName }) => {

    const [user] = useContext(UserContext)
    const [url, setUrl] = useState(user.photoURL ? user.photoURL : 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png')



    useEffect(() => {
        if (file) {
            setUrl(URL.createObjectURL(file));
        }
    }, [file])



    return (
        <div className='account-settings-container' >

            <div className="profile_pic_container">
                <Avatar src={url}
                    sx={{
                        width: 260,
                        height: 260

                    }}

                />
                <label htmlFor="icon-button-file" className='upload-icon-button' >
                    <Input accept="image/*" id="icon-button-file" type="file" onChange={(e) => setFile(e.target.files[0])} />
                    <IconButton style={{
                        color: '#ff0090'
                    }} aria-label="upload picture" component="span">
                        <PhotoCamera />
                    </IconButton>
                </label>
            </div>

            <TextField id="outlined-basic" label="Change Name" variant="outlined" className='your-name-edit' onChange={(e) => setEditedName(e.target.value)} />

        </div>
    )
}


const Themes = () => {

    const socket = useContext(SocketContext)
    const [user] = useContext(UserContext)

    const setBackgroundLink = (link) => {
        socket.emit('setTheme', {
            user: user.email,
            link: link
        })
    }
    return (
        <div className='themes-container' >
            {
                themes.map(({ name, link, chatImage, addChatImage }, index) => <div className="theme-container" key={index}>
                    <div className="theme-heading" >
                        <IconButton size='small' onClick={() => setBackgroundLink(link)}  >

                            {
                                user.backgroundLink === link ? <CheckCircleRoundedIcon style={{
                                    color: '#06d136'
                                }} /> : <CircleOutlinedIcon />
                            }
                        </IconButton>
                        <span>{name}</span>
                    </div>
                    <div className="theme-body">
                        <img src={addChatImage} className='theme-body-image-1' alt="" />
                        <img src={chatImage} className='theme-body-image-2' alt="" />
                    </div>

                </div>)
            }
        </div>
    )
}

const AboutUs = () => {

    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const socket = useContext(SocketContext)



    const sendMessage = (event) => {
        event.preventDefault()
        socket.emit('sendMessageToMe',{
            email:email,
            message:message
        })
        setEmail('')
        setMessage('')
        
    }

    return (
        <div className='about-page' >
            <h1 className='about-page-heading' > About UniChat </h1>

            <div className="about-info-container">

                <div className="about-div">
                    <p className="about-info-text">
                        UniChat is a free to use instant messaging service. It's a safe and secure text transmission protocol. You can add users to your chatlist by just knowing their emails. Your account can never be compromised as UniChat never saves your password. This can backfire as well, so please keep your passwords safe and secure.
                    </p>
                    <p className="about-more-info">
                        For any support or business related queries please fill the contact form and send your message to us.
                    </p>
                    <p className="thank-you">
                        Thank You
                    </p>
                    <p className="designed-by">
                        Designed By ,
                    </p>
                    <div className="designer-name-email">
                        <span className='designer-name' >
                            Suryanshu
                        </span>
                        <span className='designer-email' >
                            Email - suryanshu06032003@gmail.com
                        </span>
                    </div>
                </div>
                <div className="contact-div">
                    <h2 className='contact-div-heading' > Contact Us </h2>
                    <form action="" className='contact-form' onSubmit={sendMessage} >

                        <input type="email" name="email" placeholder='Your Email' value={email} required onChange={(e) => setEmail(e.target.value)}  />

                        <textarea name="message-text-area" id="" cols="30" rows="10" required placeholder='Message' value={message} onChange={(e) => setMessage(e.target.value)} ></textarea>

                        <div className="btn-container-form">
                            <Button variant='contained' type='submit' >Send</Button>
                        </div>
                    </form>

                </div>


            </div>

        </div>
    )
}


export { Account, Themes, AboutUs }

