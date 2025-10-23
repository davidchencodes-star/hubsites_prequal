'use client'

import { createContext, useContext } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface FormProviderProps {
  form: UseFormReturn<any>
  children: React.ReactNode
}

const FormContext = createContext<UseFormReturn<any> | null>(null)

export function FormProvider({ form, children }: FormProviderProps) {
  return (
    <FormContext.Provider value={form}>
      {children}
    </FormContext.Provider>
  )
}

export function useFormContext() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider')
  }
  return context
}

