import React, { createContext, useState } from 'react'
import LoginOrSignup from './Components/LoginOrSignup'
import SimpleSnackbar from './Components/SubComponents/Snakbars'
import Home from './Components/Home'


const OpenSnackbarContext = createContext()
const UserContext = createContext()



const App = () => {


  const [snackBarData, setSnackBarData] = useState({ open: false, message: '' })
  const [user, setuser] = useState(null)

  return (
    <>
      <OpenSnackbarContext.Provider value={setSnackBarData} >
        <UserContext.Provider value={[user, setuser]} >

          {
            user ? <Home /> : <LoginOrSignup />
          }

        </UserContext.Provider>
      </OpenSnackbarContext.Provider>


      <SimpleSnackbar open={snackBarData.open} setSnackBarData={setSnackBarData} message={snackBarData.message} />
    </>
  )
}

export { OpenSnackbarContext, UserContext }
export default App
