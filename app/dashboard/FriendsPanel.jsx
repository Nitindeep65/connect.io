"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function FriendsPanel({ isOpen, onClose }) {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  // SEARCH USER BY USERNAME
  async function handleSearch() {
    if (!username.trim()) return;

    setLoading(true);
    setResult(null); // clear previous result
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/search-user?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setResult(data.user || null);
    setLoading(false);
  }

  // SEND FRIEND REQUEST
  async function sendRequest() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/friends/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiverId: result.id }),
    });

    const data = await res.json();
    alert(data.message);
  }

  // LOAD FRIEND LIST
  async function loadFriends() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return setFriends([]);
      }

      console.log("Fetching friends...");
      const res = await fetch("/api/friends/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Friends response status:", res.status);
      const data = await res.json();
      console.log("Friends data received:", data);
      
      setFriends(data.friends || []);
    } catch (error) {
      console.error("Error loading friends:", error);
      setFriends([]);
    }
  }

  // LOAD PENDING FRIEND REQUESTS
  async function loadPendingRequests() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setPendingRequests([]);

      const res = await fetch("/api/friends/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      console.log("Pending requests data:", data);
      
      setPendingRequests(data.requests || []);
    } catch (error) {
      console.error("Error loading pending requests:", error);
      setPendingRequests([]);
    }
  }

  // ACCEPT FRIEND REQUEST
  async function acceptRequest(requestId) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Friend request accepted!");
        // Reload both lists
        await loadPendingRequests();
        await loadFriends();
      } else {
        alert(data.message || "Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Error accepting request");
    }
  }
useEffect(() => {
  if (!isOpen) return;

  async function fetchData() {
    await loadFriends();
    await loadPendingRequests();
  }

  fetchData();
}, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: -300, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -300, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-xl z-50 border-b border-gray-700"
        >
          <div className="max-w-4xl mx-auto p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Find Friends</h2>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500 hover:bg-red-400 rounded"
              >
                Close
              </button>
            </div>

            {/* SEARCH BAR */}
            <div className="mt-6 flex gap-2">
              <input
                type="text"
                placeholder="Search by username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-800 px-4 py-2 rounded border border-gray-600 outline-none"
              />
              <button
                onClick={handleSearch}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded"
              >
                Search
              </button>
            </div>

            {/* RESULTS */}
            <div className="mt-6">
              {loading && <p className="text-gray-400">Searching...</p>}

              {!loading && result === null && username && (
                <p className="text-gray-400 mt-2">No user found.</p>
              )}

              {result && (
                <div className="p-4 bg-gray-800 rounded-lg flex items-center gap-4 border border-gray-700 mt-2">
                  <Image
                    alt="profile"
                    width={40}
                    height={40}
                    src={result.image || "/default-avatar.png"}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <p className="text-lg font-semibold">{result.username}</p>
                    <p className="text-gray-400">{result.name || "No name"}</p>
                  </div>

                  <button
                    onClick={sendRequest}
                    className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
                  >
                    Add Friend
                  </button>
                </div>
              )}
            </div>

            {/* PENDING FRIEND REQUESTS */}
            <div className="mt-10">
              <h3 className="text-xl font-bold mb-3">Pending Friend Requests</h3>
              <div className="space-y-3">
                {pendingRequests.length === 0 && (
                  <p className="text-gray-500">No pending requests.</p>
                )}

                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-3 bg-gray-800 rounded flex items-center gap-3 border border-gray-700"
                  >
                    <Image
                      alt="profile"
                      src={request.sender.image || "/default-avatar.png"}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-semibold">{request.sender.username}</p>
                      <p className="text-gray-400 text-sm">{request.sender.name}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptRequest(request.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm"
                      >
                        Accept
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FRIEND LIST */}
            <div className="mt-10">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold">Your Friends</h3>
                <button
                  onClick={loadFriends}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm"
                >
                  Reload
                </button>
              </div>

              <div className="space-y-3">
                {friends.length === 0 && (
                  <p className="text-gray-500">No friends yet.</p>
                )}

                {friends.map((f) => (
                  <div
                    key={f.id}
                    className="p-3 bg-gray-800 rounded flex items-center gap-3 border border-gray-700"
                  >
                    <Image
                      alt="profile"
                      src={f.image || "/default-avatar.png"}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-semibold">{f.username}</p>
                      <p className="text-gray-400 text-sm">{f.name}</p>
                    </div>

                    <button
                      className="ml-auto px-3 py-1 bg-indigo-500 hover:bg-indigo-400 rounded"
                    >
                      Message
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
