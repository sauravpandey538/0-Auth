'use client'
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
interface ComponentNameProps {

}

const AuthorizedPage: React.FC<ComponentNameProps> = ({ }) => {
    const { data: session, status } = useSession();
    //console.log(session)

    const revokeGoogleToken = async (accessToken: string) => {
        try {
            await axios.post(
                'https://oauth2.googleapis.com/revoke',
                null,
                {
                    params: {
                        token: accessToken,
                    },
                }
            );
            //console.log('Token revoked successfully');
            signOut()
        } catch (error) {
            console.error('Error revoking token', error);
        }
    };
    return (
        <>

            <div className='flex flex-col h-96 w-full justify-center items-center'>
                {session ? (
                    <>
                        <p>This is the main page of website</p>
                        <p>Welcome, {session.user?.name}</p>
                        <p>Email: {session.user?.email}</p>
                        <p className='py-10'>username: {session?.user.username}</p>
                        {session.user?.image && (
                            <Image
                                src={session.user.image}
                                alt={`${session.user.name}'s profile picture`}
                                width={100}  // Adjust the width as needed
                                height={100} // Adjust the height as needed
                                className='rounded-full ' // Optional styling
                                priority
                            />
                        )}                        <Button onClick={() => signOut()} >
                            Logout
                        </Button>
                        <Button
                            className='my-10'
                            onClick={() => revokeGoogleToken(session.accessToken || '')}>Delete 0-auth Account</Button>

                    </>
                ) : (
                    <>
                        <p>Oops!, You're not authenticated yet!</p>
                        <Link href="/signin">
                            <Button>Login</Button>
                        </Link>
                    </>
                )}
            </div>
        </>
    );
};

export default AuthorizedPage;