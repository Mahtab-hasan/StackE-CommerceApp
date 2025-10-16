'use client'
import React, { useEffect, useState, useCallback } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {

  const { router, getToken, user } = useAppContext()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get('/api/product/seller-list', { headers: { Authorization: `Bearer ${token}` } })
      if(data.success){
        setProducts(data.products)
        setLoading(false)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = await getToken();
        const { data } = await axios.post('/api/product/delete', { productId }, { headers: { Authorization: `Bearer ${token}` } });
        if (data.success) {
          toast.success(data.message);
          setProducts(products.filter(p => p._id !== productId));
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error deleting product. Please try again later.");
      }
    }
  };

  useEffect(() => {
    if(user){
      fetchSellerProduct();
    }
  }, [user])

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Product</h2>
        <div className="w-full">
          {/* Mobile: card layout */}
          <div className="md:hidden space-y-4">
            {products.map((product) => (
              <div key={product._id} className="bg-white border border-gray-200 rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="bg-gray-500/10 rounded p-2 flex-shrink-0">
                    <Image
                      src={product.image?.[0] || assets.logo}
                      alt={product.name || 'product'}
                      width={80}
                      height={80}
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{product.category}</div>
                    <div className="text-sm text-[#0e6425] font-semibold">${product.offerPrice}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <button onClick={() => router.push(`/product/${product._id}`)} className="flex items-center gap-1 px-3 py-2 bg-[#0e6425] text-white rounded-md hover:bg-[#0c3f0c] transition transform hover:scale-105">
                    <span className="text-sm">Visit</span>
                    <Image src={assets.redirect_icon} alt="redirect" width={14} height={14} />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 transition">
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop / Laptop: table layout */}
          <div className="hidden md:flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className=" table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                  <th className="px-4 py-3 font-medium truncate">Category</th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product, index) => (
                  <tr key={index} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2">
                        <Image
                          src={product.image?.[0] || assets.logo}
                          alt={product.name || 'product Image'}
                          className="w-16"
                          width={1280}
                          height={720}
                        />
                      </div>
                      <span className="truncate w-full">{product.name}</span>
                    </td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">${product.offerPrice}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <button onClick={() => router.push(`/product/${product._id}`)} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-[#0e6425] text-white rounded-md  hover:bg-[#0c3f0c] transition-all duration-300 ">
                        <span>Visit</span>
                        <Image className="h-3.5" src={assets.redirect_icon} alt="redirect_icon" width={14} height={14} />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 transition-all duration-300 ">
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>}
      <Footer />
    </div>
  );
};

export default ProductList;