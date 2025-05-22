import React, { useEffect } from 'react';
import '../styles/CursorGlow.css';

// This component adds a cursor glow effect that follows the mouse
const CustomCursor = () => {
  useEffect(() => {
    console.log('CustomCursor component mounted - glow effect active');
    
    // Track mouse movement for the glow effect
    const onMouseMove = (e) => {
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };
    
    // Add event listener
    document.addEventListener('mousemove', onMouseMove);
    
    // Clean up
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return null; // The cursor effect is handled by CSS
};

export default CustomCursor;
