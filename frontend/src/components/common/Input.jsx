/**
 * Input component
 * Reusable input field component
 */

import React from 'react';
import '../../styles/input.css';

export const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  label = '',
  error = '',
  required = false,
  className = '',
  as = 'input',
  rows = 4
}) => {
  const Component = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      {as === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`input-field ${error ? 'input-error' : ''} ${className}`}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`input-field ${error ? 'input-error' : ''} ${className}`}
        />
      )}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default Input;