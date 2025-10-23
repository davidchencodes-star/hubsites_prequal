import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface ZipCodeInfo {
  city: string
  county: string
  state?: string | null
}

export interface FetchedFormData {
  adfEmail: string | null
  adfEmails: Array<string> | string | null
  contactEmail: string | null
  name: string | null
  phone: string | null
  token?: string | null
}

export interface PrequalState {
  // Form data
  formData: {
    firstName: string
    MI: string
    lastName: string
    suffix: string
    address: string
    zip: string
    city: string
    state: string
    homePhone: string
    mobilephone: string
    email: string
    chkiagree: boolean
  }
  
  // UI state
  isLoading: boolean
  errors: Record<string, string[]>
  
  // Data fetching state
  isDataLoading: boolean
  showSuccessPage: boolean
  dataError: string | null
  fetchedData: FetchedFormData | null
  
  // Configuration
  config: {
    id: string
    primaryColor: string
    successPageEnabled: boolean
    successLogo: string
    dealerLocation: string
    btnType: string
    borderRadius: string
    borderWidth: string
    borderColor: string
    color: string
    backgroundColor: string
    hColor: string
    hBorderC: string
    bgHColor: string
    opacity: string
    thickness: string
  }
  
  // Actions
  updateFormData: (data: Partial<PrequalState['formData']>) => void
  setLoading: (loading: boolean) => void
  setErrors: (errors: Record<string, string[]>) => void
  clearErrors: () => void
  setConfig: (config: Partial<PrequalState['config']>) => void
  
  // Data fetching actions
  setDataLoading: (loading: boolean) => void
  setShowSuccessPage: (show: boolean) => void
  setDataError: (error: string | null) => void
  setFetchedData: (data: FetchedFormData | null) => void
  
  // Reset form
  resetForm: () => void
}

const initialFormData = {
  firstName: '',
  MI: '',
  lastName: '',
  suffix: ' ',
  address: '',
  zip: '',
  city: '',
  state: '',
  homePhone: '',
  mobilephone: '',
  email: '',
  chkiagree: false
}

const initialState = {
  formData: initialFormData,
  isLoading: false,
  errors: {},
  
  // Data fetching state
  isDataLoading: false,
  showSuccessPage: false,
  dataError: null,
  fetchedData: null,
  
  config: {
    id: '',
    primaryColor: '#d8534e',
    successPageEnabled: false,
    successLogo: '',
    dealerLocation: '',
    btnType: 'standard',
    borderRadius: '4px',
    borderWidth: '2px',
    borderColor: '#000000',
    color: '#ffffff',
    backgroundColor: 'rgba(0,0,0,1)',
    hColor: '#ffffff',
    hBorderC: '#000000',
    bgHColor: '#000000',
    opacity: '1',
    thickness: '2'
  }
}

export const usePrequalStore = create<PrequalState>()(
  devtools(
    (set) => ({
      ...initialState,
      
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setErrors: (errors) => set({ errors }),
      
      clearErrors: () => set({ errors: {} }),
      
      setConfig: (config) =>
        set((state) => ({
          config: { ...state.config, ...config }
        })),

      // Data fetching actions
      setDataLoading: (loading) => set({ isDataLoading: loading }),
      
      setShowSuccessPage: (show) => set({ showSuccessPage: show }),
      
      setDataError: (error) => set({ dataError: error }),
      
      setFetchedData: (data) => set({ fetchedData: data }),
      
      // Reset form
      resetForm: () => set({ formData: initialFormData })
    }),
    {
      name: 'prequal-store'
    }
  )
)

