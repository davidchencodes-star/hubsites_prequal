"use client"

import Image from 'next/image'

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div className="relative">
            <Image src="/img/GMA_blue.svg" alt="Loading" width={80} height={80} />
            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-300 absolute -top-8 -right-2"></div>
        </div>
    </div>
  )
}


