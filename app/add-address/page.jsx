'use client'
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";

const AddAddress = () => {


    const { getToken, router } = useAppContext()

    const [address, setAddress] = useState({
        fullName: '',
        phoneNumber: '',
        area: '',
        city: '',
        state: '',
    })

    const handleNameChange = (e) => {
        const value = e.target.value.replace(/[0-9]/g, '');
        setAddress({ ...address, fullName: value });
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setAddress({ ...address, phoneNumber: value });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // Client-side required field validation
        const missing = [];
        if (!address.fullName.trim()) missing.push('Full name');
        if (!address.phoneNumber.trim()) missing.push('Phone number');
        if (!address.area.trim()) missing.push('Address (area/street)');
        if (!address.city.trim()) missing.push('City/District/Town');
        if (!address.state.trim()) missing.push('State');

        if (missing.length) {
            toast.error(`Please fill: ${missing.join(', ')}`);
            return;
        }

        try {
            const token = await getToken()

            const { data } = await axios.post('/api/user/add-address', { address }, { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) { 
                toast.success(data.message)
                router.push('/cart')
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }



    }

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
                <form onSubmit={onSubmitHandler} className="w-full">
                    <p className="text-2xl md:text-3xl text-gray-500">
                        Add Shipping <span className="font-semibold text-[#0f5815] ">Address</span>
                    </p>
                    <div className="space-y-3 max-w-sm mt-10">
                        <input
                            className="px-2 py-2.5 focus:border-gray-950 transition border border-gray-500/30 rounded outline-none w-full text-[#105223]"
                            type="text"
                            placeholder="Full name"
                            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                            value={address.fullName}
                        />
                        <input
                            className="px-2 py-2.5 focus:border-gray-950 transition border border-gray-500/30 rounded outline-none w-full text-[#105223]"
                            type="text"
                            placeholder="Phone number"
                            onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                            value={address.phoneNumber}
                        />
                        <textarea
                            className="px-2 py-2.5 focus:border-gray-950 transition border border-gray-500/30 rounded outline-none w-full text-[#105223] resize-none"
                            type="text"
                            rows={4}
                            placeholder="Address (Area and Street)"
                            required
                            onChange={(e) => setAddress({ ...address, area: e.target.value })}
                            value={address.area}
                        ></textarea>
                        <div className="flex space-x-3">
                            <input
                                className="px-2 py-2.5 focus:border-gray-950 transition border border-gray-500/30 rounded outline-none w-full text-[#105223]"
                                type="text"
                                placeholder="City/District/Town"
                                required
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                value={address.city}
                            />
                            <input
                                className="px-2 py-2.5 focus:border-gray-950 transition border border-gray-500/30 rounded outline-none w-full text-[#105223]"
                                type="text"
                                placeholder="Area"
                                required
                                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                value={address.state}
                            />
                        </div>
                    </div>
                    <button type="submit" className="max-w-sm w-full mt-6 bg-[#010c02] text-white hover:text-[#010c02] py-3 hover:bg-[#a7a7a7] uppercase">
                        Save address
                    </button>
                </form>
                <Image
                    className="md:mr-16 mt-16 md:mt-0"
                    src={assets.my_location_image}
                    alt="my_location_image"
                />
            </div>
            <Footer />
        </>
    );
};

export default AddAddress;