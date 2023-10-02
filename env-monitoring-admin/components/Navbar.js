'use client';
import Link from 'next/link'
import { RxDashboard } from 'react-icons/rx'
import { PiFactory, PiNewspaperClipping, PiTrash, PiGear } from 'react-icons/pi'
import { usePathname } from 'next/navigation'


const Navbar = ({ handleNav }) => {

    const pathname = usePathname();

    const checkNavClick = (e) => {
        if (window.innerWidth >= 768) return;
        setTimeout(handleNav, 500)
    }

    const inactiveLinkStyles = 'flex gap-2 lg:gap-3 py-2 lg:py-4 px-3 lg:px-5 text-xl md:text-base lg:text-xl font-semibold';
    const activeLinkStyles = ' bg-secondary text-primary duration-300 transition-all ease-in-out rounded-2xl md:scale-110' + ' ' + inactiveLinkStyles;
    const inactiveHoverStyles = ' hover:bg-slate-400 hover:bg-opacity-20 hover:rounded-2xl';

    return (
        <aside
            onClick={checkNavClick}
            className=' flex flex-1 md:flex-0 flex-col gap-4 md:gap-6 lg:gap-8 pt-4 px-2 md:px-0'>

            <nav >
                <Link className={pathname === '/' ? activeLinkStyles : inactiveLinkStyles + inactiveHoverStyles} href={'/'}>
                    <RxDashboard size={25} />
                    Dashboard
                </Link>
            </nav>
            <nav >
                <Link className={pathname === '/enterprises' ? activeLinkStyles : inactiveLinkStyles + inactiveHoverStyles} href={'/enterprises'}>
                    <PiFactory size={25} />
                    Enterprises
                </Link>
            </nav>
            <nav >
                <Link className={pathname === '/news' ? activeLinkStyles : inactiveLinkStyles + inactiveHoverStyles} href={'/news'}>
                    <PiNewspaperClipping size={25} />
                    News
                </Link>
            </nav>
            <nav >
                <Link className={pathname === '/pollution' ? activeLinkStyles : inactiveLinkStyles + inactiveHoverStyles} href={'/pollution'}>
                    <PiTrash size={25} />
                    Pollution
                </Link>
            </nav>
            <nav >
                <Link className={pathname === '/settings' ? activeLinkStyles : inactiveLinkStyles + inactiveHoverStyles} href={'/settings'}>
                    <PiGear size={25} />
                    Settings
                </Link>
            </nav>
        </aside>
    )
}

export default Navbar