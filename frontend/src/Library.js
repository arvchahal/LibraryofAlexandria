import React from 'react'
import { AuthProvider } from './contexts/authContext';
import NavBar from './navbar';

const Library = () => {
  return (
    <AuthProvider>

    <div>
    <NavBar/>
    </div>
    </AuthProvider>

  )
}

export default Library
