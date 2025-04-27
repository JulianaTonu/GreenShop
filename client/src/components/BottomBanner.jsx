import React from 'react';
import { assets } from '../assets/assets';

const BottomBanner = () => {
    return (
        <div className='relative mt-24'>
            <h1>BottomBanner</h1>
            <img src={assets.bottom_banner_image} alt="bannerImage" className='w-full hidden md:block' />

            <img src={assets.bottom_banner_image_sm} alt="bannerImage" className='w-full  md:hidden' />
        </div>
    );
};

export default BottomBanner;