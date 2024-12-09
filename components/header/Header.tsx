'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Logo } from './Logo'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full bg-white text-gray-12 shadow-md sticky top-0 z-10">
      <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-sm uppercase font-bold">
          <Link
            href="/about"
            className="transition-all ease-in-out duration-300 hover:text-indigo-12 p-2 hover:tracking-wide"
          >
            About
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2"
            aria-label="Toggle navigation menu"
          >
            {/* Hamburger Icon */}
            <span className="block w-6 h-0.5 border border-gray-12 mb-1"></span>
            <span className="block w-6 h-0.5 border border-gray-12 mb-1"></span>
            <span className="block w-6 h-0.5 border border-gray-12"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background text-gray-12 p-4">
          <ul className="space-y-4 focus:outline-none">
            <li>
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>
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
