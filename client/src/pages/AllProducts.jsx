import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const AllProducts = () => {
    const { products, searchQuery } = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (searchQuery && searchQuery.length > 0) {
            setFilteredProducts(
                products.filter(product =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setFilteredProducts(products);
        }
    }, [products, searchQuery]);
    
    return (
        <div className='mt-16 flex flex-col items-center m-auto'>
            <div className='flex flex-col items-end w-max'>
                <p className='text-2xl font-medium uppercase'>All Product</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>
            <div className='mt-10 grid grid-cols-1 items-center m-auto sm:grid-cols-3 md:grid-cols-3 gap-3 
            md:gap-6 xl:grid-cols-5 '>
                {filteredProducts
                    .filter(product => product.inStock)
                    .map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
            </div>
        </div>
    );
};

export default AllProducts;
