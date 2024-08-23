import React from 'react';

function ToggleSwitch({ toggleView, setToggleView }) {
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
    width: '50%',
    backgroundColor: '#415A77',
    borderRadius: '25px',
    transition: 'transform 0.3s ease', // 使用transform來控制滑動效果
    transform: toggleView ? 'translateX(100%)' : 'translateX(0)', // 根據toggleView狀態移動滑塊
  };

  return (
    <div style={containerStyle}>
      <div
        style={optionStyle(!toggleView)}
        onClick={() => setToggleView(false)}
      >
        時間總覽
      </div>
      <div
        style={optionStyle(toggleView)}
        onClick={() => setToggleView(true)}
      >
        查看空間
      </div>
      <div style={sliderStyle}></div>
    </div>
  );
}

export default ToggleSwitch;
