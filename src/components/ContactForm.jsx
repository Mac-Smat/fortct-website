import { useEffect, useState } from 'react'
import { ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react'
import { LiquidMetalButton } from './LiquidMetalButton.jsx'
import { fetchPublishedCategories } from '../lib/public-api.js'
import { normalizeWhatsAppNumber, submitEnquiry } from '../lib/enquiry-api.js'

const GENERAL_ENQUIRY = 'General Enquiry'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputBase =
  'w-full h-[48px] bg-[#F9F9F9] rounded-[12px] px-[14px] text-[14px] text-[#1A1C1C] placeholder:text-[#B7BBC4] outline-none focus:ring-2 transition-shadow border border-[#C5C8BC]/50 dark:bg-[#0F0F11] dark:text-[#F2F2F1] dark:placeholder:text-[#5C5C66] dark:border-[#26262B]'

const inputValid =
  'border-[#C5C8BC]/50 focus:ring-[#E0EC38]/60 focus:border-[#E0EC38]/60'

const inputInvalid =
  'border-[#B42318]/70 focus:ring-[#B42318]/40 focus:border-[#B42318]/70'

export default function ContactForm({ selectedService, onServiceChange }) {
  const [values, setValues] = useState({
    name: '',
    whatsapp: '',
    email: '',
    service: '',
    message: '',
    hp: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [serviceOptions, setServiceOptions] = useState([GENERAL_ENQUIRY])
  const [servicesUnavailable, setServicesUnavailable] = useState(false)

  useEffect(() => {
    let active = true
    fetchPublishedCategories()
      .then((rows) => {
        if (!active) return
        setServiceOptions([
          GENERAL_ENQUIRY,
          ...rows.map((c) => c.name),
        ])
      })
      .catch(() => {
        if (!active) return
        setServicesUnavailable(true)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (selectedService) {
      setValues((v) => ({ ...v, service: selectedService }))
    }
  }, [selectedService])

  const setField = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: undefined }))
    }
  }

  const validate = () => {
    const next = {}
    if (!values.name.trim()) {
      next.name = 'Please enter your full name'
    } else if (values.name.trim().length < 2) {
      next.name = 'Name must be at least 2 characters'
    }
    if (!values.whatsapp.trim()) {
      next.whatsapp = 'Please enter your WhatsApp number'
    } else if (!normalizeWhatsAppNumber(values.whatsapp)) {
      next.whatsapp =
        'Please enter a valid WhatsApp number with country code (e.g. +234 707 787 5475)'
    }
    if (values.email.trim() && !EMAIL_RE.test(values.email.trim())) {
      next.email = 'Please enter a valid email address'
    }
    if (!values.message.trim()) {
      next.message = 'Please tell us how we can help'
    } else if (values.message.trim().length < 10) {
      next.message = 'Message must be at least 10 characters'
    }
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await submitEnquiry({
        full_name: values.name,
        whatsapp_number: values.whatsapp,
        email: values.email,
        service_name: values.service || GENERAL_ENQUIRY,
        message: values.message,
        hp: values.hp,
      })
      setSubmitted(true)
      setValues({ name: '', whatsapp: '', email: '', service: '', message: '', hp: '' })
      onServiceChange?.('')
    } catch (err) {
      setSubmitError(
        err?.status === 429
          ? 'Too many submissions. Please try again in a few minutes.'
          : 'Something went wrong sending your enquiry. Please try again, or email us directly at hello@fortct.ltd.',
      )
    } finally {
      setSubmitting(false)
    }
    setTimeout(() => {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const fieldClass = (field) =>
    `${inputBase} ${errors[field] ? inputInvalid : inputValid}`

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px overflow-hidden"
      >
        <label htmlFor="contact-hp">Leave this field empty</label>
        <input
          id="contact-hp"
          type="text"
          name="hp"
          tabIndex={-1}
          autoComplete="off"
          value={values.hp}
          onChange={(e) => setField('hp', e.target.value)}
        />
      </div>

      {submitted && (
        <div
          role="status"
          className="mb-8 flex items-start gap-3 rounded-[16px] border border-[#3D4D2B]/30 bg-[#3D4D2B]/5 p-4 dark:border-[#AAB95F]/30 dark:bg-[#AAB95F]/10"
        >
          <CheckCircle2 className="w-5 h-5 text-[#3D4D2B] mt-0.5 shrink-0 dark:text-[#AAB95F]" />
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-semibold text-[#1A1C1C] dark:text-[#F2F2F1]">
              Enquiry received!
            </p>
            <p className="text-[13px] font-normal leading-[20px] text-[#45483F] dark:text-[#A1A1AA]">
              Thank you for reaching out. Our team will contact you on WhatsApp within 24 hours.
            </p>
          </div>
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          className="mb-8 flex items-start gap-3 rounded-[16px] border border-[#B42318]/40 bg-[#B42318]/5 p-4 dark:border-[#E5484D]/40 dark:bg-[#E5484D]/10"
        >
          <AlertCircle className="w-5 h-5 text-[#B42318] mt-0.5 shrink-0 dark:text-[#E5484D]" />
          <p className="text-[13px] font-normal leading-[20px] text-[#B42318] dark:text-[#E5484D]">
            {submitError}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-name" className="block mb-[6px] text-[12px] font-normal text-[#666666] leading-[16px] dark:text-[#A1A1AA]">
            Full Name <span className="text-[#3D4D2B] dark:text-[#AAB95F]">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            placeholder="Full name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className={fieldClass('name')}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1.5 text-[12px] font-normal text-[#B42318] leading-[16px]">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className="block mb-[6px] text-[12px] font-normal text-[#666666] leading-[16px] dark:text-[#A1A1AA]">
            Email Address <span className="text-[#B7BBC4] dark:text-[#5C5C66]">(optional)</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder="Email address"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className={fieldClass('email')}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-1.5 text-[12px] font-normal text-[#B42318] leading-[16px]">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-whatsapp" className="block mb-[6px] text-[12px] font-normal text-[#666666] leading-[16px] dark:text-[#A1A1AA]">
            WhatsApp Number <span className="text-[#3D4D2B] dark:text-[#AAB95F]">*</span>
          </label>
          <input
            id="contact-whatsapp"
            type="tel"
            name="whatsapp"
            placeholder="e.g. +234 707 787 5475"
            autoComplete="tel"
            inputMode="tel"
            value={values.whatsapp}
            onChange={(e) => setField('whatsapp', e.target.value)}
            aria-invalid={!!errors.whatsapp}
            aria-describedby={
              errors.whatsapp
                ? 'contact-whatsapp-error'
                : 'contact-whatsapp-hint'
            }
            className={fieldClass('whatsapp')}
          />
          {errors.whatsapp ? (
            <p id="contact-whatsapp-error" className="mt-1.5 text-[12px] font-normal text-[#B42318] leading-[16px]">
              {errors.whatsapp}
            </p>
          ) : (
            <p id="contact-whatsapp-hint" className="mt-1.5 text-[12px] font-normal text-[#B7BBC4] leading-[16px] dark:text-[#5C5C66]">
              We&apos;ll contact you on WhatsApp.
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-service" className="block mb-[6px] text-[12px] font-normal text-[#666666] leading-[16px] dark:text-[#A1A1AA]">
            Service
          </label>
          <div className="relative">
            <select
              id="contact-service"
              name="service"
              value={values.service}
              onChange={(e) => setField('service', e.target.value)}
              className={`${inputBase} appearance-none pr-10 cursor-pointer ${
                values.service ? '' : 'text-[#B7BBC4] dark:text-[#5C5C66]'
              }`}
            >
              <option value="" disabled>
                Select a service
              </option>
              {serviceOptions.map((option) => (
                <option key={option} value={option} className="text-[#1A1C1C] dark:text-[#F2F2F1]">
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#45483F] dark:text-[#A1A1AA] pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2" />
          </div>
          {servicesUnavailable && (
            <p className="mt-1.5 text-[12px] font-normal text-[#B7BBC4] leading-[16px] dark:text-[#5C5C66]">
              Service list unavailable — check your connection and try again.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="contact-message" className="block mb-[6px] text-[12px] font-normal text-[#666666] leading-[16px] dark:text-[#A1A1AA]">
          Message <span className="text-[#3D4D2B] dark:text-[#AAB95F]">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows="5"
          placeholder="Tell us about your project..."
          value={values.message}
          onChange={(e) => setField('message', e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={`${fieldClass('message')} h-[124px] resize-none py-[14px]`}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1.5 text-[12px] font-normal text-[#B42318] leading-[16px]">
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <LiquidMetalButton
          variant="light"
          label={submitting ? 'Sending…' : 'Send Message'}
          showArrow
          width={190}
          onClick={() => {}}
        />
      </div>
    </form>
  )
}
