import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from "axios";
import Pagination from "../../components/Pagination";
import DeleteModal from "../../components/DeleteModal";
import ActionButtonsTimes from "../../components/admin/ActionButtonsTimes";
import TimesFormModal from "../../components/admin/TimesFormModal";
import SpaceTimeRental from "../../components/admin/SpaceTimeRental";

function AdminManageFreeTimes() {
  const [freeTimes, setFreeTimes] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0,
    current_page: 1,
    total_pages: 1
  });
  const [tempTime, setTempTime] = useState({});
  const [type, setType] = useState('create');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showManageTableModal, setShowManageTableModal] = useState(false);
  const [selectedFreeTimeId, setSelectedFreeTimeId] = useState(null);
  const [selectedSpaceName, setSelectedSpaceName] = useState('');
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);


  const [filterConditions, setFilterConditions] = useState({
    startTime: '',
    endTime: '',
    freeSpaceId: '',
  });

  const modalRef = useRef(null);

  const getManageFreeTimes = useCallback(async () => {
    try {
      const params = {
        limit: pagination.limit,
        offset: pagination.offset,
      };
  
      if (filterConditions.startTime) {
        params.startTime = filterConditions.startTime;
      }
      if (filterConditions.endTime) {
        params.endTime = filterConditions.endTime;
      }
      if (filterConditions.freeSpaceId) {
        params.freeSpaceId = filterConditions.freeSpaceId;
      }
  
      const freeTimeRes = await axios.get("http://localhost:8080/manage_free_times", { params });
  
      if (freeTimeRes.data && Array.isArray(freeTimeRes.data.results)) {
        setFreeTimes(freeTimeRes.data.results);
        setPagination((prevPagination) => ({
          ...prevPagination,
          total: freeTimeRes.data.total,
          total_pages: Math.ceil(freeTimeRes.data.total / pagination.limit),
        }));
      } else {
        setFreeTimes([]);
      }
    } catch (error) {
      console.error("Error fetching free times:", error);
      setFreeTimes([]);
    }
  }, [pagination.limit, pagination.offset, filterConditions]);

  useEffect(() => {
    getManageFreeTimes();
  }, [getManageFreeTimes, pagination.offset, filterConditions]);

  const handleSearchSubmit = (startTime, endTime) => {
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
  
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      console.log("Formatted Date: ", formattedDate); // 確認格式化後的時間
      return formattedDate;
    };
  
    const formattedStartTime = formatDate(startTime);
    const formattedEndTime = formatDate(endTime);
  
    console.log("Start Time: ", formattedStartTime);
    console.log("End Time: ", formattedEndTime);
  
    setFilterConditions((prevConditions) => ({
      ...prevConditions,
      startTime: formattedStartTime,
      endTime: formattedEndTime
    }));
  };

  const handleSpaceSelect = (spaceId, spaceName) => {
    setSelectedSpaceName(spaceName);
    setSelectedSpaceId(spaceId);

    setFilterConditions((prevConditions) => ({
      ...prevConditions,
      freeSpaceId: spaceId,
    }));
  };

  const openManageTableModal = () => {
    if (selectedSpaceName && selectedSpaceId) {
      setShowManageTableModal(true);
    }
  };

  const closeManageTableModal = () => {
    setShowManageTableModal(false);
  };

  const openDeleteModal = (freeTimeId) => {
    setSelectedFreeTimeId(freeTimeId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedFreeTimeId(null);
  };

  const handleDelete = async (freeTimeId) => {
    try {
      await axios.delete(`http://localhost:8080/manage_free_times/${freeTimeId}`);
      setFreeTimes((prevFreeTimes) => prevFreeTimes.filter(freetime => freetime.manageFreeTimeId !== freeTimeId));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting free time:", error);
    }
  };

  const changePage = (newPage) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      offset: (newPage - 1) * prevPagination.limit,
      current_page: newPage
    }));
    getManageFreeTimes();
  };

  const handleRecordsFetched = (records) => {
    setFreeTimes(records);
  };

  const openModal = (type, time) => {
    setType(type);
    setTempTime(time);
    setShowModal(true);
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.hide();
    }
    setShowModal(false);
    getManageFreeTimes(); // 刷新資料
  };

  useEffect(() => {
    return () => {
      if (modalRef.current) {
        modalRef.current.dispose(); // 清理模态框实例
        modalRef.current = null;
      }
    };
  }, []);

  const fetchAllRecords = () => {
    setFilterConditions({
      startTime: '',
      endTime: '',
      freeSpaceId: ''
    });
    getManageFreeTimes();
  };
  return (
    <div className='p-3'>
      <div style={{ backgroundColor: '#D3E9FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0', width: '100%', position: 'relative' }}>
        <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
        <h3 style={{ textAlign: 'center', margin: '0' }}>
          <i className="bi bi-calendar-week me-2"></i> 免費空間時間管理
        </h3>
        <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
      </div>

      {showModal && (
        <TimesFormModal 
          closeModal={closeModal} 
          type={type} 
          tempTime={tempTime} 
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          close={closeDeleteModal}
          text="確認刪除這一筆紀錄?"
          handleDelete={handleDelete}
          id={selectedFreeTimeId}
        />
      )}

      {showManageTableModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 style={{ textAlign: 'center', margin: '0' , color: '#495057', }}>{`選擇時間 - ${selectedSpaceName}`}</h5>
                <button type="button" className="btn-close" onClick={closeManageTableModal}></button>
              </div>
              <div className="modal-body">
                <SpaceTimeRental spaceName={selectedSpaceName} spaceId={selectedSpaceId} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <ActionButtonsTimes 
          onCreateClick={() => openModal('create', {})} 
          onSearchSubmit={handleSearchSubmit} 
          onSelectSpace={handleSpaceSelect}
          openManageTable={openManageTableModal}
          onRecordsFetched={handleRecordsFetched}
          fetchAllRecords={fetchAllRecords}
        />
      </div>

      <table className='table'>
        <thead>
          <tr>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF', width: '50px' }}>編號</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>免費空間ID</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>開始時間</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>結束時間</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>狀態</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>借用單位名稱</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>編輯</th>
          </tr>
        </thead>
        <tbody>
          {freeTimes.map((freetime) => (
            <tr key={freetime.manageFreeTimeId}>
              <td style={{ textAlign: 'center' }}>{freetime.manageFreeTimeId}</td>              
              <td style={{ textAlign: 'center' }}>{freetime.freeSpaceId}</td>
              <td style={{ textAlign: 'center' }}>{new Date(freetime.startTime).toLocaleString()}</td>
              <td style={{ textAlign: 'center' }}>{new Date(freetime.endTime).toLocaleString()}</td>
              <td style={{ textAlign: 'center' }}>{freetime.manageStatus}</td>
              <td style={{ textAlign: 'center' }}>{freetime.spaceRentalUnit || 'N/A'}</td>
              <td style={{ textAlign: 'center' }}>
                {freetime.manageStatus === 'admin_blocked' && (
                  <>
                    <button 
                      type='button' 
                      className='btn btn-sm me-2' 
                      style={{ color: '#A4B6A4', padding: '5px 10px', border: '1px solid #A4B6A4', backgroundColor: 'white', borderRadius: '5px' }} 
                      onClick={() => openModal('edit', freetime)}
                    >
                      <i className="bi bi-feather"></i>
                    </button>
                    <button 
                      type='button' 
                      className='btn btn-sm' 
                      style={{ color: '#9B6A6A', padding: '5px 10px', border: '1px solid #AF9797', backgroundColor: 'white', borderRadius: '5px' }} 
                      onClick={() => openDeleteModal(freetime.manageFreeTimeId)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={changePage} />
    </div>
  );
}

export default AdminManageFreeTimes;

