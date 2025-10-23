'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog'
import { Button } from './ui/button'
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleSave = () => {
    if (selectedIndex !== null) {
      onSelect(items[selectedIndex])
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select City/County/State for ZIP {zip}</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left"></th>
                <th className="p-2 text-left font-semibold">City</th>
                <th className="p-2 text-left font-semibold">County</th>
                <th className="p-2 text-left font-semibold">State</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr 
                  key={index}
                  className={`border-b cursor-pointer hover:bg-gray-100 ${selectedIndex === index ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <td className="p-2">
                    <input
                      type="radio"
                      checked={selectedIndex === index}
                      onChange={() => setSelectedIndex(index)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="p-2">{item.city}</td>
                  <td className="p-2">{item.county}</td>
                  <td className="p-2">{item.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={selectedIndex === null}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

