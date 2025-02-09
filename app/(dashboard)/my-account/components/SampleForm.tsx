'use client'

import { sampleInputSchema } from '@/lib/schema'
import { Button } from '@radix-ui/themes'
import { useState } from 'react'
import 'react-calendar/dist/Calendar.css'
import DateTimePicker from 'react-datetime-picker'
import 'react-datetime-picker/dist/DateTimePicker.css'
import { z } from 'zod'

export function SampleForm() {
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [date, setDate] = useState<Date | null>(new Date())
  const [sampleType, setSampleType] = useState('manual')
  const [copper, setCopper] = useState('')
  const [lead, setLead] = useState('')
  const [nickel, setNickel] = useState('')
  const [mercury, setMercury] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [successMsg, setSuccessMsg] = useState('')

  const validateField = (field: string, value: string) => {
    if (!value) return

    let schema
    let errorMessage = ''
    switch (field) {
      case 'latitude':
        schema = z.number().min(-90).max(90)
        errorMessage = 'Latitude must be between -90° and 90°'
        break
      case 'longitude':
        schema = z.number().min(-180).max(180)
        errorMessage = 'Longitude must be between -180° and 180°'
        break
      case 'copper':
      case 'lead':
      case 'nickel':
      case 'mercury':
        schema = z.number()
        errorMessage = 'Please enter a valid number'
        break
      default:
        return
    }

    const result = schema.safeParse(Number(value))
    if (!result.success) {
      setFieldErrors((prev) => ({ ...prev, [field]: errorMessage }))
    } else {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleFieldChange = (
    field: string,
    value: string,
    setter: (value: string) => void,
  ) => {
    setter(value)
    validateField(field, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prepare form data with proper types
    if (!date) {
      setErrors(['Date is required.'])
      return
    }

    // Check for field errors before submitting
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(['Please fix all field errors before submitting.'])
      return
    }

    const measurements: Record<string, number> = {}
    if (copper) measurements.Copper = Number(copper)
    if (lead) measurements.Lead = Number(lead)
    if (nickel) measurements.Nickel = Number(nickel)
    if (mercury) measurements.Mercury = Number(mercury)

    const formData = {
      latitude: Number(latitude),
      longitude: Number(longitude),
      date: date.toISOString(),
      sampleType,
      measurements,
    }

    // Validate the form data using Zod
    const parseResult = sampleInputSchema.safeParse(formData)
    if (!parseResult.success) {
      const errs = parseResult.error.errors.map((err) => err.message)
      setErrors(errs)
      return
    }
    setErrors([])

    try {
      const res = await fetch('/api/samples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccessMsg('Sample submitted successfully.')
        // Reset form
        setLatitude('')
        setLongitude('')
        setDate(new Date())
        setSampleType('manual')
        setCopper('')
        setLead('')
        setNickel('')
        setMercury('')
        setFieldErrors({})
      } else {
        setErrors([data.error || 'Failed to save sample.'])
      }
    } catch (error) {
      console.error('Error submitting sample:', error)
      setErrors(['An error occurred while submitting the sample.'])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="text-red-10">
          {errors.map((err, idx) => (
            <p key={idx}>{err}</p>
          ))}
        </div>
      )}
      {successMsg && (
        <div className="text-green-10">
          <p>{successMsg}</p>
        </div>
      )}
      <div>
        <label
          htmlFor="latitude"
          className="block text-sm font-medium text-gray-11"
        >
          Latitude <span className="text-red-10">*</span>
        </label>
        <input
          type="number"
          id="latitude"
          name="latitude"
          value={latitude}
          onChange={(e) =>
            handleFieldChange('latitude', e.target.value, setLatitude)
          }
          onBlur={(e) => validateField('latitude', e.target.value)}
          className={`mt-1 block w-full rounded-lg border ${
            fieldErrors.latitude ? 'border-red-6' : 'border-gray-6'
          } bg-gray-2 px-4 py-3 text-lg text-gray-12 placeholder-gray-8 focus:border-accent-8 focus:outline-none focus:ring-2 focus:ring-accent-7 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 [-moz-appearance:textfield]`}
          placeholder="Enter latitude"
          step="any"
          required
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          aria-describedby={fieldErrors.latitude ? 'latitude-error' : undefined}
        />
        {fieldErrors.latitude && (
          <p id="latitude-error" className="mt-1 text-sm text-red-10">
            {fieldErrors.latitude}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="longitude"
          className="block text-sm font-medium text-gray-11"
        >
          Longitude <span className="text-red-10">*</span>
        </label>
        <input
          type="number"
          id="longitude"
          name="longitude"
          value={longitude}
          onChange={(e) =>
            handleFieldChange('longitude', e.target.value, setLongitude)
          }
          onBlur={(e) => validateField('longitude', e.target.value)}
          className={`mt-1 block w-full rounded-lg border ${
            fieldErrors.longitude ? 'border-red-6' : 'border-gray-6'
          } bg-gray-2 px-4 py-3 text-lg text-gray-12 placeholder-gray-8 focus:border-accent-8 focus:outline-none focus:ring-2 focus:ring-accent-7 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 [-moz-appearance:textfield]`}
          placeholder="Enter longitude"
          step="any"
          required
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          aria-describedby={
            fieldErrors.longitude ? 'longitude-error' : undefined
          }
        />
        {fieldErrors.longitude && (
          <p id="longitude-error" className="mt-1 text-sm text-red-10">
            {fieldErrors.longitude}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-11"
        >
          Date & Time <span className="text-red-10">*</span>
        </label>
        <div className="mt-1">
          <DateTimePicker
            onChange={setDate}
            value={date || new Date()}
            format="yyyy-MM-dd HH:mm"
            disableClock={true}
            clearIcon={null}
            calendarIcon={null}
            className="w-full [&_.react-datetime-picker__wrapper]:rounded-lg [&_.react-datetime-picker__wrapper]:border-gray-6 [&_.react-datetime-picker__wrapper]:bg-gray-2 [&_.react-datetime-picker__wrapper]:px-4 [&_.react-datetime-picker__wrapper]:py-3 [&_.react-datetime-picker__calendar]:bg-gray-2 [&_.react-datetime-picker__calendar]:border-gray-6 [&_.react-datetime-picker__calendar]:rounded-lg [&_.react-datetime-picker__calendar]:shadow-lg [&_.react-datetime-picker__calendar]:p-2"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="sampleType"
          className="block text-sm font-medium text-gray-11"
        >
          Sample Type <span className="text-red-10">*</span>
        </label>
        <select
          id="sampleType"
          name="sampleType"
          value={sampleType}
          onChange={(e) => setSampleType(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-6 bg-gray-2 px-4 py-3 text-lg text-gray-12 focus:border-accent-8 focus:outline-none focus:ring-2 focus:ring-accent-7"
          required
        >
          <option value="manual">manual</option>
          <option value="lab">lab</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="copper"
          className="block text-sm font-medium text-gray-11"
        >
          Copper
        </label>
        <input
          type="number"
          id="copper"
          name="copper"
          value={copper}
          onChange={(e) =>
            handleFieldChange('copper', e.target.value, setCopper)
          }
          onBlur={(e) => validateField('copper', e.target.value)}
          className={`mt-1 block w-full rounded-lg border ${
            fieldErrors.copper ? 'border-red-6' : 'border-gray-6'
          } bg-gray-2 px-4 py-3 text-lg text-gray-12 placeholder-gray-8 focus:border-accent-8 focus:outline-none focus:ring-2 focus:ring-accent-7 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 [-moz-appearance:textfield]`}
          placeholder="Enter Copper measurement"
          step="any"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          aria-describedby={fieldErrors.copper ? 'copper-error' : undefined}
        />
        {fieldErrors.copper && (
          <p id="copper-error" className="mt-1 text-sm text-red-10">
            {fieldErrors.copper}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="lead"
          className="block text-sm font-medium text-gray-11"
        >
          Lead
        </label>
        <input
          type="number"
          id="lead"
          name="lead"
          value={lead}
          onChange={(e) => handleFieldChange('lead', e.target.value, setLead)}
          onBlur={(e) => validateField('lead', e.target.value)}
          className={`mt-1 block w-full rounded-lg border ${
            fieldErrors.lead ? 'border-red-6' : 'border-gray-6'
          } bg-gray-2 px-4 py-3 text-lg text-gray-12 placeholder-gray-8 focus:border-accent-8 focus:outline-none focus:ring-2 focus:ring-accent-7 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 [-moz-appearance:textfield]`}
          placeholder="Enter Lead measurement"
          step="any"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          aria-describedby={fieldErrors.lead ? 'lead-error' : undefined}
        />
        {fieldErrors.lead && (
          <p id="lead-error" className="mt-1 text-sm text-red-10">
            {fieldErrors.lead}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="nickel"
          className="block text-sm font-medium text-gray-11"
        >
          Nickel
        </label>
        <input
          type="number"
          id="nickel"
          name="nickel"
          value={nickel}
          onChange={(e) =>
            handleFieldChange('nickel', e.target.value, setNickel)
          }
          onBlur={(e) => validateField('nickel', e.target.value)}
          className={`mt-1 block w-full rounded-lg border ${
            fieldErrors.nickel ? 'border-red-6' : 'border-gray-6'
          } bg-gray-2 px-4 py-3 text-lg text-gray-12 placeholder-gray-8 focus:border-accent-8 focus:outline-none focus:ring-2 focus:ring-accent-7 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 [-moz-appearance:textfield]`}
          placeholder="Enter Nickel measurement"
          step="any"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          aria-describedby={fieldErrors.nickel ? 'nickel-error' : undefined}
        />
        {fieldErrors.nickel && (
          <p id="nickel-error" className="mt-1 text-sm text-red-10">
            {fieldErrors.nickel}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="mercury"
          className="block text-sm font-medium text-gray-11"
        >
          Mercury
        </label>
        <input
          type="number"
          id="mercury"
          name="mercury"
          value={mercury}
          onChange={(e) =>
            handleFieldChange('mercury', e.target.value, setMercury)
          }
          onBlur={(e) => validateField('mercury', e.target.value)}
          className={`mt-1 block w-full rounded-lg border ${
            fieldErrors.mercury ? 'border-red-6' : 'border-gray-6'
          } bg-gray-2 px-4 py-3 text-lg text-gray-12 placeholder-gray-8 focus:border-accent-8 focus:outline-none focus:ring-2 focus:ring-accent-7 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 [-moz-appearance:textfield]`}
          placeholder="Enter Mercury measurement"
          step="any"
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          aria-describedby={fieldErrors.mercury ? 'mercury-error' : undefined}
        />
        {fieldErrors.mercury && (
          <p id="mercury-error" className="mt-1 text-sm text-red-10">
            {fieldErrors.mercury}
          </p>
        )}
      </div>
      <Button
        type="submit"
        className="w-full bg-accent-9 text-white hover:bg-accent-10"
        size="3"
      >
        Submit
      </Button>
    </form>
  )
}
