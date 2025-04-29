import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductCategory = () => {
    const { products } = useAppContext()
    const { category } = useParams()

    const searchCategory = categories.find((item) => item.path.toLowerCase() === category)
    const filteredProducts = products.filter((product) => product.category.toLowerCase() === category)

    console.log(filteredProducts)
    return (
        <div>
            {searchCategory && (
                <div className='flex flex-col  w-max my-10  items-end m-auto'>
                    <p className='text-2xl font-medium'>{searchCategory.text.toUpperCase()}</p>
                    <div className='w-16 h-0.5 bg-primary rounded-full'></div>
                </div>
            )}

            {filteredProducts.length > 0 ? (
                <div className='mt-10 grid grid-cols-1 items-center m-auto sm:grid-cols-3 md:grid-cols-3 gap-3 
            md:gap-6 xl:grid-cols-5'>
                    {filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className='flex items-center justify-center h-[60vh]'>
                    <p className='text-2xl font-medium text-primary'>No products found in this Category</p>
                </div>
            )}
        </div>
    );
};

export default ProductCategory;