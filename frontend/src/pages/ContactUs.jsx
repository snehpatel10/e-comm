import React, { useState, useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animation from '../assets/Animation - 1740654275604.json'

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validate(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validate(name, value);
  };

  const validate = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'name':
        if (!value) errorMessage = 'Name is required';
        break;
      case 'message':
        if (!value) errorMessage = 'Message is required';
        break;
      default:
        break;
    }

    setErrors({
      ...errors,
      [name]: errorMessage
    });
  };

  const animationContainer = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      animationData: animation,
      renderer: 'svg',
      loop: true,
      autoplay: true,
    });
    return () => {
      anim.destroy();
    };
  }, []);

  const createMailtoLink = () => {
    const { name, message } = formData;
    const subject = encodeURIComponent('Contact Us Form Submission');
    const body = encodeURIComponent(`Name: ${name}\nMessage: ${message}`);
    return `mailto:thisissnehpatel@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 

    const validationErrors = { ...errors };
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const value = formData[field];
      if (!value) {
        validationErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      } else {
        validationErrors[field] = ''; 
      }
    });

    setErrors(validationErrors);

    if (isValid) {
      window.location.href = createMailtoLink();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 rounded-lg" style={{ backgroundColor: '#121212' }}>
      <h1 className="text-3xl text-center mb-6 text-white">Contact Us</h1>

      <div className="flex items-center space-x-8">
        <div id="lottie-animation" className="w-1/2 h-64" ref={animationContainer}></div>
        <div className="w-1/2">
          <p className="text-lg text-gray-300 mb-4">
            We would love to hear from you! Whether you have a question, feedback, or just want to say hello, 
            feel free to reach out. We're here to help!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="input input-bordered flex items-center gap-2 text-white">
                <input
                  type="text"
                  className="grow text-white bg-transparent "
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </label>
              {errors.name && <p className="text-red-500 text-xs absolute left-0 top-full mt-1">{errors.name}</p>}
            </div>
            <div className="relative">
              <label className="flex items-center gap-2 text-white">
                
                <textarea
                  className="grow textarea textarea-bordered text-white bg-transparent"
                  placeholder="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </label>
              {errors.message && <p className="text-red-500 text-xs absolute left-0 top-full mt-1">{errors.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full btn btn-primary py-3 px-4 mt-4  text-white font-semibold rounded-lg transition duration-300"
              disabled={Object.values(errors).some(error => error)} // Disable submit if there are validation errors
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
