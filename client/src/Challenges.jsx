import React, { useState, useEffect } from 'react'
import ChallengeCard from './ChallengeCard'
import dummyChallenges from './dummyChallenges'
import Navbar from './Navbar'

export default function Challenges() {
  const [solvedIds, setSolvedIds] = useState([]);

  useEffect(() => {
    const fetchSolved = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));

      const res = await fetch(`http://localhost:5000/api/challenges/solved/${userData.id}`);
      const data = await res.json();

      setSolvedIds(data.solvedChallenges);
    };

    fetchSolved();
  }, []);

  return (
    <div className=' min-h-screen bg-gray-800'>
      <Navbar/>
      <div className="p-4">
        <h1 className='text-2xl font-bold mb-2 text-white'>Frontend Challenges</h1>
        <p className='text-l  mb-2 text-white'>Master modern frontend development through high-precision challenges</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dummyChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              id={challenge.id}
              title={challenge.title}
              difficulty={challenge.difficulty}
              tags={challenge.tags}
              description={challenge.description}
              image={challenge.image}
              solved={solvedIds.includes(challenge.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}