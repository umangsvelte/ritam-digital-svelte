// import { getCachedGlobal } from '@/utilities/getGlobals'
// import React from 'react'
// import Link from 'next/link'

// import type { Footer as FooterType } from '@/payload-types'
// import { CMSLink } from '@/components/Link'
// import { Media } from '@/components/Media'
// import { ScrollToTop } from './ScrollToTop'

// export async function Footer() {
//   const footerData: FooterType = await getCachedGlobal('footer', 1)()

//   if (!footerData) return null

//   const {
//     navItems = [],
//     socialLinks = [],
//     copyrightText,
//     notification_logo,
//   } = footerData

//   return (
//     <footer className="footer bg-black text-white">
//       <div className="footer-content">

//         {/* LEFT */}
//         <div className="footer-left">
//           {notification_logo && (
//             <div className="footer-logo mb-2">
//               <Media resource={notification_logo} imgClassName="h-10 w-auto" />
//             </div>
//           )}

//           <div className="footer-copyright">
//             {copyrightText && (
//               <p dangerouslySetInnerHTML={{ __html: copyrightText }} />
//             )}
//           </div>
//         </div>

//         {/* CENTER */}
//         <div className="footer-center">
//           <div className="footer-nav-social">

//             {/* NAV LINKS */}
//             <div className="footer-links">
//               {footerData.navItems?.map((item, index) => {
//                 const link = item.link

//                 if (!link) return null

//                 // Resolve href
//                 const href =
//                   link.type === 'reference'
//                     ? `/${link.reference?.value?.slug ?? ''}`
//                     : link.url

//                 return (
//                   <span key={item.id}>
//                     <Link href={href || '#'}>
//                       {link.label}
//                     </Link>

//                     {index < footerData.navItems.length - 1 && ' / '}
//                   </span>
//                 )
//               })}
//             </div>

//             {/* SOCIAL LINKS */}
//             <div className="social-links">
//               {socialLinks.map((item, index) => (
//                 <Link
//                   key={index}
//                   href={item.url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="social-icon"
//                 >
//                   <Media
//                     resource={item.icon}
//                     imgClassName="h-4 w-4"
//                   />
//                 </Link>
//               ))}
//             </div>

//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="footer-right">
//           <ScrollToTop />
//         </div>

//       </div>
//     </footer>
//   )
// }


import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import { Media } from '@/components/Media'
import { ScrollToTop } from './ScrollToTop'

import type { Footer as FooterType } from '@/payload-types'

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
    <footer className="site-footer">
      <div className="footer-container">
        
        {/* LEFT */}
        <div className="footer-left">
          {/* <div className="bell-icon">
            {notification_logo ? (
              <Media
                resource={notification_logo}
                imgClassName="h-6 w-auto"
              />
            ) : (
              '🔔'
            )}
          </div> */}

          <div className="footer-text">
            {copyrightText && (
              <p
                dangerouslySetInnerHTML={{ __html: copyrightText }}
              />
            )}
          </div>
        </div>

        {/* CENTER */}
        <div className="footer-center">
          {navItems.map((item, index) => {
            const link = item.link
            if (!link) return null

            const href =
              link.type === 'reference'
                ? `/${link.reference?.value?.slug ?? ''}`
                : link.url

            return (
              <span key={item.id}>
                <Link href={href || '#'}>
                  {link.label}
                </Link>

                {index < navItems.length - 1 && <span> / </span>}
              </span>
            )
          })}
        </div>

        {/* RIGHT */}
        <div className="footer-right">
          {socialLinks.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social"
            >
              {item.icon ? (
                <Media
                  resource={item.icon}
                  imgClassName="h-4 w-4"
                />
              ) : (
                '•'
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll to top */}
        <ScrollToTop />
    </footer>
  )
}

