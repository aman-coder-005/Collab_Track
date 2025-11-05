import React from 'react';

// We've added value and onChange to the props
const FormInput = ({ id, label, type, placeholder, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        // Pass the value and onChange handler to the input element
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default FormInput;