"use client"
import { disconnect } from 'wagmi/actions';
import { config } from '../providers';
import { signOut } from 'next-auth/react';

export default function ProtectedPage() {
  return (
    <button                 onClick={async () => {
        await disconnect(config);
        signOut();
      }}
    >
      LOG OUT</button >
  )
}
