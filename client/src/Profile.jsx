
import React from 'react'

import { useState, useEffect } from 'react';
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';
import dummyChallenges from './dummyChallenges'
import SubmissionCalendar from './SubmissionCalendar'
import { apiFetch } from './api'


export default function Profile() {
  const userData = JSON.parse(localStorage.getItem('user'));
 const [solvedIds, setSolvedIds] = useState([]);

useEffect(() => {
  const fetchSolved = async () => {
  const res = await apiFetch('/api/challenges/solved');
const data = await res.json();
if (res.ok) setSolvedIds(data.solvedChallenges);
  };

  fetchSolved();
}, []);
useEffect(() => {
  const fetchSummary = async () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const res = await apiFetch(`/api/submissions/summary?tz=${encodeURIComponent(tz)}`);
    const data = await res.json();
    if (res.ok) setSummary(data);
  };

  fetchSummary();
}, []);
const solvedChallenges = dummyChallenges.filter((challenge) => solvedIds.includes(challenge.id));
const [summary, setSummary] = useState({ totalSubmissions: 0, daily: [] });
const levels = ["Easy", "Medium", "Hard"];
const countByLevel = (level) => ({
  solved: solvedChallenges.filter((c) => c.difficulty === level).length,
  total: dummyChallenges.filter((c) => c.difficulty === level).length,
});
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
 const res = await apiFetch('/api/auth/update', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: newUsername, password: newPassword }),
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
     <div className=" flex flex-col flex-1 gap-4 my-5">
  <div className="flex flex-col gap-4 m-5 bg-slate-800 border border-slate-200 rounded-xl p-4">
    <p className="font-bold text-gray-300">Total Solved</p>
    <p>
      <span className="font-bold text-4xl text-blue-400">{solvedChallenges.length}</span>
      <span className="text-blue-400"> / {dummyChallenges.length} Problems</span>
    </p>
   
    <div className="grid grid-cols-3 gap-3">
      
      {levels.map((level) => {
        const { solved, total } = countByLevel(level);
        const color =
          level === "Easy" ? "text-teal-400" : level === "Medium" ? "text-amber-400" : "text-red-400";
        return (
          <div key={level} className="flex items-center justify-between bg-slate-700 rounded-lg px-3 py-2">
            <span className={`font-semibold text-sm ${color}`}>
              {level === "Medium" ? "Med." : level}
            </span>
            <span className="text-white text-sm">{solved}/{total}</span>
          </div>
        );
      })}
    </div>
  </div>
<div className="m-5 bg-slate-800 border border-slate-200 rounded-xl p-4">
    <p className="text-gray-300">Submissions</p>
    <p className="text-3xl font-bold text-purple-400 mt-2">{summary.totalSubmissions}</p>
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
     
       <SubmissionCalendar daily={summary.daily} /> 
      
     </div>
   
  )
}

