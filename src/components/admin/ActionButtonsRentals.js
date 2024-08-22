import React, { useState } from 'react';

function ActionButtonsRentals({ onCreateClick, onCollapseClick, onSearchSubmit, onSelectChange, options }) {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleMouseEnter = (e, iconColor) => {
    e.currentTarget.style.backgroundColor = '#E9EEF0';
    e.currentTarget.style.color = iconColor;

    const icon = e.currentTarget.querySelector('i');
    if (icon) {
      icon.style.color = iconColor;
    }
  };

  const handleMouseLeave = (e, iconColor) => {
    e.currentTarget.style.backgroundColor = '#6096ba';
    e.currentTarget.style.color = 'white';

    const icon = e.currentTarget.querySelector('i');
    if (icon) {
      icon.style.color = 'white';
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(selectedFilter, searchText);
    }
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
    if (onSelectChange) {
      onSelectChange(e.target.value);
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
            border: '1px solid #6096ba', 
            backgroundColor: '#6096ba', 
            borderRadius: '5px' 
          }} 
          onMouseEnter={(e) => handleMouseEnter(e, '#6096ba')} 
          onMouseLeave={(e) => handleMouseLeave(e, '#6096ba')} 
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
            border: '1px solid #6096ba', 
            backgroundColor: '#6096ba', 
            borderRadius: '5px' 
          }} 
          onMouseEnter={(e) => handleMouseEnter(e, '#6096ba')} 
          onMouseLeave={(e) => handleMouseLeave(e, '#6096ba')} 
          onClick={onCollapseClick}
        >
          <i className="bi bi-eject"></i> 收起
        </button>
      </div>
      
      <div className='d-flex align-items-center'>
        <select
          className='form-select me-2'
          onChange={handleFilterChange}
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
              border: '1px solid #6096ba', 
              backgroundColor: '#6096ba', 
              borderRadius: '5px' 
            }}
            onMouseEnter={(e) => handleMouseEnter(e, '#6096ba')}
            onMouseLeave={(e) => handleMouseLeave(e, '#6096ba')}
          >
            <i className="bi bi-send"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ActionButtonsRentals;
