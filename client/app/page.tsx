"use client"
import React, { FC, useState } from 'react'
import Heading from './utils/Heading'
import Header from './components/Header'

interface Props {

}

const page: FC<Props> = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [activeItems, setActiveItems] = useState<number>(0)

  return (
    <>
      <Heading
        title="Learn-Vista Code Create Conquer"
        description="A learning platform for students to unlock their potential"
        keywords="Programming, Development, Design, Web, Learning, Coding, Students"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItems}
      />
    </>
  )
}

export default page