import React, { FC } from 'react'

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    activeItem: number
}

const Header: FC<Props> = () => {
    return (
        <div>Header</div>
    )
}

export default Header