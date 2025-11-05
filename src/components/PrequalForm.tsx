'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations()
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
  })

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    parent.postMessage("submitted::", "*");

    if (!executeRecaptcha) {
      toast.warning(t('messages.recaptchaNotLoaded'));
      setIsSubmitting(false);
      return;
    }

    try {
      const token = await executeRecaptcha('submit');
      if (!token) {
        toast.warning(t('messages.recaptchaFailed'));
        setIsSubmitting(false);
        return;
      }
      const payload = parseSubmitData(data);

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          recaptcha: token
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Clear form after successful submission
        form.reset();
        // Redirect to success page if enabled
        if (config.successPageEnabled) {
          setShowSuccessPage(true);
        } else {
          toast.success(t('messages.applicationSubmitted'))
        }
      } else {
        toast.error(result.message || t('messages.submissionFailed'))
      }
    } catch (error) {
      logError('Submission error:', error)
      toast.error(t('messages.submissionError'))
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

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logit(form.formState.errors);
    }
  }, [form.formState.errors])

  return (
    <FormProvider form={form}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-2 md:p-4 max-w-4xl"
      >
        <Card className="p-4 md:p-8 shadow-sm">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <CardContent>
              <CardHeader>
                <CardTitle>{t('sections.personalInformation')}</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                <div className="md:col-span-4">
                  <Label htmlFor="firstName">
                    {t('labels.firstName')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    {...form.register('firstName')}
                    placeholder={t('placeholders.firstName')}
                    aria-invalid={!!getFieldError(form.formState.errors, 'firstName')}
                  />
                  {getFieldError(form.formState.errors, 'firstName') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'firstName')}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="MI">{t('labels.middleInitial')}</Label>
                  <Input
                    id="MI"
                    {...form.register('MI')}
                    placeholder={t('placeholders.middleInitial')}
                  />
                </div>

                <div className="md:col-span-4">
                  <Label htmlFor="lastName">
                    {t('labels.lastName')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    {...form.register('lastName')}
                    placeholder={t('placeholders.lastName')}
                    aria-invalid={!!getFieldError(form.formState.errors, 'lastName')}
                  />
                  {getFieldError(form.formState.errors, 'lastName') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'lastName')}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="suffix">{t('labels.suffix')}</Label>
                  <Select
                    value={form.watch('suffix') || ' '}
                    onValueChange={(value) => form.setValue('suffix', value === ' ' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('placeholders.suffix')} />
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
                <CardTitle>{t('sections.residentialInformation')}</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                <div className="md:col-span-12">
                  <Label htmlFor="address">
                    {t('labels.address')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    {...form.register('address')}
                    placeholder={t('placeholders.address')}
                    aria-invalid={!!getFieldError(form.formState.errors, 'address')}
                  />
                  {getFieldError(form.formState.errors, 'address') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'address')}</p>
                  )}
                </div>

                <div className="md:col-span-3">
                  <Label htmlFor="zip">
                    {t('labels.zip')} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="zip"
                      {...form.register('zip')}
                      placeholder={t('placeholders.zip')}
                      onChange={handleZipChange}
                      aria-invalid={!!getFieldError(form.formState.errors, 'zip')}
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={handleZipDecode}
                      title={t('buttons.decodeZip')}
                      className="absolute right-0 top-0 h-full px-3 bg-gray-100 hover:bg-gray-200 rounded-r-sm border-l border-gray-300 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  {getFieldError(form.formState.errors, 'zip') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'zip')}</p>
                  )}
                </div>

                <div className="md:col-span-6">
                  <Label htmlFor="city">
                    {t('labels.city')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    {...form.register('city')}
                    placeholder={t('placeholders.city')}
                    aria-invalid={!!getFieldError(form.formState.errors, 'city')}
                  />
                  {getFieldError(form.formState.errors, 'city') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'city')}</p>
                  )}
                </div>

                <div className="md:col-span-3">
                  <Label htmlFor="state">
                    {t('labels.state')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="state"
                    {...form.register('state')}
                    placeholder={t('placeholders.state')}
                    aria-invalid={!!getFieldError(form.formState.errors, 'state')}
                  />
                  {getFieldError(form.formState.errors, 'state') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'state')}</p>
                  )}
                </div>

                <div className="md:col-span-4">
                  <Label htmlFor="homePhone">{t('labels.homePhone')}</Label>
                  <Input
                    id="homePhone"
                    value={(() => {
                      const phone = form.watch('homePhone') || ''
                      const digits = phone.replace(/\D/g, '')
                      if (digits.length <= 3) return digits
                      if (digits.length <= 6) return `(${digits.slice(0, 3)})${digits.slice(3)}`
                      return `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6, 10)}`
                    })()}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                      form.setValue('homePhone', digits)
                    }}
                    placeholder={t('placeholders.homePhone')}
                    maxLength={13}
                    aria-invalid={!!getFieldError(form.formState.errors, 'homePhone')}
                  />
                  {getFieldError(form.formState.errors, 'homePhone') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'homePhone')}</p>
                  )}
                </div>

                <div className="md:col-span-4">
                  <Label htmlFor="mobilephone">
                    {t('labels.cellPhone')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mobilephone"
                    value={(() => {
                      const phone = form.watch('mobilephone') || ''
                      const digits = phone.replace(/\D/g, '')
                      if (digits.length <= 3) return digits
                      if (digits.length <= 6) return `(${digits.slice(0, 3)})${digits.slice(3)}`
                      return `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6, 10)}`
                    })()}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                      form.setValue('mobilephone', digits)
                    }}
                    placeholder={t('placeholders.cellPhone')}
                    maxLength={13}
                    aria-invalid={!!getFieldError(form.formState.errors, 'mobilephone')}
                  />
                  {getFieldError(form.formState.errors, 'mobilephone') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'mobilephone')}</p>
                  )}
                </div>

                <div className="md:col-span-4">
                  <Label htmlFor="email">
                    {t('labels.email')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder={t('placeholders.email')}
                    aria-invalid={!!getFieldError(form.formState.errors, 'email')}
                  />
                  {getFieldError(form.formState.errors, 'email') && (
                    <p className="text-red-500 text-sm mt-1">{getFieldError(form.formState.errors, 'email')}</p>
                  )}
                </div>
              </div>
            </CardContent>

            {/* Footer Section */}
            <div className="border-t pt-8 px-3 md:px-6">
              <div className="text-right mb-4">
                <span className="text-sm">
                  <span className="text-red-500">*</span> {t('common.requiredFields')}
                </span>
              </div>

              <div className="text-center mb-6">
                <button
                  type="button"
                  onClick={handleShowPrivacy}
                  className="text-blue-600 underline font-semibold mx-3 cursor-pointer"
                >
                  {t('buttons.privacyNotice')}
                </button>
                <button
                  type="button"
                  onClick={handleShowTerms}
                  className="text-blue-600 underline font-semibold mx-3 cursor-pointer"
                >
                  {t('buttons.termsAndConditions')}
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-900 text-justify mb-4">
                  {t('consent.consentText')}{' '}
                  <b>{fetchedData?.name}</b>.
                  <br />
                  {t('consent.prequalificationNote')}
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
                  <span className="text-gray-900 font-semibold">{t('buttons.iAgree')}</span>
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
                  {isSubmitting ? t('common.pleaseWait') : t('common.submit')}
                </Button>
              </div>

              <div className="w-full text-center pt-8">
                {INFO.version && <span className="text-sm">{t('common.version')} {INFO.version}</span>}
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
            <DialogTitle>{t('modal.privacyTitle')}</DialogTitle>
          </DialogHeader>
          <div dangerouslySetInnerHTML={{ __html: privacyContent }} />
        </DialogContent>
      </Dialog>

      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('modal.termsTitle')}</DialogTitle>
          </DialogHeader>
          <div dangerouslySetInnerHTML={{ __html: termsContent }} />
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </FormProvider>
  )
}