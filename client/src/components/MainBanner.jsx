import React from 'react';
import main_banner_bg from '../assets/main_banner_bg.png';
import main_banner_bg_sm from '../assets/main_banner_bg_sm.png';



const MainBanner = () => {
    return (
        <div className='relative'>
            <img src={main_banner_bg} alt="banner" className='w-full hidden md:block' />
            <img src={main_banner_bg_sm} alt="banner" className='w-full  md:hidden' />
        </div>
    );
};

export default MainBanner;