import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import placeholder from '../../assets/images/placeholder.png';
import MenuIcon from '@mui/icons-material/Menu';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Header = () => {
    const [hideMenu, setHideMenu] = useState(true);

    const handleHideMenu = (e) => {
        e.preventDefault();
        setHideMenu((prevCheck) => !prevCheck);
    };

    return (
        <div className="bg-gray-900 p-4 shadow-md rounded-b-lg">
            <div className='flex justify-between items-center'>
                <p className='text-white text-2xl font-bold'>ID Finder</p>
                <div className='items-center hidden md:flex space-x-6'>
                    <Link className='text-white hover:underline' to='/'>Home</Link>
                    <Link className='text-white hover:underline' to='/about'>About Us</Link>
                    <Link className='text-white hover:underline' to='/how-it-works'>How It Works</Link>
                    <Link className='text-white hover:underline' to='/benefits'>Benefits</Link>
                    <Link className='text-white hover:underline' to='/auth/login'>Login</Link>
                    <Button variant="contained" color="primary">Get Started</Button>
                </div>
                <div className='md:hidden'>
                    <MenuIcon className='text-white hover:cursor-pointer' onClick={handleHideMenu} />
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${hideMenu ? 'hidden' : 'flex'} fixed z-50 top-16 left-4 right-4 bg-white shadow-md rounded-md p-4 md:hidden flex-col space-y-4`}>
                <Link to='/' className='hover:text-indigo-700'>Home</Link>
                <Link to='/about' className='hover:text-indigo-700'>About Us</Link>
                <Link to='/how-it-works' className='hover:text-indigo-700'>How It Works</Link>
                <Link to='/benefits' className='hover:text-indigo-700'>Benefits</Link>
                <Link to='/auth/login' className='hover:text-indigo-700'>Login</Link>
            </div>
        </div>
    );
};

const Home = () => {
    return (
        <div className="home py-16 flex flex-col lg:flex-row justify-around items-center bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
            <div className="space-y-4 text-center lg:text-left">
                <motion.h2
                    className='text-4xl font-bold text-white pb-6'
                    animate={{
                        y: [0, -10, 10, -5, 5, 0],
                        rotate: [0, 5, -5, 0],
                        opacity: [1, 0.9, 1]
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                >
                    Find Your Lost ID Effortlessly
                </motion.h2>
                <p className='text-lg mt-16'>We provide a safe and reliable platform to help you recover or post lost IDs quickly and securely.</p>
                <Button sx={{ zIndex: 2 }} variant="contained" color="secondary" size="large">
                    Find Your ID
                </Button>
            </div>
            <div className="mt-8 lg:mt-0">
                <img src={placeholder} alt='Screenshot' className='w-64 lg:w-80 shadow-lg rounded-md' />
            </div>
        </div>
    );
};

const Benefits = () => {
    const benefitsList = [
        "Secure platform for posting lost IDs",
        "User-friendly interface for easy navigation",
        "Quick recovery process with real-time updates",
        "Community support and feedback for improved services",
    ];

    return (
        <div className="benefits py-16 bg-gray-100">
            <h2 className='text-center text-3xl font-bold mb-10 text-indigo-700'>Benefits of Using ID Finder</h2>
            <div className='max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'>
                {benefitsList.map((benefit, index) => (
                    <div key={index} className="bg-white p-4 rounded-md shadow-md text-center">
                        <h3 className='text-lg font-bold'>{`Benefit ${index + 1}`}</h3>
                        <p className='text-sm'>{benefit}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const About = () => {
    return (
        <div className='about bg-white py-16 flex flex-col lg:flex-row justify-around items-center'>
            <div className="max-w-lg space-y-4 text-center lg:text-left">
                <h2 className='text-3xl font-bold text-indigo-700'>About Us</h2>
                <p>We are committed to reuniting lost IDs with their rightful owners, providing a secure and easy-to-use platform for posting and finding lost IDs in Kenya.</p>
                <Button variant="outlined" color="primary">Learn More</Button>
            </div>
            <div className="mt-8 lg:mt-0">
                <img src={placeholder} alt='About Us' className='w-64 lg:w-80 shadow-lg rounded-md' />
            </div>
        </div>
    );
};

const HowItWorks = () => {
    return (
        <div className="how-it-works py-16 bg-white">
            <h2 className='text-center text-3xl font-bold mb-10 text-indigo-700'>How Does It Work?</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {/* Step 1 */}
                <div className='flex flex-col items-center'>
                    <div className='rounded-full w-12 h-12 bg-red-500 text-white flex items-center justify-center mb-4 text-lg font-bold'>1</div>
                    <h3 className='text-lg font-bold mb-2'>Register</h3>
                    <p className='text-center'>Create an account and search our database for your lost ID.</p>
                </div>
                {/* Step 2 */}
                <div className='flex flex-col items-center'>
                    <div className='rounded-full w-12 h-12 bg-green-500 text-white flex items-center justify-center mb-4 text-lg font-bold'>2</div>
                    <h3 className='text-lg font-bold mb-2'>Post Found IDs</h3>
                    <p className='text-center'>If you've found an ID, post the details securely to help reunite it with its owner.</p>
                </div>
                {/* Step 3 */}
                <div className='flex flex-col items-center'>
                    <div className='rounded-full w-12 h-12 bg-purple-500 text-white flex items-center justify-center mb-4 text-lg font-bold'>3</div>
                    <h3 className='text-lg font-bold mb-2'>Get Connected</h3>
                    <p className='text-center'>We'll connect you with the person who found or lost the ID.</p>
                </div>
            </div>
        </div>
    );
};

export const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="px-1 md:px-2 container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Section 1: About */}
                <div>
                    <h2 className="text-lg font-bold mb-4">About Us</h2>
                    <p className="text-sm mb-4 text-left">
                        ID Finder helps you quickly recover lost IDs and reunite them with their rightful owners. We ensure the process is simple and secure.
                    </p>
                    <Link to="/about" className="text-blue-400 hover:underline">Learn More</Link>
                </div>

                {/* Section 2: Quick Links */}
                <div>
                    <h2 className="text-lg font-bold mb-4">Quick Links</h2>
                    <ul className="space-y-2 flex flex-col ">
                        <li>
                            <Link to="/how-it-works" className="text-left w-full text-white hover:text-blue-400">How It Works</Link>
                        </li>
                        <li>
                            <Link to="/benefits" className="text-left w-full text-white hover:text-blue-400">Benefits</Link>
                        </li>
                        <li>
                            <Link to="/auth/login" className="text-left w-full text-white hover:text-blue-400">Login</Link>
                        </li>
                    </ul>
                </div>

                {/* Section 3: Contact Us */}
                <div>
                    <h2 className="text-lg font-bold mb-4 text-left">Contact Us</h2>
                    <p className="text-sm mb-4 text-left">
                        Reach out to us at any time. We're here to help you recover lost IDs and answer your queries.
                    </p>
                    <p className='text-left'>Email: <a href="mailto:idfinderkenya@gmail.com" className="text-blue-400 hover:underline">idfinderkenya@gmail.com</a></p>
                    <p className='text-left'>Phone: +254 701 901 186</p>
                </div>

                {/* Section 4: Social Media Icons */}
                <div>
                    <h2 className="text-lg font-bold mb-4">Follow Us</h2>
                    <div className="flex space-x-4 mt-4 justify-center w-full">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <Facebook className="hover:text-blue-500 cursor-pointer" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <Twitter className="hover:text-blue-400 cursor-pointer" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <Instagram className="hover:text-pink-400 cursor-pointer" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <LinkedIn className="hover:text-blue-700 cursor-pointer" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="text-center mt-8 border-t border-gray-700 pt-4">
                <p className="text-sm">&copy; {new Date().getFullYear()} ID Finder. All rights reserved.</p>
            </div>
        </footer>
    );
}

export const LandingPage = () => {
    return (
        <div className='bg-gradient-to-r from-indigo-600 to-indigo-800'>
            <Header />
            <Home />
            <Benefits />
            <About />
            <HowItWorks />
            <Footer />
        </div>
    );
};
