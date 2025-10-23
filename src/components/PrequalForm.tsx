'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { ZipCodeSelectionModal } from './ZipCodeSelectionModal'
import { usePrequalStore, ZipCodeInfo } from '@/lib/store'
import { prequalFormSchema, suffixOptions } from '@/lib/schemas'
import { FormProvider } from './FormProvider'
import { parseSubmitData, getZipCode } from '@/lib/utils'
import { getFieldError } from '@/lib/formHelpers'
import { logit, logError } from '@/lib/logger'
import INFO from '@public/info.json'
import { RefreshCw } from 'lucide-react'

export function PrequalForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [privacyContent, setPrivacyContent] = useState('')
  const [termsContent, setTermsContent] = useState('')
  const [showZipModal, setShowZipModal] = useState(false)
  const [zipItems, setZipItems] = useState<ZipCodeInfo[]>([])
  const [currentZip, setCurrentZip] = useState('')
  const { config, setShowSuccessPage, fetchedData } = usePrequalStore()

  const form = useForm<any>({
    resolver: zodResolver(prequalFormSchema),
    defaultValues: {
      firstName: '',
      MI: '',
      lastName: '',
      suffix: '',
      address: '',
      zip: '',
      city: '',
      state: '',
      homePhone: '',
      mobilephone: '',
      email: '',
      chkiagree: false
    }
  })

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    parent.postMessage("submitted::", "*");

    if (!executeRecaptcha) {
      toast.warning('reCAPTCHA not loaded');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = await executeRecaptcha('submit');
      if (!token) {
        toast.warning('reCAPTCHA verification failed');
        setIsSubmitting(false);
        return;
      }
      const payload = parseSubmitData(data);
      payload.recaptcha = token;

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        // Clear form after successful submission
        form.reset();
        // Redirect to success page if enabled
        if (config.successPageEnabled) {
          setShowSuccessPage(true);
        } else {
          toast.success('Application submitted successfully')
        }
      } else {
        toast.error(result.message || 'Submission failed')
      }
    } catch (error) {
      logError('Submission error:', error)
      toast.error('Submission error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleZipDecode = async () => {
    const zip = form.getValues('zip')
    if (!zip) return

    await getZipCode(zip, form, (items, zip) => {
      setZipItems(items)
      setCurrentZip(zip)
      setShowZipModal(true)
    })
  }

  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value
    form.setValue('zip', zip)
    
    if (zip.length === 5) {
      await getZipCode(zip, form, (items, zip) => {
        setZipItems(items)
        setCurrentZip(zip)
        setShowZipModal(true)
      })
    }
  }

  const handleZipSelect = (item: ZipCodeInfo) => {
    form.setValue('city', item.city)
    form.setValue('state', item.state || '')
    setShowZipModal(false)
  }

  const loadPageContent = async (page: string, setContent: (content: string) => void) => {
    try {
      const response = await fetch('/api/page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page,
          name: fetchedData?.name,
          phone: fetchedData?.phone,
          email: fetchedData?.adfEmail
        }),
      })

      const result = await response.json()
      if (result.success) {
        setContent(result.content)
      }
    } catch (error) {
      logError('Error loading page:', error)
    }
  }

  const handleShowPrivacy = async () => {
    await loadPageContent('privacy.html', setPrivacyContent)
    setShowPrivacyModal(true)
  }

  const handleShowTerms = async () => {
    await loadPageContent('terms.html', setTermsContent)
    setShowTermsModal(true)
  }

  if (process.env.NODE_ENV === 'development') {
    logit(form.formState.errors);
  }

  return (
    <FormProvider form={form}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 max-w-4xl"
      >
        <Card className="p-8 shadow-sm">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <CardContent>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                <div className="md:col-span-4">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    {...form.register('firstName')}
                    placeholder="First Name"
                    aria-invalid={!!getFieldError(form.formState.errors, 'firstName')}
                  />
                  {getFieldError(form.formState.errors, 'firstName') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'firstName')}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="MI">MI</Label>
                  <Input
                    id="MI"
                    {...form.register('MI')}
                    placeholder="MI"
                  />
                </div>

                <div className="md:col-span-4">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    {...form.register('lastName')}
                    placeholder="Last Name"
                    aria-invalid={!!getFieldError(form.formState.errors, 'lastName')}
                  />
                  {getFieldError(form.formState.errors, 'lastName') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'lastName')}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="suffix">Suffix</Label>
                  <Select
                    value={form.watch('suffix')}
                    onValueChange={(value) => form.setValue('suffix', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Suffix" />
                    </SelectTrigger>
                    <SelectContent>
                      {suffixOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>

            {/* Residential Information Section */}
            <CardContent>
              <CardHeader>
                <CardTitle>Residential Information</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                <div className="md:col-span-12">
                  <Label htmlFor="address">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    {...form.register('address')}
                    placeholder="Address"
                    aria-invalid={!!getFieldError(form.formState.errors, 'address')}
                  />
                  {getFieldError(form.formState.errors, 'address') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'address')}</p>
                  )}
                </div>

                <div className="md:col-span-3">
                  <Label htmlFor="zip">
                    Zip <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="zip"
                      {...form.register('zip')}
                      placeholder="Zip"
                      onChange={handleZipChange}
                      aria-invalid={!!getFieldError(form.formState.errors, 'zip')}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleZipDecode}
                      title="Decode Zip"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  {getFieldError(form.formState.errors, 'zip') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'zip')}</p>
                  )}
                </div>

                <div className="md:col-span-6">
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    {...form.register('city')}
                    placeholder="City"
                    aria-invalid={!!getFieldError(form.formState.errors, 'city')}
                  />
                  {getFieldError(form.formState.errors, 'city') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'city')}</p>
                  )}
                </div>

                <div className="md:col-span-3">
                  <Label htmlFor="state">
                    State <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="state"
                    {...form.register('state')}
                    placeholder="State"
                    aria-invalid={!!getFieldError(form.formState.errors, 'state')}
                  />
                  {getFieldError(form.formState.errors, 'state') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'state')}</p>
                  )}
                </div>

                <div className="md:col-span-4">
                  <Label htmlFor="homePhone">Home Phone</Label>
                  <Input
                    id="homePhone"
                    {...form.register('homePhone')}
                    placeholder="Home Phone"
                    aria-invalid={!!getFieldError(form.formState.errors, 'homePhone')}
                  />
                  {getFieldError(form.formState.errors, 'homePhone') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'homePhone')}</p>
                  )}
                </div>

                <div className="md:col-span-4">
                  <Label htmlFor="mobilephone">
                    Cell Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mobilephone"
                    {...form.register('mobilephone')}
                    placeholder="Cell Phone"
                    aria-invalid={!!getFieldError(form.formState.errors, 'mobilephone')}
                  />
                  {getFieldError(form.formState.errors, 'mobilephone') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'mobilephone')}</p>
                  )}
                </div>

                <div className="md:col-span-4">
                  <Label htmlFor="email">
                    E-Mail Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder="E-Mail Address"
                    aria-invalid={!!getFieldError(form.formState.errors, 'email')}
                  />
                  {getFieldError(form.formState.errors, 'email') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'email')}</p>
                  )}
                </div>
              </div>
            </CardContent>

            {/* Footer Section */}
            <div className="border-t pt-8 px-6">
              <div className="text-right mb-4">
                <span className="text-sm">
                  <span className="text-red-500">*</span> required fields
                </span>
              </div>

              <div className="text-center mb-6">
                <button
                  type="button"
                  onClick={handleShowPrivacy}
                  className="text-blue-600 underline font-semibold mx-3"
                >
                  Privacy Notice
                </button>
                <button
                  type="button"
                  onClick={handleShowTerms}
                  className="text-blue-600 underline font-semibold mx-3"
                >
                  Terms and Conditions
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-900 text-justify mb-4">
                  By clicking the I Agree checkbox and Submit, I consent to have my credit file accessed for purposes of prequalifying for a vehicle loan. This is a soft inquiry and will not impact my credit score. I agree to the Privacy Notice, Terms and Conditions and I acknowledge I may be contacted by{' '}
                  <b>{fetchedData?.name}</b>.
                  <br />
                  I understand that I might not prequalify depending on the prequalification criteria.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 mb-6">
                <label className="flex items-center space-x-3">
                  <input
                    id="chkiagree"
                    type="checkbox"
                    {...form.register('chkiagree')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-900 font-semibold">I Agree</span>
                </label>
                {getFieldError(form.formState.errors, 'chkiagree') && (
                  <p className="text-red-500 text-sm">{getFieldError(form.formState.errors, 'chkiagree')}</p>
                )}
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 text-lg w-full"
                  style={{
                    backgroundColor: config.primaryColor,
                    borderRadius: config.borderRadius,
                    borderWidth: config.borderWidth,
                    color: config.color
                  }}
                >
                  {isSubmitting ? 'Please wait...' : 'Submit'}
                </Button>
              </div>

              <div className="w-full text-center pt-8">
                {INFO.version && <span className="text-sm">Version {INFO.version}</span>}
              </div>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Modals */}
      <ZipCodeSelectionModal
        open={showZipModal}
        onClose={() => setShowZipModal(false)}
        onSelect={handleZipSelect}
        items={zipItems}
        zip={currentZip}
      />

      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Notice</DialogTitle>
          </DialogHeader>
          <div dangerouslySetInnerHTML={{ __html: privacyContent }} />
        </DialogContent>
      </Dialog>

      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
          </DialogHeader>
          <div dangerouslySetInnerHTML={{ __html: termsContent }} />
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </FormProvider>
  )
}

