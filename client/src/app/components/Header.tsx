"use client"
import React, { FC, useState, useEffect } from 'react'
import NavItems from '../utils/NavItems'
import Image from 'next/image'
import ThemeSwitcher from '../utils/ThemeSwitcher'
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from 'react-icons/hi'
import CustomModal from '../utils/CustomModal'
import Login from './Auth/Login'
import Signup from './Auth/Signup'
import Verification from './Auth/Verification'

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    activeItem: number
    route: string,
    setRoute: (route: string) => void
}

const Header: FC<Props> = ({ activeItem, setOpen, route, setRoute, open }) => {
    const [active, setActive] = useState(false)
    const [openSidebar, setOpenSidebar] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setActive(window.scrollY > 80)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])
    const handleClose = (e: any) => {
        if (e.target.id === "screen") {
            setOpenSidebar(false)
        }
    }
    return (
        <header className='w-full relative'>
            <nav className={`${active ? "dark:opacity-50 dark:bg-gradient-b dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] dark:border-[#fffff] shadow-xl transition duration-500" : "w-full border-b dark:border[#ffff1c] h-[80px] z-[80px]"}`}>
                <div className='w-[95%] 800px:w-[92%] m-auto py-2 h-full'>
                    <div className='w-full h-[80px] flex items-center justify-between p-3'>
                        <a href={"/"} className='text-[25px] font-poppins font-[500] text-black dark:text-white'>
                            <Image src={"/Logo.png"} alt='Learn-Vista-Logo' height={60} width={60} />
                            {/* Learn-Vista */}
                        </a>

                        <div className='flex items-center gap-4'>
                            <div className='hidden 800px:flex items-center gap-4'>
                                <NavItems activeItem={activeItem} isMobile={false} />
                                <ThemeSwitcher />
                            </div>

                            <div className='flex 800px:hidden items-center gap-4'>
                                <ThemeSwitcher />
                                <HiOutlineMenuAlt3
                                    size={25}
                                    className='cursor-pointer dark:text-white text-black'
                                    onClick={() => setOpenSidebar(true)}
                                />

                            </div>
                            <HiOutlineUserCircle
                                size={25}
                                className='hidden 800px:block cursor-pointer dark:text-white text-black'
                                onClick={() => setOpen(true)}
                            />
                        </div>
                    </div>
                </div>
            </nav>
            {
                openSidebar && (
                    <div
                        id='screen'
                        className='fixed w-full h-screen top-0 left-0 z-[999] bg-[#00000024] dark:bg-[unset]'
                        onClick={handleClose}
                    >
                        <div
                            className="w-[70%] fixed z-[999999] h-screen  bg-white dark:bg-slate-900 dark:opacity-90 top-0 right-0 flex flex-col justify-between p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col gap-4">

                                <NavItems activeItem={activeItem} isMobile={true} />
                                <HiOutlineUserCircle
                                    size={25}
                                    className='cursor-pointer dark:text-white text-black mt-4'
                                    onClick={() => setOpen(true)}
                                />
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-auto'>
                                Copyright © 2025 Learn-Vista
                            </p>
                        </div>
                    </div>
                )
            }

            {
                route === "Login" && (
                    <>
                        {
                            open && (
                                <CustomModal
                                    open={open}
                                    setopen={setOpen}
                                    setRoute={setRoute}
                                    activeItem={activeItem}
                                    component={Login}
                                />
                            )
                        }
                    </>
                )
            }
            {
                route === "Sign-Up" && (
                    <>
                        {
                            open && (
                                <CustomModal
                                    open={open}
                                    setopen={setOpen}
                                    setRoute={setRoute}
                                    activeItem={activeItem}
                                    component={Signup}
                                />
                            )
                        }
                    </>
                )
            }
            {
                route === "Verification" && (
                    <>
                        {
                            open && (
                                <CustomModal
                                    open={open}
                                    setopen={setOpen}
                                    setRoute={setRoute}
                                    activeItem={activeItem}
                                    component={Verification}
                                />
                            )
                        }
                    </>
                )
            }
        </header>
    )
}

export default Header
