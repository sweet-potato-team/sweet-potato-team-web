import React, { useState, useEffect } from 'react';

function ActionButtonsTimes({ onCreateClick, onSearchSubmit, openManageTable, onSelectSpace, fetchAllRecords }) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [spaceOptions, setSpaceOptions] = useState([]);

  // Fetch the spaces for the dropdown on component mount
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await fetch('http://localhost:8080/spaces');
        if (response.ok) {
          const data = await response.json();
          const formattedOptions = data.results.map(space => ({ value: space.freeSpaceName, label: space.freeSpaceName }));
          setSpaceOptions(formattedOptions);
        } else {
          console.error('Failed to fetch spaces:', response.status);
        }
      } catch (error) {
        console.error('Error fetching spaces:', error);
      }
    };

    fetchSpaces();
  }, []);

  // Handle the selection of a space from the dropdown
  const handleSpaceSelect = async (e) => {
    const spaceName = e.target.value;

    if (spaceName === "") {
      fetchAllRecords();
    } else {
      try {
        const response = await fetch(`http://localhost:8080/spaces/name/${spaceName}`);
        if (response.ok) {
          const space = await response.json();
          const spaceId = space.freeSpaceId;
          onSelectSpace(spaceId, spaceName);
        } else {
          console.error('Failed to fetch space by name:', response.status);
        }
      } catch (error) {
        console.error('Error fetching space data:', error);
      }
    }
  };

  // Handle the search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    console.log("Submitting search with times:");
    console.log("Start Time: ", startTime);
    console.log("End Time: ", endTime);
    
    onSearchSubmit(startTime, endTime);
  };

  return (
    <div className='d-flex justify-content-between align-items-center'>
      <div className='d-flex align-items-center'>
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
          onClick={onCreateClick}
        >
          <i className="bi bi-house-add"></i> 創建
        </button>

        <select
          className='form-select me-4'
          onChange={handleSpaceSelect}
          style={{ width: 'auto' }}
        >
          <option value="">選擇空間</option>
          {spaceOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

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
          onClick={openManageTable}
        >
          空間管理表
        </button>
      </div>
      
      <form onSubmit={handleSearchSubmit} className='d-flex align-items-center'>
        <input
          type="datetime-local"
          className='form-control me-2'
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder='開始時間'
        />
        <input
          type="datetime-local"
          className='form-control me-2'
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          placeholder='結束時間'
        />
        <button 
          type='submit' 
          className='btn btn-sm' 
          style={{ 
            color: 'white', 
            padding: '5px 10px', 
            border: '1px solid #6096ba', 
            backgroundColor: '#6096ba', 
            borderRadius: '5px' 
          }}
        >
          <i className="bi bi-search"></i>
        </button>
      </form>
    </div>
  );
}

export default ActionButtonsTimes;
