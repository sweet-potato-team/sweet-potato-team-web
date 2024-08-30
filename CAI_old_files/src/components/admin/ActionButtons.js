// components/ActionButtons.js
import React, { useState } from 'react';

function ActionButtons({ onCreateClick, onCollapseClick, onSearchSubmit, onSelectChange, options }) {
  const [searchText, setSearchText] = useState('');

  const handleMouseEnter = (e, iconColor) => {
    e.currentTarget.style.backgroundColor = '#E9EEF0';
    e.currentTarget.style.color = iconColor;

    const icon = e.currentTarget.querySelector('i');
    if (icon) {
      icon.style.color = iconColor;  // 改变图标颜色
    }
  };

  const handleMouseLeave = (e, iconColor) => {
    e.currentTarget.style.backgroundColor = '#6096BA';
    e.currentTarget.style.color = 'white';

    const icon = e.currentTarget.querySelector('i');
    if (icon) {
      icon.style.color = 'white';  // 恢复图标颜色
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      console.log('Search Text:', searchText); // 添加 console.log 以檢查 searchText
      onSearchSubmit(searchText);
    }
  };
  

  return (
    <div className='d-flex justify-content-between align-items-center'>
      <div className='text-end'>
        <button 
          type='button' 
          className='btn btn-sm me-4' 
          style={{ 
            color: 'white', 
            padding: '5px 10px', 
            border: '1px solid #6096BA', 
            backgroundColor: '#6096BA', 
            borderRadius: '5px' 
          }} 
          onMouseEnter={(e) => handleMouseEnter(e, '#6096BA')} 
          onMouseLeave={(e) => handleMouseLeave(e, '#6096BA')} 
          onClick={onCreateClick}
        >
          <i className="bi bi-house-add"></i> 創建
        </button>
        <button 
          type='button' 
          className='btn btn-sm me-2' 
          style={{ 
            color: 'white', 
            padding: '5px 10px', 
            border: '1px solid #6096BA', 
            backgroundColor: '#6096BA', 
            borderRadius: '5px' 
          }} 
          onMouseEnter={(e) => handleMouseEnter(e, '#6096BA')} 
          onMouseLeave={(e) => handleMouseLeave(e, '#6096BA')} 
          onClick={onCollapseClick}
        >
          <i className="bi bi-eject"></i> 收起
        </button>
      </div>
      
      <div className='d-flex align-items-center'>
        <select
          className='form-select me-2'
          onChange={(e) => onSelectChange(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="">選擇篩選條件</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <form onSubmit={handleSearchSubmit} className='d-flex align-items-center'>
          <input
            type='text'
            className='form-control me-2'
            placeholder='Search'
            value={searchText}
            onChange={handleSearchChange}
          />
          <button 
            type='submit' 
            className='btn btn-sm me-2' 
            style={{ 
              color: 'white', 
              padding: '5px 10px', 
              border: '1px solid #6096BA', 
              backgroundColor: '#6096BA', 
              borderRadius: '5px' 
            }}
            onMouseEnter={(e) => handleMouseEnter(e, '#6096BA')}
            onMouseLeave={(e) => handleMouseLeave(e, '#6096BA')}
          >
            <i className="bi bi-send"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ActionButtons;
