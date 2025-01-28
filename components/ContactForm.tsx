"use client";
import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const ContactMe: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await emailjs.send(
        'service_vsgqdbb',
        'template_liqptiw',
        formData,
        'FtQ33zYGsE97xLaCY'
      );
      alert('Message Sent Successfully!');
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    } catch (error) {
      alert('Error sending message, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto py-1 px-2 mt-12" id="contact">
      <div className="text-center mb-10">
        <h3 className="text-4xl font-extrabold text-gray-800 mb-4">Get in Touch</h3>
        <p className="text-gray-600">If you have any questions, please fill out the form below!</p>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-2xl transition-shadow duration-300">
        <form onSubmit={sendEmail}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="mt-2 w-full px-4 py-3 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-2 w-full px-4 py-3 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Your Message
              </label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className="mt-2 w-full px-4 py-3 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none h-32"
              />
              {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 px-6 py-3 text-lg font-semibold rounded-md text-white bg-blue-500 hover:bg-blue-600 transition ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactMe;