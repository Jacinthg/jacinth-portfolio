import React from 'react';
import ContactForm from './ContactForm';

export default function ContactPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-fuchsia-50 to-violet-100 px-4 py-10 sm:px-6 md:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Get In Touch</h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Feel free to reach out for collaborations, opportunities, or project discussions.
          </p>
        </div>

        <ContactForm />
      </div>
    </main>
  );
}
