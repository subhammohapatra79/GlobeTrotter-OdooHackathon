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
    bio: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // UI only
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
              required
            />

            <Input
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Phone"
              name="phone"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              label="City"
              name="city"
              placeholder="Bhubaneswar"
              value={formData.city}
              onChange={handleChange}
            />

            <Input
              label="Country"
              name="country"
              placeholder="India"
              value={formData.country}
              onChange={handleChange}
            />
          </div>

          {/* About - Full width */}
          <div className="signup-textarea signup-textarea-full">
            <label>Additional Information</label>
            <textarea
              name="bio"
              placeholder="Tell us about your travel preferences..."
              value={formData.bio}
              onChange={handleChange}
              rows="3"
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