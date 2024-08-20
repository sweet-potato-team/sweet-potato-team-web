// AdminPaidSpaces.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from "axios";
import PaidSpaceModal from "../../components/PaidSpaceModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";
import ActionButtons from "../../components/ActionButtons";

function AdminPaidSpaces() {
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

  const paidSpaceModalRef = useRef(null);

  const getSpaces = useCallback(async () => {
    try {
      const params = {
        limit: pagination.limit,
        offset: pagination.offset,
      };

      if (filter.key && filter.value) {
        params[filter.key] = filter.value;
      }

      const spaceRes = await axios.get(`http://localhost:8080/paid_spaces`, { params });

      if (spaceRes.data && Array.isArray(spaceRes.data.results)) {
        const sortedSpaces = spaceRes.data.results.sort((a, b) => a.paidSpaceId - b.paidSpaceId);
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
    setTimeout(() => {
      const modalElement = document.getElementById('PaidSpaceModal');
      if (modalElement) {
        paidSpaceModalRef.current = new Modal(modalElement, {
          backdrop: 'static',
        });
      }
    }, 0);

    getSpaces();
  }, [getSpaces]);

  const openPaidSpaceModal = (type, space) => {
    setType(type);
    setTempSpace(space);
    if (paidSpaceModalRef.current) {
      paidSpaceModalRef.current.show();
    }
  };

  const closePaidSpaceModal = () => {
    if (paidSpaceModalRef.current) {
      paidSpaceModalRef.current.hide();
    }
  };

  const toggleExpandSpace = (spaceId) => {
    setExpandedSpaces((prevExpandedSpaces) => ({
      ...prevExpandedSpaces,
      [spaceId]: !prevExpandedSpaces[spaceId]
    }));
  };

  const toggleAllExpandSpaces = (expand) => {
    const newExpandedSpaces = {};
    spaces.forEach((space) => {
      newExpandedSpaces[space.paidSpaceId] = expand;
    });
    setExpandedSpaces(newExpandedSpaces);
  };

  const toggleActivationStatus = async (space) => {
    try {
      const updatedSpace = { ...space, paidIsActive: space.paidIsActive ? 0 : 1 };
      await axios.put(`http://localhost:8080/paid_spaces/${space.paidSpaceId}`, updatedSpace);
      setSpaces((prevSpaces) =>
        prevSpaces.map((s) =>
          s.paidSpaceId === space.paidSpaceId ? { ...s, paidIsActive: !s.paidIsActive } : s
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

  const deleteSpace = async (spaceId) => {
    if (window.confirm("確認刪除這一筆【付費】空間?")) {
      try {
        await axios.delete(`http://localhost:8080/paid_spaces/${spaceId}`);
        setSpaces((prevSpaces) => prevSpaces.filter(space => space.paidSpaceId !== spaceId));
      } catch (error) {
        console.error("Error deleting space:", error);
      }
    }
  };

  const paidSpaceOptions = [
    { value: 'paidSpaceName', label: '名稱' },
    { value: 'paidSpaceLocation', label: '位置' },
    // 你可以在这里添加更多选项
  ];

  return (
    <div className='p-3'>
      <PaidSpaceModal
        closePaidSpaceModal={closePaidSpaceModal}
        getSpaces={() => getSpaces(pagination.current_page)}
        tempSpace={tempSpace}
        type={type}
      />
      <div style={{ backgroundColor: '#D3E9FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0', width: '100%', position: 'relative' }}>
        <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
        <h3 style={{ textAlign: 'center', margin: '0' }}>
          <i className="bi bi-cash-coin me-2"></i> 付費空間列表
        </h3>
        <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
      </div>
      
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <ActionButtons 
            onCreateClick={() => openPaidSpaceModal('create', {})} 
            onCollapseClick={() => toggleAllExpandSpaces(false)}
            onSearchSubmit={handleSearchSubmit}
            onSelectChange={handleSelectChange}
            options={paidSpaceOptions}
          />
      </div>

      <table className='table'>
        <thead >
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
            <React.Fragment key={space.paidSpaceId}>
            <tr>
              <td style={{ textAlign: 'center', width: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{space.paidSpaceId}</td>              
              <td style={{ textAlign: 'center' }}>{space.paidSpaceName}</td>
              <td style={{ textAlign: 'center' }}>{space.paidSpaceLocation}</td>
              <td style={{ textAlign: 'center' }}>
                <button style={{ backgroundColor: 'white', color: space.paidIsActive ? '#A4B6A4' : '#9B6A6A', border: '1px solid', borderColor: space.paidIsActive ? '#A4B6A4' : '#AF9797', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#E7ECEF'} onMouseLeave={(e) => e.target.style.backgroundColor = 'white'} onClick={() => toggleActivationStatus(space)}>{space.paidIsActive ? '啟用中' : '未啟用'}</button>
              </td>
              <td style={{ textAlign: 'center' }}>
                <button type='button' className='btn btn-sm me-2' style={{ color: '#486484', padding: '5px 10px', border: '1px solid #486484', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => toggleExpandSpace(space.paidSpaceId)}>{expandedSpaces[space.paidSpaceId] ? <i className="bi bi-caret-up"></i> : <i className="bi bi-caret-down"></i>}</button>
                <button type='button' className='btn btn-sm me-2' style={{ color: '#A4B6A4', padding: '5px 10px', border: '1px solid #A4B6A4', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => openPaidSpaceModal('edit', space)}><i className="bi bi-feather"></i></button>
                <button type='button' className='btn btn-sm' style={{ color: '#9B6A6A', padding: '5px 10px', border: '1px solid #AF9797', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => deleteSpace(space.paidSpaceId)}><i className="bi bi-trash3"></i></button>                
              </td>
            </tr>

              {expandedSpaces[space.paidSpaceId] && (
                <tr key={`expanded-${space.paidSpaceId}`}>
                  <td colSpan="5" style={{ backgroundColor: '#F2F5F7' }}>
                    <div className="row">
                      {/* 場地資訊 */}
                      <div className="col-md-4">
                      <hr />
                        <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>場地資訊</h5>
                        <hr />
                        <p><strong>容納人數：</strong>{space.paidCapacity}</p>
                        <p><strong>啟用狀態：</strong>{space.paidIsActive ? '是' : '否'}</p>
                        <p><strong>建立日期：</strong>{new Date(space.paidCreatedDate).toLocaleString()}</p>
                        <p><strong>最後修改日期：</strong>{new Date(space.paidLastModifiedDate).toLocaleString()}</p>
                      </div>

                      {/* 場地設備 */}
                      <div className="col-md-4">
                      <hr />
                        <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>場地設備</h5>
                        <hr />
                        <p style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                          <span style={{ backgroundColor: 'white', color: space.paidInternetAvailable ? '#A4B6A4' : '#AC6A6A', fontWeight: space.paidInternetAvailable ? 'bold' : 'normal', border: '1px solid', padding: '5px 10px', borderRadius: '5px', borderColor: space.paidInternetAvailable ? '#A4B6A4' : '#AC6A6A' }}>網絡</span>
                          <span style={{ backgroundColor: 'white', color: space.paidAudioInputAvailable ? '#A4B6A4' : '#AC6A6A', fontWeight: space.paidAudioInputAvailable ? 'bold' : 'normal', border: '1px solid', padding: '5px 10px', borderRadius: '5px', borderColor: space.paidAudioInputAvailable ? '#A4B6A4' : '#AC6A6A' }}>聲音輸入</span>
                          <span style={{ backgroundColor: 'white', color: space.paidVideoInputAvailable ? '#A4B6A4' : '#AC6A6A', fontWeight: space.paidVideoInputAvailable ? 'bold' : 'normal', border: '1px solid', padding: '5px 10px', borderRadius: '5px', borderColor: space.paidVideoInputAvailable ? '#A4B6A4' : '#AC6A6A' }}>顯示信號輸入</span>
                        </p>
                        <p><strong>設施：</strong>{space.paidFacilities}</p>
                        <p><strong>空間概述：</strong>{space.paidSpaceOverview}</p>
                      </div>

                      {/* 圖片連結 */}
                      <div className="col-md-4">
                      <hr />
                        <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>圖片連結</h5>
                        <hr />
                        <p><strong>收費標準表：</strong>{space.paidChargesUrl ? <a href={space.paidChargesUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>查看收費標準表</a> : <span style={{ color: '#AC6A6A', fontWeight: 'bold' }}>目前無表單連結</span>}</p>
                        <p><strong>平面圖：</strong>{space.paidFloorPlanUrl ? <a href={space.paidFloorPlanUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>查看平面圖</a> : <span style={{ color: '#AC6A6A', fontWeight: 'bold' }}>目前無照片連結</span>}</p>
                        <p><strong>空間照片：</strong>
                          {space.paidFloorSpaceUrl1 ? <a href={space.paidFloorSpaceUrl1} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>空間1</a> : <span style={{ color: '#AC6A6A', fontWeight: 'bold' }}>目前無照片連結</span>}
                          {space.paidFloorSpaceUrl2 && <span>&nbsp;&nbsp;<a href={space.paidFloorSpaceUrl2} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>空間2</a></span>}
                          {space.paidFloorSpaceUrl3 && <span>&nbsp;&nbsp;<a href={space.paidFloorSpaceUrl3} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>空間3</a></span>}
                        </p>
                        <p><strong>物品照片：</strong>
                          {space.paidItemPhotoUrl1 ? <a href={space.paidItemPhotoUrl1} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>物品1</a> : <span style={{ color: '#AC6A6A', fontWeight: 'bold' }}>目前無照片連結</span>}
                          {space.paidItemPhotoUrl2 && <span>&nbsp;&nbsp;<a href={space.paidItemPhotoUrl2} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>物品2</a></span>}
                          {space.paidItemPhotoUrl3 && <span>&nbsp;&nbsp;<a href={space.paidItemPhotoUrl3} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>物品3</a></span>}
                          {space.paidItemPhotoUrl4 && <span>&nbsp;&nbsp;<a href={space.paidItemPhotoUrl4} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>物品4</a></span>}
                          {space.paidItemPhotoUrl5 && <span>&nbsp;&nbsp;<a href={space.paidItemPhotoUrl5} target="_blank" rel="noopener noreferrer" style={{ color: '#6096BA' }}>物品5</a></span>}
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

export default AdminPaidSpaces;
