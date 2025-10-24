'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { ZipCodeInfo } from '@/lib/store'

interface ZipCodeSelectionModalProps {
  open: boolean
  onClose: () => void
  onSelect: (item: ZipCodeInfo) => void
  items: ZipCodeInfo[]
  zip: string
}

export function ZipCodeSelectionModal({ 
  open, 
  onClose, 
  onSelect, 
  items, 
  zip 
}: ZipCodeSelectionModalProps) {
  const [selectedItem, setSelectedItem] = useState<ZipCodeInfo | null>(null)

  const handleSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem)
      setSelectedItem(null)
      onClose()
    }
  }

  const handleCancel = () => {
    setSelectedItem(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select City/County for Zip Code {zip}</DialogTitle>
        </DialogHeader>
        
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Multiple locations found for this zip code. Please select one.
          </p>
          
          <RadioGroup 
            value={selectedItem ? `${selectedItem.city}-${selectedItem.state}` : ''} 
            onValueChange={(value: string) => {
              const item = items.find(item => `${item.city}-${item.state}` === value)
              setSelectedItem(item || null)
            }}
            className="space-y-3"
          >
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={`${item.city}-${item.state}`} 
                  id={`option-${index}`}
                />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer pb-0 pl-2"
                >
                  <div className="font-medium">{item.city}</div>
                  <div className="text-sm text-gray-600">
                    {item.county && `${item.county}, `}
                    {item.state}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSelect}
            disabled={!selectedItem}
          >
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
