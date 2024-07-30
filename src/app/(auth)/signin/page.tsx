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

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [enteredEmail, setEnteredEmail] = useState('')
    const { toast } = useToast()
    const router = useRouter();

    //ZOD
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        //console.log('Data is', data)
        try {

            const result = await signIn('credentials', { email: data.email, password: data.password, redirect: false },)
            if (result?.error) {
                if (result.error === 'CredentialsSignin') {
                    toast({
                        title: 'Login Failed',
                        description: 'Incorrect username or password',
                        variant: 'destructive',
                    });
                } else {
                    toast({
                        title: 'Error',
                        description: result.error,
                        variant: 'destructive',
                    });
                }
            }
            if (result?.url) {
                router.replace('/authorizedPage');
            }
        } catch (error) {
            console.error('Error during signUp', error);
            const AxiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                variant: 'destructive',
                description: AxiosError.response?.data.message ?? 'Error during SignIp'
            })

        } finally {
            setIsSubmitting(false)

        }

    }
    const handleSignup = () => {
        router.push('/signup')
    }

    const handleForgetPassword = () => {
        router.push('/update/password')
    }
    return (
        <div className=" flex flex-col justify-center items-center h-screen w-screen">
            <h1 className=" font-bold text-2xl my-10">SignIn Form</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-96 w-full">

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}


                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="password"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )} />

                    <div className=" h-5 w-full  flex justify-between items-center">
                        <div>
                            <input type="checkbox" />
                            <span className="text-sm text-slate-400 px-2">Remember me</span>
                        </div>
                        <p
                            onClick={handleForgetPassword}
                            className="text-sm text-slate-400  hover:border-gray-200 hover:border-b-2 cursor-pointer">forget password?</p>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? 'Requesting' : 'Login'}</Button>
                    <p className="w-full text-center">I'm not already a member yet! <span
                        onClick={handleSignup}
                        className="px-1 hover:border-black hover:border-b-2 cursor-pointer font-bold">Signup</span></p>


                </form>
            </Form>
        </div>
    )
}

export default page
