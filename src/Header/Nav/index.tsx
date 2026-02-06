// 'use client'

// import React from 'react'
// import type { Header as HeaderType } from '@/payload-types'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import clsx from 'clsx'

// export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
//   const pathname = usePathname()
//   const navItems = data?.navItems || []
//   console.log(navItems,"navItemsnavItemsnavItems")
//   const logoSrc =
//     data.logo && typeof data.logo !== 'number' ? data.logo.url : null

//   return (
    
//       <div className="header-main max-w-[84rem] mx-auto flex items-center justify-between px-6">
//         {/* Logo */}
//         <Link href="/" className="logo">
//           {logoSrc && (
//             <img
//               src={logoSrc}
//               alt="Site Logo"
//               className="h-auto w-[120px]"
//             />
//           )}
//         </Link>

//         {/* Navigation */}
//         <nav>
//           <ul className="nav-menu flex gap-6 items-center">
//             {navItems.map((item, i) => {
//               const isActive = pathname === item.link?.url
//               const hasSubMenu =
//                 Array.isArray(item.subMenu) && item.subMenu.length > 0

//               return (
//                 <li key={i} className="relative group">
//                   <Link
//                     href={item.link?.url || '#'}
//                     className={clsx(
//                       'uppercase text-sm font-bold text-white flex items-center gap-1',
//                       isActive && 'active'
//                     )}
//                   >
//                     {item.link?.label}
//                     {hasSubMenu && (
//                       <span className="dropdown-arrow"></span>
//                     )}
//                   </Link>

//                   {/* Dropdown */}
//                   {hasSubMenu && (
//                     <ul className="absolute top-full left-0 mt-2 bg-[#ef7f1b] shadow-md min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                       {item.subMenu.map((subItem, subIndex) => (
//                         <li key={subIndex}>
//                           <Link
//                             href={subItem.link?.url || '#'}
//                             className="block px-4 py-2 text-sm text-white hover:bg-white/10"
//                           >
//                             {subItem.link?.label}
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               )
//             })}
//           </ul>
//         </nav>

//         {/* Search Icon */}
//         <div className="search-icon text-white cursor-pointer">
//           <i className="fa fa-search"></i>
//         </div>
//       </div>
//   )
// }




'use client'

import React, { useState } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { resolveLink } from '@/utils/resolveLink'
import HeaderSearch from '@/components/HeaderSearch'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const pathname = usePathname()
  const navItems = data?.navItems || []

  const [openSearch, setOpenSearch] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="bg-[#ef7f1b]">
        <div className="header-main max-w-[84rem] mx-auto flex items-center justify-between px-6 py-4">

          {/* Mobile Hamburger */}
          <button
            className="text-white text-2xl md:hidden"
            onClick={() => setOpenMenu(true)}
          >
            <i className="fa fa-bars" />
          </button>

          {/* Logo */}
          <Link href="/" className="logo">
            {data.logo && typeof data.logo !== 'number' && (
              <img
                src={data.logo.url}
                alt="Site Logo"
                className="h-auto w-[120px]"
              />
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="nav-menu flex gap-6 items-center">
              {navItems.map((item) => {
                const href = resolveLink(item.link)
                const isActive = pathname === href
                const hasSubMenu =
                  Array.isArray(item.subMenu) && item.subMenu.length > 0

                return (
                  <li key={item.id} className="relative group">
                    <Link
                      href={href}
                      target={item.link?.newTab ? '_blank' : undefined}
                      className={clsx(
                        'uppercase text-sm font-bold text-white flex items-center gap-1',
                        isActive && 'underline'
                      )}
                    >
                      {item.link?.label}
                      {hasSubMenu && <span className="dropdown-arrow" />}
                    </Link>

                    {/* Desktop Dropdown */}
                    {hasSubMenu && (
                      <ul className="absolute top-full left-0 mt-2 bg-[#ef7f1b] shadow-md min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {item.subMenu.map((subItem) => (
                          <li key={subItem.id}>
                            <Link
                              href={resolveLink(subItem.link)}
                              target={subItem.link?.newTab ? '_blank' : undefined}
                              className="block px-4 py-2 text-sm text-white hover:bg-white/10"
                            >
                              {subItem.link?.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Search Icon */}
          <button
            className="search-icon text-white cursor-pointer"
            onClick={() => setOpenSearch(true)}
          >
            <i className="fa fa-search" />
          </button>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      {openMenu && (
        <div className="fixed inset-0 bg-black/60 z-50 md:hidden">
          <div className="bg-[#ef7f1b] h-full w-[80%] max-w-[320px] p-6 transform transition-transform duration-300">

            {/* Close */}
            <button
              className="text-white text-2xl mb-6"
              onClick={() => setOpenMenu(false)}
            >
              <i className="fa fa-times" />
            </button>

            {/* Mobile Nav */}
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => {
                const href = resolveLink(item.link)
                const hasSubMenu =
                  Array.isArray(item.subMenu) && item.subMenu.length > 0

                return (
                  <li key={item.id}>
                    <div className="flex items-center justify-between">
                      <Link
                        href={href}
                        className="text-white font-semibold uppercase"
                        onClick={() => setOpenMenu(false)}
                      >
                        {item.link?.label}
                      </Link>

                      {hasSubMenu && (
                        <button
                          className="text-white"
                          onClick={() =>
                            setOpenSubMenu(
                              openSubMenu === item.id ? null : item.id
                            )
                          }
                        >
                          <i
                            className={`fa ${
                              openSubMenu === item.id
                                ? 'fa-chevron-up'
                                : 'fa-chevron-down'
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Mobile Submenu */}
                    {hasSubMenu && openSubMenu === item.id && (
                      <ul className="mt-2 ml-4 flex flex-col gap-2">
                        {item.subMenu.map((subItem) => (
                          <li key={subItem.id}>
                            <Link
                              href={resolveLink(subItem.link)}
                              className="text-white/90 text-sm"
                              onClick={() => setOpenMenu(false)}
                            >
                              {subItem.link?.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}

      {/* ================= SEARCH OVERLAY ================= */}
      {openSearch && (
        <div className="search-overlay fixed inset-0 z-50">
          <HeaderSearch onClose={() => setOpenSearch(false)} />
        </div>
      )}
    </>
  )
}

