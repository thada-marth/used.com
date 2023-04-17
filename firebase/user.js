import {auth, firestore} from './firebase'

const onLogin = async (callback) => {
    auth.onAuthStateChanged(async (users) => {
        if(users){
            const uid = users.uid;
            const userLogin = await getUserByUid(uid);
            callback(userLogin);
        }else{
            callback(null);
        }
    })
}

const getUserByUid = async (uid) => {
    const user = await firestore.collection('users').doc(uid).get();
    if(user.data()){
        return await user.data();
    }else{
        return null;
    }
}

const searchUserByEmail = async (email) => {
    const user = await firestore.collection('users').where("email", "==" , email).limit(1).get();
    if(user.size > 0){
        return await user.docs[0].data();
    }else{
        return null;
    }
}

module.exports ={
    onLogin,
    getUserByUid,
    searchUserByEmail
}