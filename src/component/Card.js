import React from 'react';

const Card = ({ imageSrc, title, subtitle, description }) => {
  const cardStyle = {
    backgroundColor: '#f1f1f1',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '300px',
    margin: '15px',
    textAlign: 'center',
    padding: '20px',
    flexBasis: '23%', // 設定卡片寬度為容器的23%
    maxWidth: '23%', // 保持每個卡片最多佔23%
    marginBottom: '20px', // 卡片之間的垂直間距
  };

  const imgStyle = {
    borderRadius: '50%', // 圓形
    width: '80px',
    height: '80px',
    marginBottom: '15px',
    objectFit: 'cover', // 保持圖片比例，裁剪超出部分
  };
  

  return (
    <div style={cardStyle}>
      <img src={imageSrc} alt="Avatar" style={imgStyle} />
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <p>{description}</p>
    </div>
  );
};

export default Card;
