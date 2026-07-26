
import React from 'react'

import { useState, useEffect } from 'react';
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';
import dummyChallenges from './dummyChallenges'
export default function Profile() {
  const userData = JSON.parse(localStorage.getItem('user'));
 const [solvedIds, setSolvedIds] = useState([]);

useEffect(() => {
  const fetchSolved = async () => {
    const res = await fetch(`https://deep-dev-ec2r.onrender.com/api/challenges/solved/${userData.id}`);
    const data = await res.json();
    setSolvedIds(data.solvedChallenges);
  };

  fetchSolved();
}, []);
const solvedChallenges = dummyChallenges.filter((challenge) => solvedIds.includes(challenge.id));
const [isEditing, setIsEditing] = useState(false);
const [newUsername, setNewUsername] = useState(userData.username);
const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/login');
}
const handleUpdateProfile = async () => {
  const res = await fetch('https://deep-dev-ec2r.onrender.com/api/auth/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: userData.id,
      username: newUsername,
      password: newPassword,
    }),
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) {
    localStorage.setItem('user', JSON.stringify(data.user));
    setIsEditing(false);
    window.location.reload();
  }
}
  return (
    <div className="min-h-screen bg-gray-800 ">
        <Navbar/>
        <div className="flex flex-col md:flex-row items-start gap-4 px-4">
         <div className= " flex  flex-col items-center gap-4 my-5  w-full md:w-72 bg-slate-800 border border-slate-200 rounded-xl p-4 ">
     {isEditing ? (
  <>
    <input
      type="text"
      value={newUsername}
      onChange={(e) => setNewUsername(e.target.value)}
      className="w-full border rounded-lg p-2 mb-2 bg-gray-700 text-white border-gray-600"
      placeholder="Username"
    />
    <input
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      className="w-full border rounded-lg p-2 mb-2 bg-gray-700 text-white border-gray-600"
      placeholder="New password (leave blank to keep same)"
    />
    <button onClick={handleUpdateProfile} className="w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-lg mb-2">
      Save
    </button>
    <button onClick={() => setIsEditing(false)} className="w-full bg-gray-500 hover:bg-gray-700 text-white py-2 rounded-lg">
      Cancel
    </button>
  </>
) : (
  <>
    <h1 className='text-xl font-bold text-white'>{userData.username}</h1>
    <p className='text-gray-300'>{userData.email}</p>
    <button 
      onClick={() => setIsEditing(true)}
      className="w-full bg-purple-500 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
    >
      Edit Profile
    </button>
  </>
)}
       <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
        Logout
      </button> 
<p className='text-gray-400'>Joined {new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
     </div>   
     <div className=" flex flex-col flex-1">
         <div className= " flex  flex-col items-center gap-4 m-5  bg-slate-800 border border-slate-200 rounded-xl p-4 ">
        <p className=' font-bold text-white'>OVERALL PROGRESS</p>
        <p className='text-gray-300'> <span className='font-bold text-4xl'>{solvedChallenges.length  }</span> Solved</p>
      </div> 
      <div className=" flex  flex-col  m-5 bg-slate-800 border border-slate-200 rounded-xl p-4">
<div className= "flex flex-row  items-center justify-between  ">
        <h1 className='text-xl font-bold text-gray-300'>Recently Solved</h1>
       <p className="text-gray-400">View All</p>
      
      </div>
{solvedChallenges.map((challenge) => (
  <div key={challenge.id} className="border-2 border-slate-600 rounded-2xl p-4 mt-4">
    <h1 className='text-slate-50 text-xl'>{challenge.title}</h1>
  </div>
))}
      </div>
       
        </div>
        </div>
     
      
      
     </div>
   
  )
}

