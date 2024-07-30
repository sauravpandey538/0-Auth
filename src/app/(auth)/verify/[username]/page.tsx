'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { useParams, useRouter } from "next/navigation"
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
import { verifySchema } from "@/schemas/verifySchema"
function page() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const router = useRouter();
    const params = useParams()


    //ZOD
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })


    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/verifyOTP',
                {
                    username: params.username,
                    code: data.code
                });
            //console.log(response)
            toast({
                title: 'Success',
                description: response.data.message
            })

            router.push('/')
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
    return (
        <div className=" flex flex-col justify-center items-center h-screen w-screen">
            <h1 className=" font-bold text-2xl my-10">Verify your OTP here</h1>
            <p className="max-w-96 w-full py-6 text-slate-600">Thankyou{ }, Verification code has been send to your gmail, Please enter that 6 code digit here,</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-96 w-full">


                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your OTP</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your verification code"
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )} />
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Requesting' : 'Verify'}</Button>
                </form>
            </Form>
        </div>
    )
}

export default page
