import { useState } from 'react'

import ProtectedRoute from './ProtectedRoute'
import Login from './Login'
import Register from './Register'
import Challenges from './Challenges'
import Profile from './Profile'
import ChallengeDetail from './ChallengeDetail'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
function App() {
  const allRoutes = createBrowserRouter([
    { path: "/", element: <Register /> },
    { path: "/login", element: <Login /> },
     
      { path: "/challenge-detail/:id", element: <ChallengeDetail /> },
    {path:"/challenge",
     element: (
      <ProtectedRoute>
        <Challenges />
      </ProtectedRoute>
    ) },
    {path:"/profile", 
element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
    },
  ])

  return <RouterProvider router={allRoutes} />;
}

export default App;
