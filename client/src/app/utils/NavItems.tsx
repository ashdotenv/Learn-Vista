import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react'

interface Props {
    activeItem: number
    isMobile: boolean
}
const navItemsData = [
    {
        name: "Home",
        url: "/",
    },
    {
        name: "Courses",
        url: "/courses",
    },
    {
        name: "About",
        url: "/about",
    },
    {
        name: "Policy",
        url: "/policy",
    },
    {
        name: "FAQ",
        url: "/faq",
    },
];

const NavItems: FC<Props> = ({ activeItem, isMobile }) => {
    return (
        <>
            {isMobile && (
                <div className="w-full flex text-center py-6">
                    <Link href={"/"} passHref>
                        <span className={'text-[25px] font-Poppins font-[500] text-black dark:text-white'}>
                            <Image src={"/Logo.png"} height={180} width={80} alt='Learn-Vista-Logo' />
                        </span>
                    </Link>
                </div>
            )}
            {
                navItemsData && navItemsData.map((item, index) => (
                    <Link key={index} href={item.url} passHref>
                        <span
                            className=
                            {`${activeItem === index ? "dark:text-[#37a39a] text-[crimson]"
                                : "dark:text-white text-black"} text-[18px] px-6 font-Poppins font-[400] `} >
                            {item.name}
                        </span>
                    </Link>
                ))
            }
        </>
    )
}

export default NavItems