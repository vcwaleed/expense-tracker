import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className=" loadingspinner relative mx-auto mt-80 mb-32 w-[calc(3*var(--offset)+var(--square))] h-[calc(2*var(--offset)+var(--square))]">
      <div id="square1" className="square" style={{ animationDelay: '1.4s' }}></div>
      <div id="square2" className="square" style={{ animationDelay: '1.6s' }}></div>
      <div id="square3" className="square" style={{ animationDelay: '1.8s' }}></div>
      <div id="square4" className="square" style={{ animationDelay: '1.10s' }}></div>
      <div id="square5" className="square" style={{ animationDelay: '2.0s' }}></div>
    </div>
  );
};
export default LoadingSpinner;
