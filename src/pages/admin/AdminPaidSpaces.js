// AdminSpaces.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from "axios";
import SpaceModal from "../../components/admin/SpaceModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";
import ActionButtons from "../../components/admin/ActionButtons";

function AdminSpaces() {
  const [spaces, setSpaces] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 5,
    offset: 0,
    total: 0,
    current_page: 1,
    total_pages: 1
  });
  const [expandedSpaces, setExpandedSpaces] = useState({});
  const [type, setType] = useState('create');
  const [tempSpace, setTempSpace] = useState({});
  const [filter, setFilter] = useState({ key: '', value: '' });

  const spaceModal = useRef(null);

  const getSpaces = useCallback(async () => {
    try {
      const params = {
        limit: pagination.limit,
        offset: pagination.offset,
      };
      
      if (filter.key && filter.value) {
        params[filter.key] = filter.value;
      }

      const spaceRes = await axios.get(`http://localhost:8080/spaces`, { params });

      if (spaceRes.data && Array.isArray(spaceRes.data.results)) {
        const sortedSpaces = spaceRes.data.results.sort((a, b) => a.freeSpaceId - b.freeSpaceId); 
        setSpaces(sortedSpaces);
        setPagination((prevPagination) => ({
          ...prevPagination,
          total: spaceRes.data.total,
          total_pages: Math.ceil(spaceRes.data.total / pagination.limit),
        }));      
      } else {
        setSpaces([]);
      }
    } catch (error) {
      console.error("Error fetching spaces:", error);
      setSpaces([]);
    }
  }, [pagination.limit, pagination.offset, filter]);

  useEffect(() => {
    spaceModal.current = new Modal('#spaceModal', {
      backdrop: 'static',
    });
  
    getSpaces();
  }, [getSpaces]); 
  
  const toggleExpandSpace = (spaceId) => {
    setExpandedSpaces((prevExpandedSpaces) => ({
      ...prevExpandedSpaces,
      [spaceId]: !prevExpandedSpaces[spaceId]
    }));
  };

  const toggleAllExpandSpaces = (expand) => {
    const newExpandedSpaces = {};
    spaces.forEach((space) => {
      newExpandedSpaces[space.freeSpaceId] = expand;
    });
    setExpandedSpaces(newExpandedSpaces);
  };

  const openSpaceModal = (type, space) => {
    setType(type);
    setTempSpace(space);
    spaceModal.current.show();
  };

  const closeSpaceModal = () => {
    spaceModal.current.hide();
  };

  const toggleActivationStatus = async (space) => {
    try {
      const updatedSpace = { ...space, freeIsActive: space.freeIsActive ? 0 : 1 };
      await axios.put(`http://localhost:8080/spaces/${space.freeSpaceId}`, updatedSpace);
      setSpaces((prevSpaces) =>
        prevSpaces.map((s) =>
          s.freeSpaceId === space.freeSpaceId ? { ...s, freeIsActive: !s.freeIsActive } : s
        )
      );
    } catch (error) {
      console.error("Error updating space status:", error);
    }
  };

  const changePage = (newPage) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      offset: (newPage - 1) * prevPagination.limit, 
      current_page: newPage 
    }));
    getSpaces(); 
  };

  const handleSearchSubmit = (searchText) => {
    setFilter((prevFilter) => ({ ...prevFilter, value: searchText }));
  };

  const handleSelectChange = (selectedKey) => {
    setFilter((prevFilter) => ({ ...prevFilter, key: selectedKey, value: '' }));
  };

  const spaceOptions = [
    { value: 'spaceName', label: '名稱' },
    { value: 'spaceLocation', label: '位置' },
    // 你可以在这里添加更多选项
  ];

  const deleteSpace = async (spaceId) => {
    if (window.confirm("確認刪除這一筆【免費】空間?")) {
      try {
        await axios.delete(`http://localhost:8080/spaces/${spaceId}`);
        setSpaces((prevSpaces) => prevSpaces.filter(space => space.freeSpaceId !== spaceId));
      } catch (error) {
        console.error("Error deleting space:", error);
      }
    }
  };

  return (
    <div className='p-3'>
      <SpaceModal
        closeSpaceModal={closeSpaceModal}
        getSpaces={() => getSpaces(pagination.current_page)}
        tempSpace={tempSpace}
        type={type}
      />
      <div style={{ backgroundColor: '#D3E9FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0', width: '100%', position: 'relative' }}>
        <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
        <h3 style={{ textAlign: 'center', margin: '0' }}>
          <i className="bi bi-chat-text me-2"></i> 免費空間列表
        </h3>
        <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
      </div>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <ActionButtons 
          onCreateClick={() => openSpaceModal('create', {})}
          onCollapseClick={() => toggleAllExpandSpaces(false)}
          onSearchSubmit={handleSearchSubmit}
          onSelectChange={handleSelectChange}
          options={spaceOptions}
        />
      </div>



      <table className='table'>
        <thead>
          <tr>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF', width: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>編號</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>名稱</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>位置</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>啟用狀態</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>編輯</th>
          </tr>
        </thead>

        <tbody>
          {spaces.map((space) => (
            <React.Fragment key={space.freeSpaceId}>
              <tr>
                <td style={{ textAlign: 'center', width: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{space.freeSpaceId}</td>              
                <td style={{ textAlign: 'center' }}>{space.freeSpaceName}</td>
                <td style={{ textAlign: 'center' }}>{space.freeSpaceLocation}</td>
                <td style={{ textAlign: 'center' }}>
                  <button style={{ backgroundColor: 'white', color: space.freeIsActive ? '#A4B6A4' : '#9B6A6A', border: '1px solid', borderColor: space.freeIsActive ? '#A4B6A4' : '#AF9797', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#E7ECEF'} onMouseLeave={(e) => e.target.style.backgroundColor = 'white'} onClick={() => toggleActivationStatus(space)}>{space.freeIsActive ? '啟用中' : '未啟用'}</button>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button type='button' className='btn btn-sm me-2' style={{ color: '#486484', padding: '5px 10px', border: '1px solid #486484', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => toggleExpandSpace(space.freeSpaceId)}>{expandedSpaces[space.freeSpaceId] ? <i className="bi bi-caret-up"></i> : <i className="bi bi-caret-down"></i>}</button>
                  <button type='button' className='btn btn-sm me-2' style={{ color: '#A4B6A4', padding: '5px 10px', border: '1px solid #A4B6A4', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => openSpaceModal('edit', space)}><i className="bi bi-feather"></i></button>
                  <button type='button' className='btn btn-sm' style={{ color: '#9B6A6A', padding: '5px 10px', border: '1px solid #AF9797', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => deleteSpace(space.freeSpaceId)}><i className="bi bi-trash3"></i></button>                </td>
              </tr>

              {expandedSpaces[space.freeSpaceId] && (
                <tr key={`expanded-${space.freeSpaceId}`}>
                  <td colSpan="5" style={{ backgroundColor: '#F2F5F7' }}>
                    <div className="row">
                      {/* 場地資訊 */}
                      <div className="col-md-4">
                      <hr />
                        <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>場地資訊</h5>
                        <hr />
                        <p><strong>容納人數：</strong>{space.freeCapacity}</p>
                        <p><strong>啟用狀態：</strong>{space.freeIsActive ? '是' : '否'}</p>
                        <p><strong>建立日期：</strong>{new Date(space.freeCreatedDate).toLocaleString()}</p>
                        <p><strong>最後修改日期：</strong>{new Date(space.freeLastModifiedDate).toLocaleString()}</p>
                      </div>

                      {/* 場地設備 */}
                      <div className="col-md-4">
                      <hr />
                        <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>場地設備</h5>
                        <hr />
                        <p style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                          <span style={{ backgroundColor: 'white', color: space.freeInternetAvailable ? '#A4B6A4' : '#AC6A6A', fontWeight: space.freeInternetAvailable ? 'bold' : 'normal', border: '1px solid', padding: '5px 10px', borderRadius: '5px', borderColor: space.freeInternetAvailable ? '#A4B6A4' : '#AC6A6A' }}>網絡</span>
                          <span style={{ backgroundColor: 'white', color: space.freeAudioInputAvailable ? '#A4B6A4' : '#AC6A6A', fontWeight: space.freeAudioInputAvailable ? 'bold' : 'normal', border: '1px solid', padding: '5px 10px', borderRadius: '5px', borderColor: space.freeAudioInputAvailable ? '#A4B6A4' : '#AC6A6A' }}>聲音輸入</span>
                          <span style={{ backgroundColor: 'white', color: space.freeVideoInputAvailable ? '#A4B6A4' : '#AC6A6A', fontWeight: space.freeVideoInputAvailable ? 'bold' : 'normal', border: '1px solid', padding: '5px 10px', borderRadius: '5px', borderColor: space.freeVideoInputAvailable ? '#A4B6A4' : '#AC6A6A' }}>顯示信號輸入</span>
                        </p>
                        <p><strong>設施：</strong>{space.freeFacilities}</p>
                        <p><strong>空間概述：</strong>{space.freeSpaceOverview}</p>
                      </div>

                      {/* 圖片連結 */}
                      <div className="col-md-4">
                      <hr />
                        <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>圖片連結</h5>
                        <hr />
                        <p><strong>平面圖：</strong>{space.freeFloorPlanUrl ? <a href={space.freeFloorPlanUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>查看平面圖</a> : <span style={{ color: '#AC6A6A', fontWeight: 'bold' }}>目前無照片連結</span>}</p>
                        <p><strong>空間照片：</strong>
                          {space.freeFloorSpaceUrl1 ? <a href={space.freeFloorSpaceUrl1} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>空間1</a> : <span style={{ color: '#AC6A6A', fontWeight: 'bold' }}>目前無照片連結</span>}
                          {space.freeFloorSpaceUrl2 && <span>&nbsp;&nbsp;<a href={space.freeFloorSpaceUrl2} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>空間2</a></span>}
                          {space.freeFloorSpaceUrl3 && <span>&nbsp;&nbsp;<a href={space.freeFloorSpaceUrl3} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>空間3</a></span>}
                        </p>
                        <p><strong>物品照片：</strong>
                          {space.freeItemPhotoUrl1 ? <a href={space.freeItemPhotoUrl1} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>物品1</a> : <span style={{ color: '#AC6A6A', fontWeight: 'bold' }}>目前無照片連結</span>}
                          {space.freeItemPhotoUrl2 && <span>&nbsp;&nbsp;<a href={space.freeItemPhotoUrl2} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>物品2</a></span>}
                          {space.freeItemPhotoUrl3 && <span>&nbsp;&nbsp;<a href={space.freeItemPhotoUrl3} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>物品3</a></span>}
                          {space.freeItemPhotoUrl4 && <span>&nbsp;&nbsp;<a href={space.freeItemPhotoUrl4} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>物品4</a></span>}
                          {space.freeItemPhotoUrl5 && <span>&nbsp;&nbsp;<a href={space.freeItemPhotoUrl5} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>物品5</a></span>}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={changePage} />
    </div>
  );
}

export default AdminSpaces;