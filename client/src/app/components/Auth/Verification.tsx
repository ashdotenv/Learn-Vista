"use client"
import { styles } from '@/app/styles/styles'
import { useActivationMutation } from '@/redux/features/auth/authApi';
import React, { FC, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from 'react-redux';

type Props = {
    setRoute: (route: string) => void
}

type VerifyNumber = {
    [key: string]: string
}

const Verification: FC<Props> = ({ setRoute }) => {
    const { token } = useSelector((state: any) => state.auth)
    const [activate, { isSuccess, error, isError, data }] = useActivationMutation()
    const [invalidError, setInvalidError] = useState<boolean>(false)
    useEffect(() => {
        if (!isSuccess) {
            toast.success("Account Activated Successflly")
            setRoute("Login")
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any
                toast.error(errorData.data.message)
            } else {
                console.error(error);
            }
        }
    }, [])
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ]

    const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
        "0": "",
        "1": "",
        "2": "",
        "3": ""
    })

    const verificationHandler = async () => {
        const verificationNumber = Object.values(verifyNumber).join("")
        if (verificationNumber.length !== 4) {
            return setInvalidError(true)
            
        }
        await activate({
            activation_token: token,
            activation_code: verificationNumber
        })
    }

    const handleInputChange = (index: number, value: string) => {
        setInvalidError(false)
        const newVerifyNumber = { ...verifyNumber, [index]: value }
        setVerifyNumber(newVerifyNumber)

        if (value === "" && index > 0) {
            inputRefs[index - 1].current?.focus()
        } else if (value.length === 1 && index < 3) {
            inputRefs[index + 1].current?.focus()
        }
    }

    return (
        <div>
            <h1 className={styles.title}>
                Verify your Account
            </h1>
            <br />
            <div className=' w-full flex items-center justify-center mt-2'>
                <div className='w-[80px] rounded-full h-[80px] rounded-fulll bg-[#497DF2]  flex items-center justify-center' >
                    <VscWorkspaceTrusted size={40} />
                </div>
            </div>
            <br /><br />
            <div className='m-auto flex items-center justify-around'>
                {Object.keys(verifyNumber).map((key, index) => (
                    <input
                        type='number'
                        inputMode='numeric'
                        key={key}
                        ref={inputRefs[index]}
                        className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black dark:text-white justify-center text-[18px] font-Poppins outline-none text-center
                            ${invalidError ? 'shake border-red-500' : "dark:border-white border-black"}
                            `}
                        maxLength={1}
                        value={verifyNumber[key as keyof VerifyNumber]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                ))}
            </div>
            <br />
            <div className=' w-full flex justify-center'>
                <button
                    className={styles.button}
                    onClick={verificationHandler}
                >
                    Verify OTP
                </button>
            </div>
            <br />
            <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
                Go back to sign in ?
                <span className='text-sky-500 pl-1 cursor-pointer'
                    onClick={() => setRoute("Login")}
                >
                    Login
                </span>
            </h5>
        </div>
    )
}

export default Verification
