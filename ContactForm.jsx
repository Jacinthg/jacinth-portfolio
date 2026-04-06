import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const initialFormState = {
  name: '',
  email: '',
  message: '',
};

function validateForm(values) {
  const nextErrors = {};

  if (!values.name.trim()) {
    nextErrors.name = 'Name is required.';
  } else if (values.name.trim().length < 2) {
    nextErrors.name = 'Name must be at least 2 characters.';
  }

  if (!values.email.trim()) {
    nextErrors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    nextErrors.email = 'Please enter a valid email address.';
  }

  if (!values.message.trim()) {
    nextErrors.message = 'Message is required.';
  } else if (values.message.trim().length < 10) {
    nextErrors.message = 'Message must be at least 10 characters.';
  }

  return nextErrors;
}

export default function ContactForm({
  serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_qy91p5k',
  templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_35zx9z2',
  publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'yF-XS-UqxhCQt9SDa',
}) {
  const [formValues, setFormValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const onChange = (event) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (successMessage) {
      setSuccessMessage('');
    }

    if (submitError) {
      setSubmitError('');
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm(formValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!serviceId || !templateId || !publicKey) {
      setSubmitError('Email configuration is missing. Please set EmailJS IDs and Public Key.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSuccessMessage('');

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formValues.name.trim(),
          from_email: formValues.email.trim(),
          message: formValues.message.trim(),
          reply_to: formValues.email.trim(),
        },
        publicKey
      );

      setSuccessMessage('Message sent successfully. I will get back to you soon.');
      setFormValues(initialFormState);
      setErrors({});
    } catch (error) {
      setSubmitError('Failed to send message. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto rounded-3xl bg-white/90 backdrop-blur-sm shadow-2xl shadow-slate-200/70 p-6 sm:p-8 md:p-10 border border-slate-100">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Contact Me</h2>
        <p className="mt-2 text-slate-500">Have a project in mind? Send me a message.</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formValues.name}
            onChange={onChange}
            placeholder="Your name"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4 focus:ring-fuchsia-100 focus:border-fuchsia-400"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name ? (
            <p id="name-error" className="mt-2 text-sm text-rose-500">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={onChange}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4 focus:ring-fuchsia-100 focus:border-fuchsia-400"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email ? (
            <p id="email-error" className="mt-2 text-sm text-rose-500">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formValues.message}
            onChange={onChange}
            placeholder="Tell me about your project..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4 focus:ring-fuchsia-100 focus:border-fuchsia-400 resize-y"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message ? (
            <p id="message-error" className="mt-2 text-sm text-rose-500">
              {errors.message}
            </p>
          ) : null}
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-2xl px-6 py-3.5 font-semibold text-white shadow-lg shadow-fuchsia-300/50 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 transition hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 text-sm">
            {successMessage}
          </div>
        ) : null}

        {submitError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 text-sm">
            {submitError}
          </div>
        ) : null}
      </form>
    </section>
  );
}
