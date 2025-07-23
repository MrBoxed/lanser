import { useScroll } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Login } from './Login';


export const getToken = () => localStorage.getItem("auth_token");

export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
};

export default function AuthPage() {


    return (
        <div className='w-full h-full flex p-4 justify-center'>

            <div className='w-[70%] h-[80%] bg-white/20 rounded-2xl flex'>
                {
                    <Login />
                }

            </div>

        </div >
    )
}