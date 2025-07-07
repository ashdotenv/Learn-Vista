import React, { FC } from 'react'
import { Box, Modal } from "@mui/material"
type Props = {
    open: boolean
    setopen: (open: boolean) => void
    activeItem: string,
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
                <Box>
                    
                </Box>

            </Modal>

        </>
    )
}

export default CustomModal