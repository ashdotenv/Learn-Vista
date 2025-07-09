"use client"
import React, { FC, useEffect, useState } from 'react'
import * as Yup from "yup"
import { useFormik } from "formik"
import { styles } from '@/app/styles/styles'
import { AiFillGithub, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { useRegisterMutation } from '@/redux/features/auth/authApi'
import toast from 'react-hot-toast'
type Props = {
    setRoute: (route: string) => void
}

const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Please Enter your Email"),
    name: Yup.string().required("Please Enter your Email"),
    password: Yup.string().required("Please Enter your password").min(6)
})

const Signup: FC<Props> = ({ setRoute }) => {
    const [show, setShow] = useState(false)
    const [register, { data, isSuccess, error }] = useRegisterMutation()
    const formik = useFormik({
        initialValues: { name: "", email: "", password: "" },
        validationSchema: loginSchema,
        onSubmit: async ({ name, email, password }) => {
            const data = { name, email, password }
            const d = await register(data)
        }
    })
    useEffect(() => {
        if (isSuccess) {
            const message = data?.message || "Registration Successful"
            toast.success(message)
            setRoute("Verification")
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any
                toast.error(errorData.data.message)
            }
        }
    }, [isSuccess, error])
    const { errors, touched, values, handleSubmit, handleChange } = formik
    return (
        <>
            <div className="w-full">
                <h1 className={`${styles.title}`}>
                    <span className='text-bold'>Join Learn Vista</span>
                </h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name" className={styles.label} >Enter your name</label>
                    <input type="name"
                        name='name'
                        value={values.name}
                        id='name'
                        onChange={handleChange}
                        placeholder='John Doe'
                        className={`${errors.name && touched.name && "border-red-500"} ${styles.input} `}
                    />
                    {
                        errors.name && touched.name && (
                            <span className='text-red-500 pt-2 block'>
                                {errors.name}
                            </span>)
                    }
                    <label htmlFor="email" className={styles.label} >Enter your email</label>
                    <input type="email"
                        name='email'
                        value={values.email}
                        id='email'
                        onChange={handleChange}
                        placeholder='john.doe@gmail.com'
                        className={`${errors.email && touched.email && "border-red-500"} ${styles.input} `}
                    />
                    {
                        errors.email && touched.email && (
                            <span className='text-red-500 pt-2 block'>
                                {errors.email}
                            </span>)
                    }
                    <div className='w-full mt-5 relative mb-1'>
                        <label htmlFor=""
                            className={styles.label}
                        >Enter your password</label>

                        <input type={!show ? "password" : "text"}
                            name='password'
                            value={values.password}
                            onChange={handleChange}
                            id='password'
                            placeholder='Enter your password'
                            className={`${errors.password && touched.password && "border-red-500"} ${styles.input}`}
                        />

                        {
                            !show ? (
                                <AiOutlineEyeInvisible
                                    className='absolute top-[44px] right-2 z-10 cursor-pointer'
                                    size={20}
                                    onClick={() => setShow(true)}
                                />
                            ) : (
                                <AiOutlineEye
                                    className='absolute top-[44px] right-2 z-10 cursor-pointer'
                                    size={20}
                                    onClick={() => setShow(false)}
                                />
                            )
                        }

                        {errors.password && touched.password && (
                            <span className='text-red-500 pt-2 block'>
                                {errors.password}
                            </span>
                        )}

                        <div className="w-full mt-5">
                            <button type="submit"  className={styles.button}>Signup</button>
                        </div>
                    </div>

                    <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                        Or Join with
                        <div className="flex items-center justify-center my-3">
                            <FcGoogle size={30} className="cursor-pointer my-3" />
                            <AiFillGithub size={30} className="cursor-pointer my-3" />
                        </div>
                    </h5>
                    <h5>
                        Already have an account ?
                        <span onClick={() => setRoute("Login")} className="text-sky-500 pl-1 cursor-pointer">
                            Login
                        </span>
                    </h5>
                </form>
            </div>
            <br />

        </>
    )
}

export default Signup