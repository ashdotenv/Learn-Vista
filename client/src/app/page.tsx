"use client"
import React, { FC, useState } from 'react'
import Heading from './utils/Heading'
import Header from './components/Header'
import Hero from './components/Route/Hero'
interface Props {

}

const page: FC<Props> = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [activeItems, setActiveItems] = useState<number>(0)
  const [route, setRoute] = useState<string>("Login")

  return (
    <>
      <Heading
        title="Learn-Vista Code Create Conquer"
        description="A learning platform for students to unlock their potential"
        keywords="Programming, Development, Design, Web, Learning, Coding, Students"
      />
      <Header
        route={route}
        setRoute={setRoute}
        open={open}
        setOpen={setOpen}
        activeItem={activeItems}
      />
      <Hero />
    </>
  )
}

export default page