import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import {  doc, onSnapshot, setDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { auth, db, storage } from "./config"





const signupUser = (event, data, setSnackBarData, setData, setUser) => {

    event.preventDefault()
    if (data.password !== data.confirmPassword) {
        setSnackBarData({ message: "Passwords didn't matched.", open: true })
        setData({ ...data, password: '', confirmPassword: '' })
        return
    }
    createUserWithEmailAndPassword(auth, data.email, data.password).then((userCredential) => {
        const user = userCredential.user
        const docRef = doc(db, 'unichat-react-users', user.email)
        setDoc(docRef, {
            friends: [],
            name: data.name,
            photoURL: '',
            email: user.email,
            backgroundLink:'https://cdn.hipwallpaper.com/i/60/39/9vsJ5D.png'
        }).then(() => {
            setSnackBarData({ message: `Account Created. Welcome ${data.name} `, open: true })
            signInWithEmailAndPassword(auth, data.email, data.password).then((userCredential) => {
                const docRef = doc(db, 'unichat-react-users', userCredential.user.email)
                onSnapshot(docRef,(doc)=>{
                    setUser(doc.data())
                })
            }).catch(() => {
                setSnackBarData({ message: "Login Failed. Please try again ", open: true })
                setUser(null)
        
            })
        }).catch(() => {
            setSnackBarData({ message: "Some Error Occured. Please Try Again ", open: true })
            setUser(null)
        })
    }).catch((error) => {
        setSnackBarData({ message: error.message, open: true })
        setUser(null)
    });
}

const loginUser = (event, data, setSnackBarData, setData, setUser) => {
    event.preventDefault()
    signInWithEmailAndPassword(auth, data.email, data.password).then((userCredential) => {
        const docRef = doc(db, 'unichat-react-users', userCredential.user.email)
        onSnapshot(docRef,(doc)=>{
            setUser(doc.data())
        })
    }).catch(() => {
        setSnackBarData({ message: "Login Failed. Please try again ", open: true })
        setUser(null)

    })
}

const formatRoomName = (emailOfSender, emailOfReceiver) => {
    if (emailOfSender.length > emailOfReceiver.length) {
        return `${emailOfSender.split('@')[0]}and${emailOfReceiver.split('@')[0]}`
    } else {
        return `${emailOfReceiver.split('@')[0]}and${emailOfSender.split('@')[0]}`
    }
}

const formatMessageTime = (time) => {
    
    const minutes = time.toDate().getMinutes()<10 ? `0${time.toDate().getMinutes()}` : time.toDate().getMinutes()

    const hours = time.toDate().getHours()<10 ? `0${time.toDate().getHours()}` : time.toDate().getHours()
    
    return `${hours}:${minutes}`
}

const getFormattedDate = () => {
    return `${new Date().getHours()}:${new Date().getMinutes()}`
}

const uploadProfilePicture = (file, user, setSnackBarData,setFile,socket) => {
    const storageRef = ref(storage, `unichat-react-users-profie-pics/${user.email}/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setSnackBarData({ open:true,message:'Upload is ' + Math.round(progress) + '% done' })
        },
        () => {
            setSnackBarData({ open:true,message:'Error occured while uploading profile picture.' })

        },
        () => {
            
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setFile(null)
                socket.emit('modify_profilePic',{
                    user:user.email,
                    photoURL:downloadURL
                })
            });
        }
    );
}


export { signupUser, loginUser, formatRoomName, formatMessageTime, getFormattedDate, uploadProfilePicture }