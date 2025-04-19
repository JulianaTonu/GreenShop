import React from 'react';
import ProductCard from './ProductCard';

const BestSeller = () => {
    return (
        <div className='my-4'>
            <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>

            <div>
                <ProductCard/>
            </div>
        </div>
    );
};

export default BestSeller;