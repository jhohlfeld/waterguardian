'use client'

import Link from 'next/link'
import { useState } from 'react'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full bg-background text-gray-12">
      <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <img
              src="/logo/logo-word.svg"
              alt="WaterGuardia logo"
              className="h-8"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-sm font-medium">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/privacy" className="hover:underline">
            Impressum & Datenschutz
          </Link>
        </div>

        {/* Dark Mode Toggle Placeholder */}
        <div className="hidden md:flex">
          <button
            className="p-2 rounded-md bg-background text-gray-12"
            disabled
          >
            Dark Mode (Coming Soon)
          </button>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2"
            aria-label="Toggle navigation menu"
          >
            {/* Hamburger Icon */}
            <span className="block w-6 h-0.5 text-gray-12 mb-1"></span>
            <span className="block w-6 h-0.5 text-gray-12 mb-1"></span>
            <span className="block w-6 h-0.5 text-gray-12"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background text-gray-12 p-4">
          <ul className="space-y-4 focus:outline-none">
            <li>
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy" onClick={() => setIsMenuOpen(false)}>
                Impressum & Datenschutz
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default Header
