'use client';

import { Navbar, Header } from "@/components";
import { useState } from "react";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [nav, setNav] = useState(false);

    const handleNav = () => {
        setNav(!nav);
    }
    return (
        <div className=" h-full overflow-auto  bg-slate-200 py-5 md:py-8 px-5 lg:px-8 flex flex-col md:flex-row gap-2 md:gap-5 lg:gap-8">
            <div className="flex flex-col">
                <Header nav={nav} handleNav={handleNav} />
                <div className={!nav ? 'fixed  left-[-100%] md:relative md:left-0  md:flex flex-1' : 'fixed left-0 px-5 w-full md:w-auto top-20 transition-all duration-300 ease-in-out flex flex-1 '}>
                    <Navbar handleNav={handleNav} />
                </div>
            </div>
            <div className={!nav ? " overflow-auto bg-white p-2 md:p-6 lg:p-8 sm rounded-md flex flex-col flex-auto text-base lg:text-lg" : 'hidden'}>
                {children}
            </div>

        </div>
    )

}