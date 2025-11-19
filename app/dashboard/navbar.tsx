import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {useFriendsStore} from '../store/friendsStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', current: true },
  { name: 'Chats', href: '#', current: false },
  { name: 'New Friends',  href: '#', current: false },
]


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
function signOut() {
  localStorage.removeItem("token");   
  window.location.href = "/signin";    
}


export default function Navbar() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const { openFriends } = useFriendsStore(); 
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");
      if (!token) return; // user not logged in

      const res = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.user) {
        setUserImage(data.user.image);
      }
    }

    loadUser();
  }, []);
    useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.user) {
        setUserImage(data.user.image);
      }
    }

    loadUser();
  }, []);

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-white/10 shadow-lg"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Image
                width={32}
                height={32}
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-2">
                {navigation.map((item) => (
                  item.name === 'New Friends' ? (
                    <button
                      key={item.name}
                      onClick={openFriends}
                      className="text-gray-300 hover:bg-white/10 hover:text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/50' 
                          : 'text-gray-300 hover:bg-white/10 hover:text-white',
                        'rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200',
                      )}
                    >
                      {item.name}
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors duration-200"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <Image
                  alt="User avatar"
                  width={40}
                  height={40}
                  src={userImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                  className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ring-2 ring-indigo-500/50 hover:ring-indigo-400 transition-all duration-200"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-gray-800/95 backdrop-blur-xl py-2 shadow-xl border border-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="/dashboard/account"
                    className="block px-4 py-3 text-sm text-gray-300 data-focus:bg-gradient-to-r data-focus:from-indigo-500/20 data-focus:to-purple-500/20 data-focus:text-white rounded-lg mx-2 transition-all duration-200"
                  >
                    Your profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-3 text-sm text-gray-300 data-focus:bg-gradient-to-r data-focus:from-indigo-500/20 data-focus:to-purple-500/20 data-focus:text-white rounded-lg mx-2 transition-all duration-200"
                  >
                    Settings
                  </a>
                </MenuItem>
                <div className="border-t border-white/10 my-2"></div>
                <MenuItem>
                  <a
                    href="#"
                    onClick={signOut}
                    className="block px-4 py-3 text-sm text-red-400 data-focus:bg-red-500/20 data-focus:text-red-300 rounded-lg mx-2 transition-all duration-200"
                  >
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-2 px-4 pt-2 pb-3">
          {navigation.map((item) => (
            item.name === 'New Friends' ? (
              <DisclosureButton
                key={item.name}
                as="button"
                onClick={openFriends}
                className="w-full text-left text-gray-300 hover:bg-white/10 hover:text-white block rounded-lg px-4 py-3 text-base font-semibold transition-all duration-200"
              >
                {item.name}
              </DisclosureButton>
            ) : (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white',
                  'block rounded-lg px-4 py-3 text-base font-semibold transition-all duration-200',
                )}
              >
                {item.name}
              </DisclosureButton>
            )
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
