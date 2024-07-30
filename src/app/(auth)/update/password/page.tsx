'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounceCallback } from 'usehooks-ts'
import { BadgeInfo, CheckCheck, TicketPlus } from "lucide-react"


import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

function page() {

    const [email, setEmail] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [emailMessageLoader, setEmailMessageLoader] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false)
    // const [enteredEmail, setEnteredEmail] = useState('')
    const { toast } = useToast()
    const router = useRouter();
    const debounced = useDebounceCallback(setEmail, 500)

    //ZOD
    const form = useForm({
        // resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
            otp: ''
        }
    })
    interface Data {
        email: string,
        otp: string,
        password: string
    }


    const onSubmit = async (data: Data) => {
        setIsSubmitting(true)
        //console.log('Data is', data)
        try {
            const response = await axios.post('/api/changepassword', data)
            toast({
                title: 'Sucessfull',
                description: response.data.message
            })

        } catch (error) {
            console.error('Error during changing password', error);
            const AxiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                variant: 'destructive',
                description: AxiosError.response?.data.message ?? 'Error during changing password'
            })

        } finally {
            setIsSubmitting(false)

        }

    }



    useEffect(() => {

        const checkEmail = async () => {
            if (email) {
                setEmailMessageLoader(true);
                setEmailMessage('')
                try {
                    const response = await axios.get(`/api/check-unique-email?email=${email}`);
                    //console.log(response)
                    setEmailMessage(response.data.message)
                    await axios.post('/api/sentPasswordOTP', { email })
                } catch (error) {
                    const AxiosError = error as AxiosError<ApiResponse>;
                    setEmailMessage(AxiosError.response?.data.message ?? 'Error checking emai.')
                } finally {
                    setEmailMessageLoader(false);
                }
            }



        }
        checkEmail();
    }, [email])

    return (
        <div className=" flex flex-col justify-center items-center h-screen w-screen">
            <h1 className=" font-bold text-2xl my-10">Update Password</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-96 w-full">

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Your Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }}
                                    />
                                </FormControl>
                                {emailMessageLoader && <p>checking..</p>}

                                <div className={`flex w-full ${emailMessage === 'Please enter your OTP below' ? 'text-green-500' : 'text-red-500'}`}>
                                    {emailMessage === 'Please enter your OTP below' && <CheckCheck />}
                                    {emailMessage !== '' && emailMessage !== 'Please enter your OTP below' && <BadgeInfo />}
                                    <p className="pl-2">{emailMessage}</p>
                                </div>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <p className="text-sm text-slate-400 my-1">Confirmation code will be sent to your email</p>
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>OTP</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your verification code"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )} />

                    <FormField
                        control={form.control}

                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Choose a new password" type="password"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )} />



                    <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? 'Updating' : 'Update'}</Button>



                </form>
            </Form>
        </div>
    )
}

export default page
