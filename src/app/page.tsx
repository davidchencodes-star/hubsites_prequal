'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { usePrequalStore } from '@/lib/store'
import { configSchema } from '@/lib/schemas'
import { PrequalForm } from '@/components/PrequalForm'
import { SuccessPage } from '@/components/SuccessPage'
import { useDataFetching } from '@/hooks/useDataFetching'
import { NotFound } from '@/components/NotFound'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { logError } from '@/lib/logger'

export default function Home() {
  const searchParams = useSearchParams()
  const { config, isDataLoading, dataError, setConfig, showSuccessPage, isLoading } = usePrequalStore()
  const { fetchData } = useDataFetching()
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parse URL parameters and set configuration
    const urlConfig = {
      id: searchParams.get('id') || '',
      primaryColor: searchParams.get('primaryColor') || '#d8534e',
      successPageEnabled: searchParams.get('successPageEnabled') === 'true',
      successLogo: searchParams.get('successLogo') || '',
      dealerLocation: searchParams.get('dealerLoc') || '',
      btnType: searchParams.get('btnType') || 'standard',
      borderRadius: searchParams.get('borderRadius') || '4px',
      borderWidth: searchParams.get('borderWidth') || '2px',
      borderColor: searchParams.get('borderColor') || '#000000',
      color: searchParams.get('color') || '#ffffff',
      backgroundColor: searchParams.get('bgColor') || 'rgba(0,0,0,1)',
      hColor: searchParams.get('hColor') || '#ffffff',
      hBorderC: searchParams.get('hBorderC') || '#000000',
      bgHColor: searchParams.get('bgHColor') || '#000000',
      opacity: searchParams.get('opacity') || '1',
      thickness: searchParams.get('thickness') || '2'
    }

    // Validate and set configuration
    try {
      const validatedConfig = configSchema.parse(urlConfig)
      setConfig(validatedConfig)
    } catch (error) {
      logError('Invalid configuration:', error)
    }
  }, [searchParams, setConfig])

  // Fetch data when component mounts if ID is provided
  useEffect(() => {
    const id = searchParams.get('id') || ''
    const fetchParams = {
      id,
      deployType: searchParams.get('deployType') || undefined,
      parentDomain: searchParams.get('parentDomain') || undefined,
      parentIP: searchParams.get('parentIP') || undefined,
    }
    
    fetchData(fetchParams)
  }, [searchParams, fetchData])

  useEffect(() => {
    if (frameRef && frameRef?.current) {
      const height = frameRef?.current.offsetHeight;
      parent.postMessage(`resize::${height}`, "*");
    } else {
      return;
    }
  }, [frameRef])

  // Check if we should show success page
  const showSuccess = config.successPageEnabled && showSuccessPage

  if (showSuccess) {
    return <SuccessPage />
  }

  // Show loading state while fetching data
  if (isDataLoading) {
    return <LoadingSpinner />
  }

  // Show error state if data fetching failed
  if (dataError) {
    return <NotFound />
  }

  return (
    <div className="min-h-screen bg-gray-50 relative" ref={frameRef}>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        scriptProps={{
          async: true,
          defer: true,
          appendTo: 'body',
        }}
        useRecaptchaNet={false}
        useEnterprise={false}
        container={{
          element: undefined,
          parameters: {
            badge: 'bottomright',
            theme: 'light',
          },
        }}
      >
        <PrequalForm />
      </GoogleReCaptchaProvider>

      {/* Loading Spinner Overlay - shows on top of form */}
      {isLoading && (
        <LoadingSpinner />
      )}
    </div>
  )
}
