
'use client';
import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { MessageCircleCode } from "lucide-react";

export default function Navbar() {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="border-b bg-white border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <Link href="/" className="text-xl font-bold text-indigo-600 tracking-tight">
      <div className='flex items-center gap-3'>
        <MessageCircleCode/>
        CodeCritic
        </div>
        
      </Link>

      <div className="flex items-center gap-4">
        {isSignedIn ? (
          <>
            <Link 
              href="/submissions/create" 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
            >
              + Post Review
            </Link>
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700">
              Karma: {user.publicMetadata.karma as number || 0}
            </div>
            <UserButton />
          </>
        ) : (
          <div className="flex items-center gap-3 text-sm font-medium">
            <SignInButton mode="modal">
              <button className="text-slate-600 hover:text-slate-900">Log In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        )}
      </div>
    </nav>
  );
}
