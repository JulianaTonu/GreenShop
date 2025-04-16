import React from 'react';
import main_banner_bg from '../assets/main_banner_bg.png';
import main_banner_bg_sm from '../assets/main_banner_bg_sm.png';
import white_arrow_icon from '../assets/white_arrow_icon.svg';


import { Link } from 'react-router-dom'

const MainBanner = () => {
    return (
        <div className='relative'>
            <img src={main_banner_bg} alt="banner" className='w-full hidden md:block' />
            <img src={main_banner_bg_sm} alt="banner" className='w-full  md:hidden' />
            <div>
                <h1>Freshness you can Trust, Savings You will Love!</h1>
            </div>
            {/* //Shop Now */}
            <div>
                <Link to='/products' className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary
                hover:bg-primary-dull transition rounded text-white cursor-pointer'>
                    Shop Now

                    <img src={white_arrow_icon} alt="" />
                </Link>
            </div>
            
        </div>
    );
};

export default MainBanner;