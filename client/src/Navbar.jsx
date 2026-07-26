import React from 'react'
import { Link } from 'react-router-dom'
export default function Navbar() {
  return (
    <div className='bg-slate-900 border-b border-slate-800 px-6 py-4 '>
        <ul className='flex gap-4 text-amber-50'>
            <li>Deep Dev</li>
<li><Link to="/challenge">Challenges</Link></li>
<li><Link to="/profile">Profile</Link></li>

        </ul>
       
    </div>
  )
}
