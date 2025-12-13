import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;

  return React.createElement(
    'div',
    { className: 'fixed bottom-3 left-1/2 -translate-x-1/2 bg-red-600 px-3 py-2 rounded text-white text-sm shadow-lg z-50' },
    message
  );
}
