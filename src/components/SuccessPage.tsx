'use client'

import { usePrequalStore } from '@/lib/store'
import { Button } from './ui/button'
import { CheckCircle } from 'lucide-react'

interface SuccessPageProps {
  className?: string
}

export function SuccessPage({ className }: SuccessPageProps) {
  const { config, fetchedData } = usePrequalStore()

  const handleViewInventory = () => {
    if (typeof parent !== 'undefined') {
      parent.postMessage("viewInventory::", "*")
    }
  }

  const getButtonStyles = () => {
    if (config.btnType === 'styled') {
      return {
        padding: '10px 20px',
        borderRadius: config.borderRadius,
        borderWidth: config.borderWidth,
        borderColor: config.borderColor,
        color: config.color,
        backgroundColor: config.backgroundColor,
        borderStyle: 'solid' as const,
      }
    }
    return {}
  }

  const getHoverStyles = () => {
    if (config.btnType === 'styled') {
      return {
        borderColor: config.hBorderC,
        color: config.hColor,
        opacity: config.opacity,
        backgroundColor: config.bgHColor,
      }
    }
    return {}
  }

  const renderCustomSuccessPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Thank You!</h1>
        <p className="text-xl text-gray-600 mb-6">We will contact you shortly.</p>
        
        {config.successLogo && (
          <div className="my-6">
            <img 
              src={config.successLogo} 
              alt="Thank You" 
              className="mx-auto max-w-md h-auto" 
            />
          </div>
        )}
        
        <div className="space-y-2 mb-8">
          <h3 className="text-xl text-gray-800 font-semibold">{fetchedData?.name}</h3>
          {config.dealerLocation && (
            <p className="text-lg text-gray-600">{config.dealerLocation}</p>
          )}
          {fetchedData?.phone && (
            <p className="text-lg text-gray-600">{fetchedData.phone}</p>
          )}
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg text-gray-800 font-medium">In The Meantime…</h4>
          <Button 
            onClick={handleViewInventory}
            className="px-6 py-3 text-base font-medium"
            style={getButtonStyles()}
            onMouseEnter={(e) => {
              if (config.btnType === 'styled') {
                Object.assign(e.currentTarget.style, getHoverStyles())
              }
            }}
            onMouseLeave={(e) => {
              if (config.btnType === 'styled') {
                Object.assign(e.currentTarget.style, getButtonStyles())
              }
            }}
          >
            View More Inventory
          </Button>
        </div>
      </div>
    </div>
  )

  const renderDefaultSuccessPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4 max-w-md">
        <div className="mb-8 flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Thank you, your application was received.
        </h1>
        <p className="text-base text-gray-600">
          We will contact you shortly.
        </p>
      </div>
    </div>
  )

  return (
    <div className={className}>
      {config.successPageEnabled && config.successLogo 
        ? renderCustomSuccessPage() 
        : renderDefaultSuccessPage()
      }
    </div>
  )
}

