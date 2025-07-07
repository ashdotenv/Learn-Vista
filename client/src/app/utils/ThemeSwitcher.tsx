"use client"
import { useTheme } from 'next-themes'
import React, { useEffect } from 'react'
import { BiMoon, BiSun } from 'react-icons/bi'


const ThemeSwitcher = () => {
    const [mounted, setMounted] = React.useState(false)
    const { theme, setTheme } = useTheme()
    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) null
    return (
        <>
            <div className="flex items-center justify-center mx-4">
                {theme === "light" ? (
                    <BiMoon
                        className="cursor-pointer"
                        color="black"
                        onClick={() => setTheme("dark")}
                        size={25}
                    />
                ) : (
                    <BiSun
                        className="cursor-pointer"
                        color="white"
                        onClick={() => setTheme("light")}
                        size={25}
                    />
                )}
            </div>

        </>
    )
}

export default ThemeSwitcher