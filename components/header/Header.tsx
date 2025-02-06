'use client'

import { useSession } from '@/lib/hooks'
import { Avatar } from '@radix-ui/themes'
import Link from 'next/link'
import { useState } from 'react'
import { LoginForm } from '../LoginForm'
import { Logo } from './Logo'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { session } = useSession()

  return (
    <header className="w-full bg-gray-1 text-gray-11 shadow-md sticky top-0 z-10">
      <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto list-none">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex gap-4 items-center">
          <li className="hidden md:flex space-x-6 text-sm uppercase font-bold">
            <Link
              href="/about"
              className="transition-all ease-in-out duration-300 hover:text-accent-12 p-2 hover:tracking-wide"
            >
              About
            </Link>
          </li>

          <li>
            {session ? (
              <Avatar
                radius="full"
                variant="solid"
                color="purple"
                fallback={session.email.slice(0, 2)}
              />
            ) : (
              <LoginForm />
            )}
          </li>
        </ul>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2"
            aria-label="Toggle navigation menu"
          >
            {/* Hamburger Icon */}
            <span className="block w-6 h-0.5 bg-gray-11 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-11 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-11"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-1 text-gray-11 p-4">
          <ul className="space-y-4 focus:outline-none">
            <li>
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-accent-11"
              >
                About
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default Header
