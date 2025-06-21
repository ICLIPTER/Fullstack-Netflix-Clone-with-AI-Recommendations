import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Signin = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {login, isloading, error} = useAuthStore();

    const handlelogin = async (e) =>{
        e.preventDefault();
        try {
        const{message} = await login(username, password)
            toast.success(message || "Login successful");
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }
    



  return (
    <div className='min-h-screen bg-cover bg-center bg-no-repeat px-4 md:px-8 py-5'
    style={
        {
            backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/background_banner.jpg)",
            
        }
    }>

    <div className='max-w-[450px] w-full bg-black bg-opacity-75 rounded px-8 py-14 mx-auto mt-8'>
        <h1 className='text-3xl font-medium text-white mb-7'>Sign In</h1>
        <form onSubmit={handlelogin} className='flex flex-col space-y-4'>
            <input type="text"
            value={username} onChange={(e) => setUsername(e.target.value)}  
            placeholder='username' 
            className='w-full h-[50px] bg-[#333] text-white rounded px-5 text-base '/>

            <input type="password" 
            value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder='password' 
            className='w-full h-[50px] bg-[#333] text-white rounded px-5 text-base ' />

            {error && <p className='text-red-500 text-sm'>{error}</p>}

            <button type='submit' 
            disabled={isloading}
            className='w-full bg-[#e50914] text-white py-2 rounded text-base-[16px] hover:opacity-90 cursor-pointer'>Sign In</button>

            <div className='mt-10 text-[#737373] text-sm'>
                <p >New to Netflix? <span onClick={() => navigate('/signup')} className='text-white font-medium cursor-pointer ml-2 hover:underline'>Sign up now</span></p>
            </div>
        </form>
    </div>
    </div>
  );
};

export default Signin