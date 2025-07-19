// Imports
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have Textarea component
import { toast } from 'sonner';
import { EnvelopeIcon, PhoneIcon, MapPinIcon} from '@heroicons/react/24/outline'; // Heroicons for contact info and social media

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    toast.success('Your message has been sent successfully!', {
      description: 'We will get back to you shortly.',
    });
    setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-[calc(100vh-200px)]">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4 animate-fade-in-down">
          Get In Touch
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-up">
          We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, our team is ready to assist.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Contact Form Section */}
        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 animate-slide-in-left">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="mt-1 block w-full"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                className="mt-1 block w-full"
                required
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Inquiry about an order"
                className="mt-1 block w-full"
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here..."
                rows={6}
                className="mt-1 block w-full"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md text-lg transition-colors" disabled={isSubmitting}>
              {isSubmitting ? 'Sending Message...' : 'Send Message'}
            </Button>
          </form>
        </section>

        {/* Contact Info & Social Media Section */}
        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 animate-slide-in-right flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">Contact Information</h2>
            <div className="space-y-6 text-lg">
              <div className="flex items-center justify-center lg:justify-start">
                <EnvelopeIcon className="h-7 w-7 text-blue-500 mr-4" />
                <span>Email: <a href="mailto:support@urbanspreemart.com" className="text-blue-600 hover:underline dark:text-blue-400">kahuraisaac30@gmail.com</a></span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <PhoneIcon className="h-7 w-7 text-blue-500 mr-4" />
                <span>Phone: <a href="tel:+254712345678" className="text-blue-600 hover:underline dark:text-blue-400">+254 742 328 330</a></span>
              </div>
              <div className="flex items-start justify-center lg:justify-start">
                <MapPinIcon className="h-7 w-7 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                <span>Address: 123 E-Commerce Lane, Nairobi, 00100, Kenya</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-10 mb-6 text-center">Follow Us</h3>
            <div className="flex justify-center lg:justify-start space-x-6 text-blue-600 dark:text-blue-400">
              <a href="#" className="hover:text-blue-800 dark:hover:text-blue-200 transition-colors transform hover:scale-110" aria-label="Facebook">
                Facebook
              </a>
              <a href="#" className="hover:text-blue-800 dark:hover:text-blue-200 transition-colors transform hover:scale-110" aria-label="Instagram">
                Instagram
              </a>
              <a href="#" className="hover:text-blue-800 dark:hover:text-blue-200 transition-colors transform hover:scale-110" aria-label="LinkedIn">
                Linked-in
              </a>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-10 rounded-lg overflow-hidden shadow-md w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 text-xl font-semibold">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d249.30485489730205!2d36.662647755292994!3d-1.2441758949859572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ske!4v1752859539864!5m2!1sen!2ske"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>

      {/* Simple CSS for animations (add to your global CSS or a style tag if not using a CSS-in-JS solution) */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-fade-in-down { animation: fadeInDown 1s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 1s ease-out forwards; animation-delay: 0.3s; }
        .animate-slide-in-left { animation: slideInLeft 1s ease-out forwards; animation-delay: 0.5s; }
        .animate-slide-in-right { animation: slideInRight 1s ease-out forwards; animation-delay: 0.7s; }
      `}</style>
    </div>
  );
}
