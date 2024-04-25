import React from 'react'
import NavBar from './navbar'
import { AuthProvider } from './contexts/authContext'

const ReccomendationPage = () => {
  return (
    <AuthProvider>

    <div>
    <NavBar/>
    </div>
    </AuthProvider>

  )
}

export default ReccomendationPage
