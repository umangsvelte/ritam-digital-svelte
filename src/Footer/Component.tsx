// import { getCachedGlobal } from '@/utilities/getGlobals'
// import Link from 'next/link'
// import React from 'react'

// import type { Footer } from '@/payload-types'

// import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
// import { CMSLink } from '@/components/Link'
// import { Logo } from '@/components/Logo/Logo'

// export async function Footer() {
//   const footerData: Footer = await getCachedGlobal('footer', 1)()

//   const navItems = footerData?.navItems || []

//   return (
//     <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
//       <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
//         <Link className="flex items-center" href="/">
//           <Logo />
//         </Link>

//         <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
//           <ThemeSelector />
//           <nav className="flex flex-col md:flex-row gap-4">
//             {navItems.map(({ link }, i) => {
//               return <CMSLink className="text-white" key={i} {...link} />
//             })}
//           </nav>
//         </div>
//       </div>
//     </footer>
//   )
// }

import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import Link from 'next/link'

import type { Footer as FooterType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { ScrollToTop } from './ScrollToTop'

export async function Footer() {
  const footerData: FooterType = await getCachedGlobal('footer', 1)()

  if (!footerData) return null

  const {
    navItems = [],
    socialLinks = [],
    copyrightText,
    // notification_logo,
  } = footerData

  return (
    <footer className="footer bg-black text-white">
      <div className="footer-content">

        {/* LEFT */}
        <div className="footer-left">
          {/* {notification_logo && (
            <div className="footer-logo mb-2">
              <Media resource={notification_logo} imgClassName="h-10 w-auto" />
            </div>
          )} */}

          <div className="footer-copyright">
            {copyrightText && (
              <p dangerouslySetInnerHTML={{ __html: copyrightText }} />
            )}
          </div>
        </div>

        {/* CENTER */}
        <div className="footer-center">
          <div className="footer-nav-social">

            {/* NAV LINKS */}
            <div className="footer-links">
              {footerData.navItems?.map((item, index) => {
                const link = item.link

                if (!link) return null

                // Resolve href
                const href =
                  link.type === 'reference'
                    ? `/${link.reference?.value?.slug ?? ''}`
                    : link.url

                return (
                  <span key={item.id}>
                    <Link href={href || '#'}>
                      {link.label}
                    </Link>

                    {index < footerData.navItems.length - 1 && ' / '}
                  </span>
                )
              })}
            </div>

            {/* SOCIAL LINKS */}
            <div className="social-links">
              {socialLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <Media
                    resource={item.icon}
                    imgClassName="h-4 w-4"
                  />
                </Link>
              ))}
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="footer-right">
          <ScrollToTop />
        </div>

      </div>
    </footer>
  )
}

