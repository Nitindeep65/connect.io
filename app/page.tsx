import React from 'react'
import Signup from './(auth)/signup/page'

function page() {
  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
      {/* Logo */}
      <div className="text-xl font-bold">MyApp</div>

      {/* Links */}
      <ul className="hidden md:flex space-x-6">
        <li><a href="#" className="hover:text-gray-300">Home</a></li>
        <li><a href="#" className="hover:text-gray-300">About</a></li>
        <li><a href="#" className="hover:text-gray-300">Services</a></li>
        <li><a href="#" className="hover:text-gray-300">Contact</a></li>
      </ul>

      {/* Button */}
      <button className="hidden md:block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
        Login
      </button>

      {/* Mobile Menu Icon */}
      <button className="md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" 
             fill="none" 
             viewBox="0 0 24 24" 
             strokeWidth={1.5} 
             stroke="currentColor" 
             className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" 
                d="M3.75 5.75h16.5M3.75 12h16.5m-16.5 6.25h16.5" />
        </svg>
      </button>
    </nav>
      <Signup />
    </>
  )
}

export default page