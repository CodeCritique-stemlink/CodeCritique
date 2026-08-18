"use client"
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import {
    SignInButton,
    SignUpButton,
    Show,
    UserButton,
} from "@clerk/nextjs";

export default function MobileNav() {
    const [open, setOpen] = useState(false);
    const closeMenu = () => setOpen(false);

    return (
        <div className="md:hidden">
            <div className="flex items-center gap-2">
                <Show when="signed-in">
                    <UserButton />
                </Show>
                <button
                    onClick={() => setOpen(!open)}
                    className="p-2 rounded-md hover:bg-gray-100 transition"
                    aria-label="Toggle menu">
                    {open ? < X size={24} /> : <Menu size={24} />}</button>
            </div>
            {open && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-zinc-200 shadow-md">
                    <div className="flex flex-col p-5 gap-4">
                        <Show when="signed-in">

                            <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition animate-fade-in">
                                Home
                            </Link>
                            <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition animate-fade-in">
                                Dashboard
                            </Link>
                            <Link href="/profile" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition animate-fade-in">
                                Profile
                            </Link>

                        </Show>
                        <Link href="/submit" className="border border-gray-200 inline-flex items-center gap-2 bg-black text-white font-medium px-3 py-1.5 rounded-md hover:text-bg-500 dark:hover:bg-gray-100 transition">
                            Post a Review Request
                        </Link>
                        <Show when="signed-out">
                            <SignInButton mode="modal"><button className="text-sm font-medium px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500 transition">Sign In</button></SignInButton>
                            <SignUpButton mode="modal"><button className="text-sm font-medium px-3 py-1.5 rounded-md bg-black text-white border border-gray-800 hover:bg-gray-500 dark:hover:bg-gray-100 transition">Sign Up</button></SignUpButton>
                        </Show>

                    </div>
                </div>
            )}
        </div>
    );
}
