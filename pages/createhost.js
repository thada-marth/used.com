import React from 'react'
import { useEffect, useState } from 'react'
import { onLogin } from '../firebase/user'

export default function createhost() {

    const [userLogin, setUserLogin] = useState(null);

    useEffect(() => {
        onLogin((users) => {
            if (users) {
                setUserLogin(users);
            } else {
                window.location.href = "/";
            }
        })
    }, [])
    
    return (
        <div>createhost</div>
    )
}
