"use client";

import React from "react";
import Navbar from "./navbar";
import FriendsPanel from "./FriendsPanel";
import { useFriendsStore } from "../store/friendsStore";
import { ChatBubbleLeftRightIcon, UserCircleIcon, UserGroupIcon, BellIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { isFriendsOpen, openFriends, closeFriends } = useFriendsStore();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Navbar />
        <FriendsPanel isOpen={isFriendsOpen} onClose={closeFriends} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* PAGE TITLE */}
          <div className="flex justify-between items-center pt-4">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-gray-400 mt-2">Welcome back! Here&apos;s what&apos;s happening.</p>
            </div>
            <SparklesIcon className="size-12 text-indigo-400 animate-pulse" />
          </div>

          {/* DASHBOARD CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* CARD 1 */}
            <div className="group relative bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-8 rounded-2xl shadow-xl border border-indigo-500/20 hover:border-indigo-400/50 transition-all duration-300 hover:shadow-indigo-500/20 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <SparklesIcon className="size-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Welcome!</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                You&apos;re successfully logged in. Explore your chat features and connect with friends.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="group relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8 rounded-2xl shadow-xl border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ChatBubbleLeftRightIcon className="size-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Messages</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">No messages yet. Start a conversation!</p>
              <div className="mt-4 text-sm text-blue-400 font-medium">0 unread messages</div>
            </div>

            {/* CARD 3 */}
            <a href="/dashboard/account" className="group relative bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-8 rounded-2xl shadow-xl border border-violet-500/20 hover:border-violet-400/50 transition-all duration-300 hover:shadow-violet-500/20 hover:-translate-y-1 block">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserCircleIcon className="size-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">Profile</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">Manage your account settings & preferences.</p>
              <div className="mt-4 text-sm text-violet-400 font-medium group-hover:text-violet-300 transition-colors">View profile →</div>
            </a>

            {/* CARD 4 */}
            <div className="group relative bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-8 rounded-2xl shadow-xl border border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-emerald-500/20 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserGroupIcon className="size-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Friends</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">View and manage your friends list.</p>
              <button
                onClick={openFriends}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-emerald-500/30"
              >
                Open Friends Panel
              </button>
            </div>

            {/* CARD 5 */}
            <div className="group relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-8 rounded-2xl shadow-xl border border-amber-500/20 hover:border-amber-400/50 transition-all duration-300 hover:shadow-amber-500/20 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BellIcon className="size-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">Notifications</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">You have no new notifications.</p>
              <div className="mt-4 text-sm text-amber-400 font-medium">All caught up! 🎉</div>
            </div>

            {/* CARD 6 */}
            <div className="group relative bg-gradient-to-br from-rose-500/10 to-pink-500/10 p-8 rounded-2xl shadow-xl border border-rose-500/20 hover:border-rose-400/50 transition-all duration-300 hover:shadow-rose-500/20 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheckIcon className="size-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-300 to-pink-300 bg-clip-text text-transparent">Account Security</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Check password strength and recent login activity.
              </p>
              <div className="mt-4 text-sm text-rose-400 font-medium">✓ Secured</div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}