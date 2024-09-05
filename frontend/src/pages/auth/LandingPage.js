import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button';
import placeholder from '../../assets/images/placeholder.png'

const Header = () => {
    return(
        <div className='flex w-full justify-between items-center p-1'>
            <p className='text-white'>ID finder</p>
            <div className='items-center hidden md:flex basis-2/3 lg:basis-1/2 justify-around'>
                <p className='text-white'>Home</p>
                <p className='text-white'>About Us</p>
                <p className='text-white'>How It Works</p>
                <p className='text-white'>Benefits</p>
                <Link className='text-white' to='/auth/login'>Login</Link>
                <Button variant="contained">Get started now</Button>
            </div>
            <div className='md:hidden'>
                <p>Small View</p>
            </div>
        </div>
    )
}


const Home = () => {
    return(
        <div className='home py-10 flex flex-col lg:flex-row justify-around items-center'>
            <div>
                <h2 className='text-white'>Find Your Lost ID Effortlessly</h2>
                <p className='text-white'>A safe and reliable plaform to help you recover or post lost IDs quickly</p>
                <Button variant="contained" color='error'>Find Your ID</Button>
                <br></br>
                <div>
                    <br></br>
                    <p className='text-white'>DOWNLOAD OUR APP</p>
                    <br></br>
                    <div className='flex flex-row justify-around'>
                        <p>Apple Store Icon</p>
                        <p>Google Play Icon</p>
                    </div>
                    <br></br>
                </div>
            </div>
            <div>
                <img
                src={placeholder}
                alt='A chat screenshot'
                className='w-64'
                ></img>
            </div>
        </div>
    )
}

const About = () => {
    return(
        <div className='about flex items-center py-10 justify-around'>
            <div>
                <p>Find Your Lost ID Effortlessly</p>
                <p>A safe and reliable platform to help you recover or post lost IDs quickly</p>

                <br></br>
                <p>Post Lost ID</p>
                <p>Reuniting Lost IDs with Their Owners in Kenya</p>

                <br></br>
                <p>Find Your ID</p>
                <p>Search for lost IDs in the web and brighten your day</p>
            </div>
            <div>
                <img
                src={placeholder}
                alt='A chat screenshot'
                className='w-64'
                ></img>
            </div>
        </div>
    )
}

export const LandingPage = () => {
  return (
    <div>
        <div className='w-full bg-indigo-700 pb-10'>
            <Header />
            <Home />
        </div>
        <About />
        <HowItWorks />
        <p className='text-lg font-bold'>LandingPage</p>
    </div>
  )
}


const HowItWorks = () => {

    return(
        <div>
            <div>
                <h2 className='font-bold text-2xl'>How does it work?</h2>
                <br></br>
                <p>With lots of unique blocks, you can easily build a page easily without any working</p>
                <br></br>
            </div>
            <div className='flex md:block justify-center items-start'>
                <div className='flex flex-col md:flex-row justify-around'>
                    <p className='rounded-full w-10 h-10 bg-red-500 text-white flex self-center items-center justify-center mb-32 md:mb-2'>1</p>
                    <p className='rounded-full w-10 h-10 bg-green-600 text-white flex self-center items-center justify-center mb-32 md:mb-2'>2</p>
                    <p className='rounded-full w-10 h-10 bg-purple-800 text-white flex self-center items-center justify-center mb-32 md:mb-2'>3</p>
                </div>
                <div className='pl-4 md:pl-0 flex items-start flex-col md:flex-row justify-around'>
                    <div className='w-64 h-40 md:h-auto flex flex-col justify-left md:justify-center'>
                        <h1>REGISTER</h1>
                        <p className='self-left flex'>Create an account to access our services and search through our database to see if your ID has been posted</p>
                    </div>
                    <div className='w-64 h-40 md:h-auto flex flex-col justify-start md:justify-center'>
                        <h1>POSTING IDs</h1>
                        <p>If you've found an ID, post the details securely</p>
                    </div>
                    <div className='w-64 h-40 md:h-auto flex flex-col justify-start md:justify-center'>
                        <h1>CONNECT</h1>
                        <p>We'll connect you with the person who found yur ID</p>
                    </div>
                </div>

            </div>
        </div>
    )
}