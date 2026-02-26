'use client'

import { Button } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

export default function AdminLogout() {
  const router = useRouter()

  return (
    <Button
      onClick={() => {
        router.push('/admin/logout')
      }}
    >
      Logout
    </Button>
  )
}
