import React from 'react'
import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import Moviepage from './pages/Moviepage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import AIRecommendations from './pages/AIRecommendations'



const App = () => {
  const {fetchUser, fetchingUser} = useAuthStore();

useEffect(() => {
  fetchUser();
}, [fetchUser])

if (fetchingUser){
  return <p>Loading...</p>

}


  return (
    <div>
      <Toaster />

      <Navbar />
      <Routes>
        <Route path={"/"} element={<Homepage />} />
        <Route path={"/movie/:id"} element={<Moviepage />} />
        <Route path={"/signin"} element={<SignIn />} />
        <Route path={"/signup"} element={<SignUp />} />
        <Route path={"/ai-recommendations"} element={<AIRecommendations />} />

      </Routes>
    </div>
  )
}

export default App
