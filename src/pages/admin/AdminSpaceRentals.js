import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from "axios";
import SpaceRentalModal from "../../components/SpaceRentalModal"; // 引入新的 Modal 组件
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";
import ActionButtonsRentals from "../../components/ActionButtonsRentals";  // 引入 ActionButtonsRentals 组件

function AdminSpaceRentals() { 
  const [spaceRentals, setSpaceRentals] = useState([]); 
  const [pagination, setPagination] = useState({
    limit: 5, offset: 0, total: 0, current_page: 1, total_pages: 1
  });
  const [expandedRentals, setExpandedRentals] = useState({});
  const [type, setType] = useState('create');
  const [tempRental, setTempRental] = useState({});
  const [filterField, setFilterField] = useState(''); // 添加筛选字段
  const [filterValue, setFilterValue] = useState(''); // 添加筛选值

  const rentalModal = useRef(null);

  const getSpaceRentals = useCallback(async () => {
    try {
      const rentalRes = await axios.get(`http://localhost:8080/space_rentals`, {
        params: {
          limit: pagination.limit,
          offset: pagination.offset,
          [filterField]: filterValue // 添加筛选条件到请求中
        },
      });

      if (rentalRes.data && Array.isArray(rentalRes.data.results)) {
        const sortedRentals = rentalRes.data.results.sort((a, b) => a.spaceRentalId - b.spaceRentalId); 
        setSpaceRentals(sortedRentals);
        setPagination((prevPagination) => ({
          ...prevPagination, total: rentalRes.data.total, total_pages: Math.ceil(rentalRes.data.total / pagination.limit),
        }));      
      } else {
        setSpaceRentals([]);
      }
    } catch (error) {
      console.error("Error fetching space rentals:", error);
      setSpaceRentals([]);
    }
  }, [pagination.limit, pagination.offset, filterField, filterValue]);

  useEffect(() => {
    rentalModal.current = new Modal('#rentalModal', { backdrop: 'static' });
    getSpaceRentals();
  }, [getSpaceRentals]); 

  const handleSelectChange = (selectedField) => {
    setFilterField(selectedField);
  };

  const handleSearchSubmit = (field, value) => {
    setFilterField(field);
    setFilterValue(value);
    getSpaceRentals();
  };
  
  const toggleExpandRental = (rentalId) => {
    setExpandedRentals((prevExpandedRentals) => ({
      ...prevExpandedRentals, [rentalId]: !prevExpandedRentals[rentalId]
    }));
  };

  const toggleAllExpandRentals = (expand) => {
    const newExpandedRentals = {};
    spaceRentals.forEach((rental) => { newExpandedRentals[rental.spaceRentalId] = expand; });
    setExpandedRentals(newExpandedRentals);
  };

  const openRentalModal = (type, rental) => { setType(type); setTempRental(rental); rentalModal.current.show(); };
  const closeRentalModal = () => { rentalModal.current.hide(); };

  const toggleActivationStatus = async (rental) => {
    try {
      const updatedRental = {
        ...rental,
        spaceRentalSuccess: rental.spaceRentalSuccess ? 0 : 1, // Toggle the status
      };
      
      await axios.put(`http://localhost:8080/space_rentals/${rental.spaceRentalId}`, updatedRental);

      setSpaceRentals((prevRentals) =>
        prevRentals.map((r) =>
          r.spaceRentalId === rental.spaceRentalId
            ? { ...r, spaceRentalSuccess: updatedRental.spaceRentalSuccess }
            : r
        )
      );
    } catch (error) {
      console.error("Error updating rental status:", error);
    }
  };

  const deleteRental = async (rentalId) => {
    if (window.confirm("確認刪除這一筆紀錄?")) {
      try {
        await axios.delete(`http://localhost:8080/space_rentals/${rentalId}`);
        setSpaceRentals((prevRentals) => prevRentals.filter(rental => rental.spaceRentalId !== rentalId));
      } catch (error) {
        console.error("Error deleting rental:", error);
      }
    }
  };

  const changePage = (newPage) => {
    setPagination((prevPagination) => ({
      ...prevPagination, offset: (newPage - 1) * prevPagination.limit, current_page: newPage
    }));
    getSpaceRentals();
  };

  
  const spaceOptions = [
    { value: 'spaceRentalUnit', label: '申請單位' },
    { value: 'spaceRentalRenter', label: '申請人' },
    { value: 'spaceRentalEmail', label: '電子郵件' },
    { value: 'spaceRentalPhone', label: '聯絡電話' },
    { value: 'spaceRentalDateTime', label: '申請時間' },
    { value: 'spaceRentalDateTimeCount', label: '申請時數' },
    { value: 'spaceRentalReason', label: '申請理由' },
    { value: 'spaceRentalAgree', label: '申請者同意' },
    { value: 'spaceRentalSuccess', label: '是否通過(通過為0)' },
    { value: 'freeSpaceName', label: '空間名稱' }
];
  return (
    <div className='p-3'>
      <SpaceRentalModal closeRentalModal={closeRentalModal} getSpaceRentals={() => getSpaceRentals(pagination.current_page)} tempRental={tempRental} type={type} />
      <div style={{ backgroundColor: '#D3E9FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0', width: '100%', position: 'relative' }}>
        <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
        <h3 style={{ textAlign: 'center', margin: '0' }}><i className="bi bi-chat-text me-2"></i> 免費空間紀錄</h3>
        <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
      </div>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <ActionButtonsRentals 
          onCreateClick={() => openRentalModal('create', {})} 
          onCollapseClick={() => toggleAllExpandRentals(false)} 
          onSearchSubmit={handleSearchSubmit} 
          onSelectChange={handleSelectChange}
          options={spaceOptions}
        />
      </div>

      <table className='table'>
        <thead>
          <tr>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF', width: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>編號</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>空間編號</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>申請單位</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>申請地點</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>狀態</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>編輯</th>
          </tr>
        </thead>

        <tbody>
          {spaceRentals.map((rental) => (
            <React.Fragment key={rental.spaceRentalId}>
              <tr>
                <td style={{ textAlign: 'center', width: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rental.spaceRentalId}</td>              
                <td style={{ textAlign: 'center' }}>{rental.freeSpaceId}</td>
                <td style={{ textAlign: 'center' }}>{rental.spaceRentalUnit}</td>
                <td style={{ textAlign: 'center' }}>{rental.freeSpaceName}</td> 
                <td style={{ textAlign: 'center' }}>
                  <button style={{ backgroundColor: 'white', color: rental.spaceRentalSuccess ? '#A4B6A4' : '#9B6A6A', border: '1px solid', borderColor: rental.spaceRentalSuccess ? '#A4B6A4' : '#AF9797', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#E7ECEF'} onMouseLeave={(e) => e.target.style.backgroundColor = 'white'} onClick={() => toggleActivationStatus(rental)}>{rental.spaceRentalSuccess ? '通過' : '未通過'}</button>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button type='button' className='btn btn-sm me-2' style={{ color: '#486484', padding: '5px 10px', border: '1px solid #486484', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => toggleExpandRental(rental.spaceRentalId)}>{expandedRentals[rental.spaceRentalId] ? <i className="bi bi-caret-up"></i> : <i className="bi bi-caret-down"></i>}</button>
                  <button type='button' className='btn btn-sm me-2' style={{ color: '#A4B6A4', padding: '5px 10px', border: '1px solid #A4B6A4', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => openRentalModal('edit', rental)}><i className="bi bi-feather"></i></button>
                  <button type='button' className='btn btn-sm' style={{ color: '#9B6A6A', padding: '5px 10px', border: '1px solid #AF9797', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => deleteRental(rental.spaceRentalId)}><i className="bi bi-trash3"></i></button>
                </td>
              </tr>
  
              {expandedRentals[rental.spaceRentalId] && (
                <tr key={`expanded-${rental.spaceRentalId}`}>
                  <td colSpan="6" style={{ backgroundColor: '#F2F5F7' }}>
                    <div className="row">
                      <div className="col-md-6">
                      <hr />
                        <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>申請信息</h5>
                        <hr />
                        <p><strong>申請時間：</strong>{rental.spaceRentalDateTime}</p>
                        <p><strong>申請時數：</strong>{rental.spaceRentalDateTimeCount}</p>
                        <p><strong>創建時間：</strong>{new Date(rental.spaceRentalCreatedAt).toLocaleString()}</p>
                        <p><strong>申請理由：</strong>{rental.spaceRentalReason}</p>
                      </div>

                      <div className="col-md-6">
                      <hr />
                        <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>聯絡資訊</h5>
                        <hr />
                        <p><strong>申請人：</strong>{rental.spaceRentalRenter}</p>
                        <p><strong>聯絡電話：</strong>{rental.spaceRentalPhone}</p>
                        <p><strong>電子郵件：</strong>{rental.spaceRentalEmail}</p>
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

export default AdminSpaceRentals;
