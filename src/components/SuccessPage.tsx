'use client'

import { usePrequalStore } from '@/lib/store'

export function SuccessPage() {
  const { config, fetchedData } = usePrequalStore()

  const handleViewInventory = () => {
    parent.postMessage("viewInventory::", "*");
  }

  if (config.successPageEnabled && config.successLogo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 mt-5">THANK YOU!</h1>
          <h3 className="text-xl text-gray-600 mb-4">We will contact you shortly.</h3>
          {config.successLogo && (
            <div className="my-4">
              <img src={config.successLogo} alt="Thank You App Image" id="successImg" className="mx-auto max-w-md" />
            </div>
          )}
          <div className="mt-4">
            <h3 className="text-xl text-gray-800">{fetchedData?.name}</h3>
          </div>
          <div>
            <h5 className="text-lg text-gray-600">{config.dealerLocation}</h5>
          </div>
          <div>
            <h5 className="text-lg text-gray-600">{fetchedData?.phone}</h5>
          </div>
          <div className="mt-5">
            <h4 className="text-lg text-gray-800">In The Meantime…</h4>
          </div>
          <div className="mt-4">
            <button 
              id="inventoryBtn" 
              onClick={handleViewInventory}
              style={{
                padding: '10px 20px',
                borderRadius: config.borderRadius,
                borderWidth: config.btnType === 'styled' ? config.borderWidth : '0',
                borderColor: config.btnType === 'styled' ? config.borderColor : 'transparent',
                color: config.color,
                backgroundColor: config.backgroundColor,
                borderStyle: 'solid',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (config.btnType === 'styled') {
                  e.currentTarget.style.borderColor = config.hBorderC;
                  e.currentTarget.style.color = config.hColor;
                  e.currentTarget.style.opacity = config.opacity;
                  e.currentTarget.style.backgroundColor = config.bgHColor;
                }
              }}
              onMouseLeave={(e) => {
                if (config.btnType === 'styled') {
                  e.currentTarget.style.borderColor = config.borderColor;
                  e.currentTarget.style.color = config.color;
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.backgroundColor = config.backgroundColor;
                }
              }}
            >
              <span>View More Inventory</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-xl mb-4">Thank you, your application was received.</div>
        <div className="text-base">We will contact you shortly.</div>
      </div>
    </div>
  )
}


