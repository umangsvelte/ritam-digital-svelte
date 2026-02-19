'use client'

import React, { useState, useEffect } from 'react'
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

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={clsx(
          "site-header transition-all duration-300",
          scrolled && "scrolled"
        )}
      >
        <div className="header-inner container">

          {/* Mobile Hamburger */}
          {/* <button
            className="text-white text-2xl md:hidden"
            onClick={() => setOpenMenu(true)}
          >
            <i className="fa fa-bars" />
          </button> */}
          <div
            className={clsx('hamburger md:hidden', openMenu && 'active')}
            onClick={() => setOpenMenu(true)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Logo */}
          <div className="site-logo">
            <Link href="/">
              {data.logo && typeof data.logo !== 'number' && (
                <img
                  src={data.logo.url}
                  alt="Site Logo"
                  style={{ height: '40px' }}
                />
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="main-navigation">
            <ul>
              {navItems.map((item) => {
                const href = resolveLink(item.link)
                // const isActive = pathname === href
                const isActive = pathname === href || pathname.startsWith(href + "/")
                const hasSubMenu =
                  Array.isArray(item.subMenu) && item.subMenu.length > 0

                return (
                  <li
                    key={item.id}
                    className={clsx(
                      hasSubMenu && "group relative",
                      hasSubMenu && "menu-item has-submenu",
                      isActive && "active"
                    )}
                  >
                    <Link
                      href={href}
                      target={item.link?.newTab ? '_blank' : undefined}
                      className={clsx(
                        'uppercase text-sm font-bold text-white flex items-center gap-1',
                        isActive && 'active'
                      )}
                    >
                      {item.link?.label}
                      {hasSubMenu && <span className="arrow">▼</span>}
                    </Link>

                    {/* Desktop Dropdown */}
                    {hasSubMenu && (
                      <ul className="submenu">
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
          <div className="header-search" onClick={() => setOpenSearch(true)}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}

        <div
          id="mobileNav"
          className={clsx(
            "mobile-nav transition-all duration-300",
            openMenu && "active"
          )}
        >
          {/* <div className="bg-[#ef7f1b] h-full w-[80%] max-w-[320px] p-6 transform transition-transform duration-300"> */}
            {/* Close */}
            <div className="mobile-nav-header">
              <span>Menu</span>
              <button className="close-menu" id="closeMenu" onClick={() => setOpenMenu(false)}>×</button>
            </div>

            {/* Mobile Nav */}
            <ul className="mobile-menu">
              {navItems.map((item) => {
                const href = resolveLink(item.link)
                const hasSubMenu =
                  Array.isArray(item.subMenu) && item.subMenu.length > 0

                const isOpen = openSubMenu === item.id

                return (
                  <li
                    key={item.id}
                    className={hasSubMenu ? "mobile-submenu-parent" : ""}
                  >
                    {hasSubMenu ? (
                      <>
                        {/* Parent Item */}
                        <div className="mobile-menu-item">
                          <Link
                            href={href}
                            onClick={() => setOpenMenu(false)}
                          >
                            {item.link?.label}
                          </Link>

                          <span
                            className={clsx(
                              "submenu-toggle",
                              isOpen && "rotate"
                            )}
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenSubMenu(isOpen ? null : item.id)
                            }}
                          >
                            ▼
                          </span>
                        </div>

                        {/* Submenu */}
                        <ul
                          className={clsx(
                            "mobile-submenu",
                            isOpen && "open"
                          )}
                        >
                          {item.subMenu.map((subItem) => (
                            <li key={subItem.id}>
                              <Link
                                href={resolveLink(subItem.link)}
                                onClick={() => setOpenMenu(false)}
                              >
                                {subItem.link?.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link
                        href={href}
                        onClick={() => setOpenMenu(false)}
                      >
                        {item.link?.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>

          {/* </div> */}
        </div>

      {/* ================= SEARCH OVERLAY ================= */}
      {openSearch && (
        <div className="search-overlay fixed inset-0 z-50">
          <HeaderSearch onClose={() => setOpenSearch(false)} />
        </div>
      )}
    </>
  )
}

