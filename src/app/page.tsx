'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/signin')
  }
  const handleSignup = () => {
    router.push('/signup')
  }
  return (
    <main className="flex h-screen flex-col items-center justify-center ">
      <h1 className="my-10 text-3xl">This website is the illustration of shadcn and zod</h1>
      <div className=" flex - gap-10">
        <Button onClick={handleLogin}>Login</Button>
        <Button onClick={handleSignup}>Signup</Button>

      </div>
    </main>
  );
}
