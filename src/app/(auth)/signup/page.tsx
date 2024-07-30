'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import Email from "next-auth/providers/email"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc";



import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { BadgeInfo, CheckCheck, TicketPlus } from "lucide-react"
function page() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [usernameMessageLoader, setUsernameMessageLoader] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const router = useRouter();
    const debounced = useDebounceCallback(setUsername, 500)
    const handleLogin = () => {
        router.push('/signin')
    }
    //ZOD
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {

        const checkUsername = async () => {
            if (username) {
                setUsernameMessageLoader(true);
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/check-unique-username?username=${username}`);
                    //console.log(response)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const AxiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(AxiosError.response?.data.message ?? 'Error checking username')
                } finally {
                    setUsernameMessageLoader(false);
                }
            }



        }
        checkUsername();
    }, [username])
    //console.log(process.env.NEXT_PUBLIC_DOMAIN);
    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/signup', data);
            //console.log(response)
            toast({
                title: 'Verify Your Account',
                description: response.data.message
            })

            router.push(`/verify/${username}`)
        } catch (error) {
            console.error('Error during signUp', error);
            const AxiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                variant: 'destructive',
                description: AxiosError.response?.data.message ?? 'Error during SignUp'
            })

        } finally {
            setIsSubmitting(false)

        }

    }
    return (
        <div className=" flex flex-col justify-center items-center h-screen w-screen">
            <h1 className=" font-bold text-2xl my-10">SignUp Form</h1>
            <div className="space-y-8 max-w-96 w-full">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {usernameMessageLoader && <p>checking..</p>}


                                    <div className={`flex w-full ${usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-red-500'}`}>
                                        {usernameMessage === 'Username is unique' && <CheckCheck />}
                                        {usernameMessage !== '' && usernameMessage !== 'Username is unique' && <BadgeInfo />}
                                        <p className="pl-2">{usernameMessage}</p>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        <Button type="submit" disabled={isSubmitting} className="w-full mt-3">{isSubmitting ? 'Requesting' : 'SignUp'}</Button>
                    </form>
                    <p
                        className="w-full text-center my-10">I'm already a member! <span
                            onClick={handleLogin}

                            className="px-1 hover:border-black hover:border-b-2 cursor-pointer font-bold">LogIn</span></p>
                    <p className="w-full text-center pt-0">Or,</p>
                    <Button onClick={() => signIn("google", { callbackUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/authorizedPage` })} className="w-full bg-slate-500">
                        <FcGoogle className="mr-2 h-4 w-4" />
                        Sign in with Google</Button>

                </Form>
            </div>
        </div>
    )
}

export default page
