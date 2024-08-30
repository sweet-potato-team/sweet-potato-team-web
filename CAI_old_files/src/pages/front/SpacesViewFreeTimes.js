import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ToggleSwitch from '../../components/ToggleSwitch';
import SpaceTimeRental from '../../components/admin/SpaceTimeRental';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading'; // 確保已正確引入 Loading 組件

function SpacesViewFreeTimes() {
  const [spaces, setSpaces] = useState([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [toggleView, setToggleView] = useState(false); // Toggle for view: false - 時間總覽, true - 查看空間

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSpaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8080/spaces');
        setSpaces(response.data.results || []);
        console.log('Spaces fetched:', response.data.results);
      } catch (error) {
        console.error('Failed to fetch spaces:', error);
        setError('Failed to fetch spaces');
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  if (loading) {
    return <Loading />; // 使用 Loading 組件
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-md-5 mt-3 mb-7 full-height" style={{ position: 'relative', paddingTop: '50px' }}>
      <div className="d-flex justify-content-center mb-4">
      <ToggleSwitch toggleView={toggleView} setToggleView={setToggleView} navigate={navigate} /> {/* 使用新組件 */}
      </div>
      <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '20px' }}>
        <h2 style={{ width: '50%', textAlign: 'center' }}>免費空間時間表</h2>
        <select
          onChange={e => setSelectedSpaceId(e.target.value)}
          value={selectedSpaceId || ''}
          style={{
            width: '50%',
            padding: '10px',
            fontSize: '1.2rem',
            margin: '10px 0',
            borderColor: '#415A77',
            borderRadius: '8px', // 添加圓角
            outline: 'none', // 移除焦點時的輪廓
            boxShadow: 'none', // 移除陰影
          }}
        >
          <option value="">選擇空間</option>
          {spaces.length > 0 ? (
            spaces.map(space => (
              <option key={space.freeSpaceId} value={space.freeSpaceId}>
                {space.freeSpaceName}
              </option>
            ))
          ) : (
            <option disabled>No spaces available</option>
          )}
        </select>
      </div>
      {selectedSpaceId && <SpaceTimeRental spaceId={selectedSpaceId} />}
    </div>
  );
}

export default SpacesViewFreeTimes;

