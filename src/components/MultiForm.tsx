'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';

// Define the Zod schema for validation
const FormDataSchema = z.object({
  firstName: z.string().nonempty('First Name is required'),
  lastName: z.string().nonempty('Last Name is required'),
  email: z.string().email('Invalid email').nonempty('Email is required'),
  country: z.string().nonempty('Country is required'),
  state: z.string().nonempty('State is required'),
  city: z.string().nonempty('City is required'),
  street: z.string().nonempty('Street is required'),
  subscribeToNewsletter: z.boolean().optional(),
  enableNotifications: z.boolean().optional(),
});

type Inputs = z.infer<typeof FormDataSchema>;

// Steps configuration
const steps = [
  { id: 'Step 1', name: 'Personal Information', fields: ['firstName', 'lastName', 'email'] },
  { id: 'Step 2', name: 'Address', fields: ['country', 'state', 'city', 'street'] },
  { id: 'Step 3', name: 'Preferences', fields: ['subscribeToNewsletter', 'enableNotifications'] },
  { id: 'Step 4', name: 'Review & Submit' },
];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const delta = currentStep - previousStep;
  // const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<Inputs | null>(null);

  const {
    register,
    handleSubmit,
    
    trigger,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  });

  // Submit the form and store data in localStorage
  const processForm: SubmitHandler<Inputs> = (data) => {
    console.log('Form Submitted:', data);

    // Store the form data in localStorage
    try {
      localStorage.setItem('formData', JSON.stringify(data));
      console.log('Data saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

    // Set form data and trigger acknowledgment modal
    setFormData(data);
    // setFormSubmitted(true);
  };

  const next = async () => {
    const fields = steps[currentStep].fields;

    const isValid = fields ? await trigger(fields as (keyof Inputs)[], { shouldFocus: true }) : true;

    if (!isValid) return;

    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };


  // Reset the form and go back to Step 1
  const resetForm = () => {
    reset();  
    setCurrentStep(0); 
    setFormData(null);  
    
    toast.success("Form Reset successfully")  
  };
  const notify = () => toast("Form Submitted successfully");

  return (
    <section className="absolute inset-0 mt-20 flex flex-col justify-between p-8 max-w-3xl mx-auto">
      {/* Steps Navigation */}
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4">
                  <span className="text-sm font-medium text-sky-600">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-sky-600">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 md:border-l-0 md:border-t-4">
                  <span className="text-sm font-medium text-gray-500">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form className="mt-8" onSubmit={handleSubmit(processForm)}>
        {/* Step 1: Personal Information */}
        {currentStep === 0 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-3"
          >
            <h2 className="text-2xl font-semibold">Personal Information</h2>
            <input
              {...register('firstName')}
              placeholder="First Name"
              className="w-full p-3 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}

            <input
              {...register('lastName')}
              placeholder="Last Name"
              className="w-full p-3 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}

            <input
              {...register('email')}
              placeholder="Email"
              type="email"
              className="w-full p-3 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </motion.div>
        )}

        {/* Step 2: Address */}
        {currentStep === 1 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-3"
          >
            <h2 className="text-2xl font-semibold">Address</h2>
            <input
              {...register('country')}
              placeholder="Country"
              className="w-full p-3 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}

            <input
              {...register('state')}
              placeholder="State"
              className="w-full p-3 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}

            <input
              {...register('city')}
              placeholder="City"
              className="w-full p-3 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}

            <input
              {...register('street')}
              placeholder="Street"
              className="w-full p-3 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.street && <p className="text-red-500 text-sm">{errors.street.message}</p>}
          </motion.div>
        )}

        {/* Step 3: Preferences */}
        {currentStep === 2 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-3"
          >
            <h2 className="text-2xl font-semibold">Preferences</h2>
            <label>
              <input
                type="checkbox"
                {...register('subscribeToNewsletter')}
                className="mr-3"
              />
              Subscribe to Newsletter
            </label>

            <label className='ml-3'>
              <input
                type="checkbox"
                {...register('enableNotifications')}
                className="mr-2"
              />
              Enable Notifications
            </label>
          </motion.div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 3 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="space-y-3"
          >
            <h2 className="text-2xl font-semibold">Review & Submit</h2>
            <pre className='bg-gray-200 text-black rounded-md'>{JSON.stringify(formData, null, 2)}</pre>
          </motion.div>
        )}

<ToastContainer />
        {/* Navigation Buttons */}
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={currentStep === 0}
            className="bg-gray-500 text-white px-6 py-2 rounded-md"
          >
            Back
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="bg-blue-500 text-white px-6 py-2 rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-md"
              
              onClick={notify}>
            
              Submit
            </button>
          )}
        </div>
      </form>

   

      {/* Reset Button */}
      <button
        type="button"
        onClick={resetForm}
        className="mt-4 bg-red-500 text-white px-6 py-2 rounded-md"
      >
        Reset
      </button>
    </section>
  );
}
