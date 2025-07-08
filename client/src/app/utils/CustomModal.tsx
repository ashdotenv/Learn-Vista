"use client"
import React, { FC } from 'react'
import { Box, Modal } from "@mui/material"
type Props = {
    open: boolean
    setopen: (open: boolean) => void
    activeItem: number,
    component: any
    setRoute?: (route: string) => void
}

const CustomModal: FC<Props> = ({ open, activeItem, setopen, setRoute, component: Component }) => {
    return (
        <>
            <Modal
                open={open}
                onClose={() => setopen(false)}
                aria-labeledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="absolute top-[50%] left-[50%] -translate-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none"  >
                    <Component setOpen={true} setRoute={setRoute} />
                </Box>

            </Modal>

        </>
    )
}

export default CustomModal