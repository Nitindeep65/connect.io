"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../navbar";

function Account() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  async function updateName() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/update-user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    alert(data.message);
  }

  async function updatePassword() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const data = await res.json();
    alert(data.message);
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview
    setImagePreview(URL.createObjectURL(file));

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    // if the upload endpoint returns the image URL, update state so the UI shows the uploaded image
    setImage(data.image || data.url || "");
    alert(data.message);
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          setIsLoading(false);
          return;
        }

        const res = await fetch("/api/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.user) {
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setImage(data.user.image || "");
        }
      } catch (err) {
        console.log("Error loading user:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Account Settings</h1>

          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Profile Picture</h2>
              <div className="flex items-center gap-4">
                <Image
                  src={imagePreview || image || "/default-avatar.png"}
                  alt="Profile picture"
                  width={80}
                  height={80}
                  unoptimized
                  className="w-20 h-20 rounded-full object-cover"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  className="text-white"
                />
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Profile Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    readOnly
                    className="block opacity-50 cursor-not-allowed w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Change Password</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline-1 outline-white/10"
                  />
                </div>
                <button
                  onClick={updatePassword}
                  className="px-6 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-400"
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button className="px-6 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500">
                Cancel
              </button>
              <button
                onClick={updateName}
                className="px-6 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-400"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Account;
