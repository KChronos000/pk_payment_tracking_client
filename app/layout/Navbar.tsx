'use client'
import React, { FC, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Session } from '../types/session';
import UserProfile from '@/components/UserProfile';
import { ModeToggle } from '@/components/SwitchThemeMode';

interface NavbarProps {
  session: Session | null;
}


const Navbar: FC<NavbarProps> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white dark:bg-[#1c1b1e] text-black dark:text-white shadow-md">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo_pk.png" quality={100} width={40} height={40} alt="logo" />
            <span className="font-semibold text-xl">ระบบตรวจสอบค่าธรรมเนียม</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link href={`${session && session.role === 'student' ? "/fee" : "/auth/student"}`} className="hover:text-blue-500 transition-colors">
              ตรวจสอบการชำระค่าธรรมเนียม
            </Link>
            {!session ? (
              <Link href="/auth/user" className="hover:text-blue-500 transition-colors">
                เข้าสู่ระบบ
              </Link>
            ) : (
              <UserProfile user={session} />
            )}
            <ModeToggle />
          </div>

          <button onClick={toggleMenu} className="md:hidden">
            {isOpen ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inline-flex icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="inlineflex icon icon-tabler icons-tabler-outline icon-tabler-menu-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link href={`${session && session.role === 'student' ? "/fee" : "/auth/student"}`} className="block hover:text-blue-500 transition-colors py-2">
              ตรวจสอบการชำระค่าธรรมเนียม
            </Link>
            {!session ? (
              <Link href="/auth/user" className="block hover:text-blue-500 transition-colors py-2">
                เข้าสู่ระบบ
              </Link>
            ) : (
              <UserProfile user={session} />
            )}
            <ModeToggle />

          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;