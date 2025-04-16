import React from 'react';
import main_banner_bg from '../assets/main_banner_bg.png';
import main_banner_bg_sm from '../assets/main_banner_bg_sm.png';
import white_arrow_icon from '../assets/white_arrow_icon.svg';
import black_arrow_icon from '../assets/black_arrow_icon.svg';


import { Link } from 'react-router-dom'

const MainBanner = () => {
    return (
        <div className='relative'>
            <img src={main_banner_bg} alt="banner" className='w-full hidden md:block' />
            <img src={main_banner_bg_sm} alt="banner" className='w-full  md:hidden' />

            <div className='absolute inset-0 flex-col items-center md:items-start justify-end
             md:justify-center pb-24 md:pb-18 lg:pl-24 flex'>
                <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left
                max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15'
                >  
                    Freshness you can Trust, Savings You will Love!</h1>
            
            {/* //Shop Now */}
            <div className='flex items-center mt-6 font-medium'>
                <Link to='/products' className='w-42 m-2 group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary
                hover:bg-primary-dull transition rounded text-white cursor-pointer'>
                    Shop Now

                    <img className='md:hidden transition group-focus:translate-x-1' src={white_arrow_icon} alt="arrow" />
                </Link>

                {/* //Explore deals */}

                <Link to='/products' className='group hidden md:flex items-center w-52 m-2 gap-2 px-9 py-3 bg-primary
                hover:bg-primary-dull transition rounded text-white cursor-pointer'>
                    Explore details

                    <img className='transition group-hover:translate-x-1' src={black_arrow_icon} alt="" />
                </Link>
            </div>
            </div>
        </div>
    );
};

export default MainBanner;