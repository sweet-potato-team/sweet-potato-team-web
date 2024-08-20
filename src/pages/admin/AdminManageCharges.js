import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from "axios";
import ChargeModal from "../../components/ChargeModal";
import Pagination from "../../components/Pagination";
import ActionButtonsRentals from "../../components/ActionButtonsRentals";
import { Modal } from "bootstrap";

function AdminManageCharges() {
  const [charges, setCharges] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 5,
    offset: 0,
    total: 0,
    current_page: 1,
    total_pages: 1
  });
  const [type, setType] = useState('create');
  const [tempCharge, setTempCharge] = useState({});
  const [filter, setFilter] = useState({ key: '', value: '' });

  const chargeModalRef = useRef(null);

  const getCharges = useCallback(async () => {
    try {
      const params = {
        limit: pagination.limit,
        offset: pagination.offset,
        orderBy: 'charge_id',
        sort: 'asc',
      };
      
      if (filter.key && filter.value) {
        params[filter.key] = filter.value;
      }
  
      const chargeRes = await axios.get(`http://localhost:8080/manage_charges`, { params });
  
      if (chargeRes.data && Array.isArray(chargeRes.data.results)) {
        const sortedCharges = chargeRes.data.results.sort((a, b) => a.chargeId - b.chargeId);
        setCharges(sortedCharges);
        setPagination((prevPagination) => ({
          ...prevPagination,
          total: chargeRes.data.total,
          total_pages: Math.ceil(chargeRes.data.total / pagination.limit),
        }));      
      } else {
        setCharges([]);
      }
    } catch (error) {
      console.error("Error fetching charges:", error);
      setCharges([]);
    }
  }, [pagination.limit, pagination.offset, filter]);

  useEffect(() => {
    const modalElement = document.getElementById('ChargeModal');
    if (modalElement) {
      chargeModalRef.current = new Modal(modalElement, { backdrop: 'static' });
      // console.log('Modal initialized:', chargeModalRef.current); // 調試：確認Modal初始化
    } else {
      // console.error('ChargeModal element not found in DOM'); // 調試：如果沒有找到模態框元素
    }
    getCharges();
  }, [getCharges]);

  const openChargeModal = (type, charge) => {
    setType(type);
    setTempCharge(charge);
    // console.log('Opening modal with type:', type, 'and charge:', charge); // 調試：檢查按鈕點擊後的類型和數據
    if (chargeModalRef.current) {
      chargeModalRef.current.show();
      // console.log('Modal is shown'); // 調試：確認模態框是否顯示
    } else {
      // console.error('Modal reference is not initialized'); // 調試：如果模態框引用沒有初始化
    }
  };

  const closeChargeModal = () => {
    if (chargeModalRef.current) {
      chargeModalRef.current.hide();
      // console.log('Modal is hidden'); // 調試：確認模態框是否隱藏
    }
  };

  const changePage = (newPage) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      offset: (newPage - 1) * prevPagination.limit, 
      current_page: newPage 
    }));
    getCharges(); 
  };

  const handleSearchSubmit = (selectedFilter, searchText) => {
    setFilter({ key: selectedFilter, value: searchText });
    getCharges(); // 重新獲取資料
  };

  const handleSelectChange = (selectedKey) => {
    setFilter({ key: selectedKey, value: '' });
  };

  const chargeOptions = [
    { value: 'chargeLevel', label: '收費等級' },
    { value: 'chargeCategory', label: '收費類別' },
    { value: 'paidSpaceId', label: '付費空間ID' },
  ];

  const deleteCharge = async (chargeId) => {
    if (window.confirm("確認刪除這一筆收費?")) {
      try {
        await axios.delete(`http://localhost:8080/manage_charges/${chargeId}`);
        setCharges((prevCharges) => prevCharges.filter(charge => charge.chargeId !== chargeId));
      } catch (error) {
        console.error("Error deleting charge:", error);
      }
    }
  };

  return (
    <div className='p-3'>
      <ChargeModal
        closeChargeModal={closeChargeModal}
        getCharges={() => getCharges(pagination.current_page)}
        tempCharge={tempCharge}
        type={type}
      />
      <div style={{ backgroundColor: '#D3E9FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0', width: '100%', position: 'relative' }}>
        <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
        <h3 style={{ textAlign: 'center', margin: '0' }}>
          <i className="bi bi-cash-coin me-2"></i> 收費管理
        </h3>
        <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
      </div>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <ActionButtonsRentals 
          onCreateClick={() => openChargeModal('create', {})}
          onCollapseClick={() => {}} // 保留功能，但目前不需要
          onSearchSubmit={handleSearchSubmit}
          onSelectChange={handleSelectChange}
          options={chargeOptions}
        />
      </div>

      <table className='table'>
        <thead>
          <tr>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>編號</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>付費空間ID</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>收費等級</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>收費類別</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>場地費</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>清潔費</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>保證金</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>編輯</th>
          </tr>
        </thead>

        <tbody>
          {charges.map((charge) => (
            <tr key={charge.chargeId}>
              <td style={{ textAlign: 'center' }}>{charge.chargeId}</td>              
              <td style={{ textAlign: 'center' }}>{charge.paidSpaceId}</td>
              <td style={{ textAlign: 'center' }}>{charge.chargeLevel}</td>
              <td style={{ textAlign: 'center' }}>{charge.chargeCategory}</td>
              <td style={{ textAlign: 'center' }}>{charge.chargeRentalFeeSpace}</td>
              <td style={{ textAlign: 'center' }}>{charge.chargeRentalFeeClean}</td>
              <td style={{ textAlign: 'center' }}>{charge.chargeRentalFeePermission}</td>
              <td style={{ textAlign: 'center' }}>
                <button type='button' className='btn btn-sm me-2' style={{ color: '#A4B6A4', padding: '5px 10px', border: '1px solid #A4B6A4', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => openChargeModal('edit', charge)}><i className="bi bi-feather"></i></button>
                <button type='button' className='btn btn-sm' style={{ color: '#9B6A6A', padding: '5px 10px', border: '1px solid #AF9797', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => deleteCharge(charge.chargeId)}><i className="bi bi-trash3"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={changePage} />
    </div>
  );
}

export default AdminManageCharges;
