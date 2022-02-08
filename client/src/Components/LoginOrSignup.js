import React, { useState, useContext } from 'react'
import '../Styles/LoginOrSignup.css'
import Logo from '../Images/logo.png'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { Button } from '@mui/material';
import { signupUser,loginUser } from '../Data/functions';
import { OpenSnackbarContext,UserContext } from '../App';




const LoginOrSignup = () => {

   

    const [loginSelected, setLoginSelected] = useState(true);
    return (
        <div className='login-or-signup-component' >
            {
                loginSelected ? <Login setLoginSelected={setLoginSelected} /> : <SignUp setLoginSelected={setLoginSelected} />
            }
        </div>
    )
}

const iconStyles = {
    color: '#5e5e5e',
    marginRight: 10,

}

const Login = ({ setLoginSelected }) => {

    document.title = 'UniChat | Login'
    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const setSnackBarData = useContext(OpenSnackbarContext)
    const [user,setUser] = useContext(UserContext)


    return (
        <div className='login-container' >
            <LogoContainer />
            <h1 className='login-signup-heading' >Login</h1>

            <form action="" className='login-signup-form' onSubmit={(event)=>loginUser(event,data,setSnackBarData,setData,setUser)} >
                <div className="login-signup-input-container">

                    <EmailRoundedIcon style={iconStyles} />
                    <input
                        type="email"
                        placeholder='Your Email'
                        className='login-signup-input'
                        value={data.email}
                        required
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                    />

                </div>

                <div className="login-signup-input-container">
                    <VpnKeyRoundedIcon style={iconStyles} />
                    <input
                        type="password"
                        placeholder='Your Password'
                        className='login-signup-input'
                        value={data.password}
                        required
                        onChange={(e) => setData({ ...data, password: e.target.value })}

                    />

                </div>

                <Button 
                type='submit'
                size="small" 
                sx={{
                    fontWeight: 600,
                    borderRadius: 20
                }}  >Login</Button>

            </form>

            <Button size='small' sx={{
                fontSize: 10,
                letterSpacing: 0.5,
                color: '#f2169a'

            }} onClick={() => setLoginSelected(false)} > Create Account </Button>
        </div>
    )
}

const SignUp = ({ setLoginSelected }) => {

    document.title = 'UniChat | SignUp'
    const setSnackBarData = useContext(OpenSnackbarContext)
    const [data, setData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [user,setUser] = useContext(UserContext)

    return (
        <div className='signup-container' >
            <LogoContainer />
            <h1 className='login-signup-heading'>Sign Up</h1>

            <form action="" className='login-signup-form signup-form' onSubmit={(event) => signupUser(event, data, setSnackBarData, setData,setUser)} >

                <div className="login-signup-input-container signup">
                    <PersonRoundedIcon style={iconStyles} />
                    <input
                        type="text"
                        placeholder='Your Name'
                        className='login-signup-input'
                        value={data.name}
                        required
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                    />

                </div>
                <div className="login-signup-input-container signup">
                    <EmailRoundedIcon style={iconStyles} />
                    <input
                        type="email"
                        placeholder='Your Email'
                        className='login-signup-input'
                        value={data.email}
                        required
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                    />


                </div>

                <div className="login-signup-input-container signup">
                    <LockRoundedIcon style={iconStyles} />
                    <input
                        type="password"
                        placeholder='Your Password'
                        className='login-signup-input'
                        value={data.password}
                        required
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                    />

                </div>
                <div className="login-signup-input-container signup">
                    <LockRoundedIcon style={iconStyles} />
                    <input
                        type="password"
                        placeholder='Confirm Password'
                        className='login-signup-input'
                        value={data.confirmPassword}
                        required
                        onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                    />

                </div>

                <Button
                    type='submit'
                    size="small"
                    sx={{
                        fontWeight: 600,
                        borderRadius: 20
                    }} >Sign up</Button>

            </form>

            <Button
                type='submit'
                size='small'
                sx={{
                    fontSize: 10,
                    letterSpacing: 0.5,
                    color: '#f2169a'

                }} onClick={() => setLoginSelected(true)} > Login Instead </Button>
        </div>
    )
}


const LogoContainer = () => (<div className='logo-container' >
    <img src={Logo} alt="" className='logo-container-img' />

</div>)


export default LoginOrSignup
