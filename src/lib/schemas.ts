import { z } from 'zod'

// Common validation patterns
const phoneRegex = /^\d{10}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const zipCodeRegex = /^\d{5}(-\d{4})?$/

// Personal information schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  MI: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  suffix: z.string().optional()
})

// Residential information schema
export const residentialInfoSchema = z.object({
  address: z.string().min(1, 'Street address is required'),
  zip: z.string().min(1, 'Zip code is required').regex(zipCodeRegex, 'Invalid zip code format'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  homePhone: z.string().optional().refine(val => !val || phoneRegex.test(val), 'Invalid phone number'),
  mobilephone: z.string().min(1, 'Cell phone is required').regex(phoneRegex, 'Invalid phone number'),
  email: z.string().min(1, 'Email is required').regex(emailRegex, 'Invalid email format')
})

// Main prequal form schema
export const prequalFormSchema = personalInfoSchema.merge(residentialInfoSchema).extend({
  chkiagree: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions')
})

// Configuration Schema
export const configSchema = z.object({
  id: z.string().default(''),
  primaryColor: z.string().default('#d8534e'),
  successPageEnabled: z.boolean().default(false),
  successLogo: z.string().default(''),
  dealerLocation: z.string().default(''),
  btnType: z.string().default('standard'),
  borderRadius: z.string().default('4px'),
  borderWidth: z.string().default('2px'),
  borderColor: z.string().default('#000000'),
  color: z.string().default('#ffffff'),
  backgroundColor: z.string().default('rgba(0,0,0,1)'),
  hColor: z.string().default('#ffffff'),
  hBorderC: z.string().default('#000000'),
  bgHColor: z.string().default('#000000'),
  opacity: z.string().default('1'),
  thickness: z.string().default('2')
})

// Type exports
export type Config = z.infer<typeof configSchema>
export type PrequalFormData = z.infer<typeof prequalFormSchema>

// Suffix options
export const suffixOptions = [
  { value: ' ', label: 'Suffix' },
  { value: 'JR', label: 'JR' },
  { value: 'SR', label: 'SR' },
  { value: 'II', label: 'II' },
  { value: 'III', label: 'III' },
  { value: 'IV', label: 'IV' }
]

// State list for dropdowns
export const stateList = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
]
