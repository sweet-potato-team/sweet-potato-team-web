import React from 'react';

const ToggleSwitch = ({ options, toggleView, setToggleView }) => {
  const containerStyle = {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '50px',
    backgroundColor: '#f1f1f1',
    borderRadius: '25px',
    overflow: 'hidden',
    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.3)',
  };

  const optionStyle = (active) => ({
    flex: 1,
    textAlign: 'center',
    lineHeight: '50px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: active ? 'white' : '#415A77',
    zIndex: 1,
    cursor: 'pointer',
    transition: 'color 0.3s',
  });

  const sliderStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: `${100 / options.length}%`,
    backgroundColor: '#415A77',
    borderRadius: '25px',
    transition: 'transform 0.3s ease',
    transform: `translateX(${toggleView * 100}%)`,
  };

  return (
    <div style={containerStyle}>
      {options.map((option, index) => (
        <div
          key={index}
          style={optionStyle(toggleView === index)}
          onClick={() => setToggleView(index)}
        >
          {option.label}
        </div>
      ))}
      <div style={sliderStyle}></div>
    </div>
  );
};

export default ToggleSwitch;
