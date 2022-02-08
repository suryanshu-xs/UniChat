const db = require("./config");
const firebase = require('firebase')
require('firebase/firestore')



const loginUser = (data, activeUsers, socket) => {

    db.collection("active-unichat-users").doc(data.user).set({
        user: data.user,
        active: true
    })
        .then(() => {
            activeUsers.push({
                id: socket.id,
                user: data.user
            })

        })
        .catch(() => { });

}

const sendMessageToDatabase = (messageData) => {

    updatedData = { ...messageData, createdAt: firebase.firestore.Timestamp.now() }

    sendMessageToSenderDB(messageData.sender, messageData.receiver, updatedData)
    sendMessageToSenderDB(messageData.receiver, messageData.sender, updatedData)


}

const sendMessageToSenderDB = (targetUser, targetUserFriend, messageData) => {
    const messagesRef = db.collection('unichat-react-users').doc(targetUser).collection('messages').doc(targetUserFriend)
    messagesRef.update({
        messages: firebase.firestore.FieldValue.arrayUnion(messageData)

    })
}

const sendNotification = () => {

}

const addUserToChat = (email_of_user, name_of_user, email_of_target_user, socket) => {

    const docRef = db.collection("unichat-react-users").doc(email_of_target_user);
    docRef.get().then((doct) => {
        if (doct.exists) {

            const friendsRef = db.collection("unichat-react-users").doc(email_of_user);
            friendsRef.get().then((doc) => {

                if (!checkFriend(doc.data().friends, email_of_target_user, socket)) {
                    addNewUserToFriendsArray(email_of_user, name_of_user, doc.data().photoURL, email_of_target_user, doct.data().name, doct.data().photoURL, socket)
                }

            }).catch((error) => {
                console.log(error);
            })

        } else {
            emitMessage(socket, "User with this email doesn't exist.")
        }
    }).catch((error) => {
        emitMessage(socket, "Error occured while adding user.")
        console.log(error);
    });
}

const addNewUserToFriendsArray = (email_of_user, name_of_user, photoURL_of_user, email_of_target_user, name_of_target_user, photoURL_of_target_user, socket) => {
    const user_ref = db.collection("unichat-react-users").doc(email_of_user);
    user_ref.update({
        friends: firebase.firestore.FieldValue.arrayUnion({
            email: email_of_target_user,
            name: name_of_target_user,
            photoURL: photoURL_of_target_user,
            blocked: false,
            deleted: false
        })
    })

    db
        .collection("unichat-react-users")
        .doc(email_of_user)
        .collection("messages")
        .doc(email_of_target_user)
        .set({
            messages: []
        });
    emitMessage(socket, "User added to your chat list.")
    const target_user_ref = db.collection("unichat-react-users").doc(email_of_target_user);
    target_user_ref.update({
        friends: firebase.firestore.FieldValue.arrayUnion({
            email: email_of_user,
            name: name_of_user,
            photoURL: photoURL_of_user,
            blocked: false,
            deleted: false
        })
    })

    db
        .collection("unichat-react-users")
        .doc(email_of_target_user)
        .collection("messages")
        .doc(email_of_user)
        .set({
            messages: []
        });

}

const checkFriend = (arr, email_of_target_user, socket) => {


    for (let i = 0; i < arr.length; i++) {
        if (arr[i].email === email_of_target_user) {
            emitMessage(socket, "This user is already in your chat list.")
            return true
        }
    }
    return false



}

const emitMessage = (socket, msessage) => {
    socket.emit("receive_server_message", {
        msessage: msessage
    })
}

const clearChat = (user, targetUser, socket) => {
    db
        .collection("unichat-react-users")
        .doc(user)
        .collection("messages")
        .doc(targetUser)
        .set({
            messages: []
        });

    emitMessage(socket, ' Chat has been cleared. ')


}

const editUserName = ({ user, targetUser, newName }, socket) => {



    db
        .collection("unichat-react-users")
        .doc(user)
        .get().then((doc) => {
            // doc.data().friends
            const temp = doc.data().friends.map((friend) => {

                if (friend.email === targetUser) {

                    socket.emit("active_chat_friend_updated_data", {
                        activeChatFriend: { ...friend, name: newName }
                    })

                    return { ...friend, name: newName }
                } else {
                    return friend
                }
            })


            db
                .collection("unichat-react-users")
                .doc(user)
                .update({
                    friends: temp
                })

            emitMessage(socket, ' Name changed. ')





        }).catch(() => {
            emitMessage(socket, "Can't change name. Please try again.")
        });


}

const logoutUser = (activeUsers, socket, data) => {



    if (!data) {
        let temp = []
        activeUsers.map((activeUser) => {
            if (activeUser.id === socket.id) {
                db.collection("active-unichat-users").doc(activeUser.user).delete().then(() => { }).catch(() => { });
            } else {
                temp.push(data)
            }
        })
        activeUsers = temp
        socket.emit('receive_connected_users', temp)
    } else {
        let temp = []
        activeUsers.map((activeUser) => {
            if (activeUser.user === data.user) {
                db.collection("active-unichat-users").doc(data.user).delete().then(() => { }).catch(() => { });
            } else {
                temp.push(data)
            }
        })
        activeUsers = temp

    }


}

const modifyName = (user, editedName, socket) => {
    const docRef = db.collection("unichat-react-users").doc(user);

    docRef.update({
        name: editedName
    })
        .then(() => {
            emitMessage(socket, `Name updated to : ${editedName}`)
        })
        .catch(() => {
            emitMessage(socket, 'Error updating name. ')
        });
}

const modifyProfilePic = (user, photoURL, socket) => {
    const docRef = db.collection("unichat-react-users").doc(user);

    docRef.update({
        photoURL: photoURL
    })
        .then(() => {
            emitMessage(socket, 'Profile Pic Updated.')
            informFriends(user, photoURL)
        })
        .catch(() => {
            emitMessage(socket, ' Error updating profile pic. ')
        });

}

const informFriends = (user, photoURL) => {

    const docRef = db.collection('unichat-react-users').doc(user);
    docRef.get().then((doc) => {
        doc.data().friends.map((friend) => {
            updateProfilePicInFriendsArray(user, friend.email, photoURL)
        })
    }).catch((error) => {
        console.log("Error getting document:", error);
    });


}

const updateProfilePicInFriendsArray = (user, friendEmail, photoURL) => {


    const docRef = db.collection('unichat-react-users').doc(friendEmail);
    docRef.get().then((doc) => {
        let temp = []
        doc.data().friends.map((friend) => {
            if (friend.email === user) {
                temp.push({
                    blocked: friend.blocked,
                    email: friend.email,
                    deleted: friend.deleted,
                    photoURL: photoURL,
                    name: friend.name
                })
            } else {
                temp.push({
                    blocked: friend.blocked,
                    email: friend.email,
                    deleted: friend.deleted,
                    photoURL: friend.photoURL,
                    name: friend.name
                })
            }
        })
        const friendRef = db.collection("unichat-react-users").doc(friendEmail);

        friendRef.update({
            friends: temp
        })
            .then(() => {

            })
            .catch(() => {

            });
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

const setTheme = (user, link, socket) => {
    const docRef = db.collection("unichat-react-users").doc(user);

    docRef.update({
        backgroundLink: link
    })
        .then(() => {
            emitMessage(socket, 'Theme Changed')
        })
        .catch(() => {
            emitMessage(socket, "Can't Change Theme. ")
        });
}

const sendMessageToMe = (email,message,socket) => {

    db.collection("messages-to-me").add({
        email: email,
        message: message
    })
    .then(() => {
        emitMessage(socket, 'Message Sent, Thank You.')
    })
    .catch(() => {
        emitMessage(socket, "Can't send message.")
    });
}


module.exports = { sendMessageToDatabase, addUserToChat, clearChat, editUserName, logoutUser, loginUser, modifyName, modifyProfilePic, setTheme, sendMessageToMe,sendNotification }