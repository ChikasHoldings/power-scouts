import React, { useState, useEffect, useRef } from "react";

export default function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  loading = "lazy",
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (img.complete) {
      setIsLoaded(true);
    } else {
      img.addEventListener('load', () => setIsLoaded(true));
    }

    return () => {
      if (img) {
        img.removeEventListener('load', () => setIsLoaded(true));
      }
    };
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading={loading}
      className={`${className} ${isLoaded ? 'loaded' : ''} transition-opacity duration-300`}
      style={{ opacity: isLoaded ? 1 : 0 }}
      {...props}
    />
  );
}