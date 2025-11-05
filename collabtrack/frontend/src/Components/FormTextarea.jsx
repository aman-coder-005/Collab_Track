import React from 'react';

const FormTextarea = ({ id, label, placeholder, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows="4"
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      ></textarea>
    </div>
  );
};

export default FormTextarea;