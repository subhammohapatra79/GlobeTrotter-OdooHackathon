import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Signup.css';

import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};

    // First Name: letters and spaces only
    if (formData.firstName && !/^[a-zA-Z\s]*$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters and spaces';
    }

    // Last Name: letters and spaces only
    if (formData.lastName && !/^[a-zA-Z\s]*$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters and spaces';
    }

    // Email validation
    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Email must contain @ symbol';
    } else if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone: numbers and optional + - () only
    if (formData.phone && !/^[\d+\-\s()]*$/.test(formData.phone)) {
      newErrors.phone = 'Phone number can only contain digits, +, -, spaces, and parentheses';
    }

    // City: letters, spaces, and hyphens only
    if (formData.city && !/^[a-zA-Z\s\-]*$/.test(formData.city)) {
      newErrors.city = 'City can only contain letters, spaces, and hyphens';
    }

    // Country: letters, spaces, and hyphens only
    if (formData.country && !/^[a-zA-Z\s\-]*$/.test(formData.country)) {
      newErrors.country = 'Country can only contain letters, spaces, and hyphens';
    }

    // Password validation: minimum 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
    if (formData.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }

    // Confirm Password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Phone: Allow only digits, +, -, (), and spaces in real-time
    if (name === 'phone') {
      const filteredValue = value.replace(/[^\d+\-\s()]/g, '');
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Real-time password match validation
    if (name === 'confirmPassword') {
      if (value && formData.password !== value) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else if (value === formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    } else if (name === 'password') {
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else if (formData.confirmPassword && value === formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
    
    // Clear error for this field when user starts typing (for other fields)
    if (errors[name] && name !== 'confirmPassword' && name !== 'password') {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateInputs();
    if (Object.keys(newErrors).length === 0) {
      console.log(formData); // UI only
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-title">Create Account</h1>
        <p className="signup-subtitle">
          Join GlobeTrotter and start your journey
        </p>

        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Personal Info */}
          <div className="signup-grid">
            <Input
              label="First Name"
              name="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
            />

            <Input
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              label="Phone"
              name="phone"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />

            <Input
              label="City"
              name="city"
              placeholder="Bhubaneswar"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
            />

            <Input
              label="Country"
              name="country"
              placeholder="India"
              value={formData.country}
              onChange={handleChange}
              error={errors.country}
            />
          </div>

          {/* Password Fields */}
          <div className="signup-password-section">
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Min 8 chars, uppercase, number, special char"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />
          </div>

          {/* CTA */}
          <Button type="submit" variant="primary">
            Create Account
          </Button>
        </form>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;