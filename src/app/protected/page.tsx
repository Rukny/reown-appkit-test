"use client"
import { disconnect } from 'wagmi/actions';
import { config } from '../providers';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
    const router = useRouter();
    const {status, data: session} = useSession();
    useEffect(() => {
        console.log(session)
        if(!session)
            router.push("/");
      }, []);
  return (
    <button                 onClick={async () => {
        await disconnect(config);
        signOut();
      }}
    >
      LOG OUT</button >
  )
}
