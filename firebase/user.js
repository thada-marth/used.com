import {auth, firestore} from './firebase'

const onLogin = async (callback) => {
    auth.onAuthStateChanged(async (user) => {
        if(user){
            const uid = user.uid;
            const userLogin = await getUserByUid(uid);
            callback(userLogin);
        }else{
            callback(null);
        }
    })
}

const getUserByUid = async (uid) => {
    const user = await firestore.collection('user').doc(uid).get();
    if(user.data()){
        return await user.data();
    }else{
        return null;
    }
}

const searchUserByEmail = async (email) => {
    const user = await firestore.collection('user').where("email", "==" , email).limit(1).get();
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