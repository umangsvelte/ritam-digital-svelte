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

import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { resolveLink } from '@/utils/resolveLink'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const pathname = usePathname()
  const navItems = data?.navItems || []

  return (
    <div className="header-main max-w-[84rem] mx-auto flex items-center justify-between px-6">
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

      {/* Navigation */}
      <nav>
        <ul className="nav-menu flex gap-6 items-center">
          {navItems.map((item, i) => {
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
                    isActive && 'active'
                  )}
                >
                  {item.link?.label}
                  {hasSubMenu && <span className="dropdown-arrow" />}
                </Link>

                {/* Dropdown */}
                {hasSubMenu && (
                  <ul className="absolute top-full left-0 mt-2 bg-[#ef7f1b] shadow-md min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {item.subMenu.map((subItem) => {
                      const subHref = resolveLink(subItem.link)

                      return (
                        <li key={subItem.id}>
                          <Link
                            href={subHref}
                            target={subItem.link?.newTab ? '_blank' : undefined}
                            className="block px-4 py-2 text-sm text-white hover:bg-white/10"
                          >
                            {subItem.link?.label}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Search Icon */}
      <div className="search-icon text-white cursor-pointer">
        <i className="fa fa-search" />
      </div>
    </div>
  )
}
