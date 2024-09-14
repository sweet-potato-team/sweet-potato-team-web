import React from 'react';

const ToggleSwitch = ({ options, toggleView, setToggleView }) => {
  const containerStyle = {
    position: 'relative',
    display: 'flex',
    width: '100%',  // 寬度自適應
    height: '50px',
    backgroundColor: '#EFEBE6', // 外框底色
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
    color: active ? '#EFEBE6' : '#B7A58F', // 文字顏色
    zIndex: 1,
    cursor: 'pointer',
    transition: 'color 0.3s',
  });

  const sliderStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: `${100 / options.length}%`,
    backgroundColor: '#B7A58F', // 滑動條顏色
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


// import React from 'react';

// const ToggleSwitch = ({ options, toggleView, setToggleView }) => {
//   const containerStyle = {
//     position: 'relative',
//     display: 'flex',
//     width: '100%',
//     height: '50px',
//     backgroundColor: '#EFEBE6', // 外框底色
//     borderRadius: '25px',
//     overflow: 'hidden',
//     boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.3)',
//   };

//   const optionStyle = (active) => ({
//     flex: 1,
//     textAlign: 'center',
//     lineHeight: '50px',
//     fontSize: '20px',
//     fontWeight: 'bold',
//     color: active ? '#EFEBE6' : '#B7A58F', // 文字顏色
//     zIndex: 1,
//     cursor: 'pointer',
//     transition: 'color 0.3s',
//   });

//   const sliderStyle = {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     width: `${100 / options.length}%`,
//     backgroundColor: '#B7A58F', // 滑動條顏色
//     borderRadius: '25px',
//     transition: 'transform 0.3s ease',
//     transform: `translateX(${toggleView * 100}%)`,
//   };

//   return (
//     <div style={containerStyle}>
//       {options.map((option, index) => (
//         <div
//           key={index}
//           style={optionStyle(toggleView === index)}
//           onClick={() => setToggleView(index)}
//         >
//           {option.label}
//         </div>
//       ))}
//       <div style={sliderStyle}></div>
//     </div>
//   );
// };

// export default ToggleSwitch;
