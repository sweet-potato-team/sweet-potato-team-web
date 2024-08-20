import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from "axios";
import PaidSpaceRentalModal from "../../components/PaidSpaceRentalModal"; 
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";
import ActionButtonsRentals from "../../components/ActionButtonsRentals";

function AdminPaidSpaceRentals() { 
  const [spaceRentals, setSpaceRentals] = useState([]); 
  const [pagination, setPagination] = useState({
    limit: 5, offset: 0, total: 0, current_page: 1, total_pages: 1
  });
  const [expandedRentals, setExpandedRentals] = useState({});
  const [type, setType] = useState('create');
  const [tempRental, setTempRental] = useState({});
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const rentalModal = useRef(null);

  const getSpaceRentals = useCallback(async () => {
    try {
      const rentalRes = await axios.get(`http://localhost:8080/paid_space_rentals`, {
        params: {
          limit: pagination.limit,
          offset: pagination.offset,
          [filterField]: filterValue
        },
      });
  
      if (rentalRes.data && Array.isArray(rentalRes.data.results)) {
        const sortedRentals = rentalRes.data.results.sort((a, b) => a.paidSpaceRentalId - b.paidSpaceRentalId); 
        setSpaceRentals(sortedRentals);
        setPagination((prevPagination) => ({
          ...prevPagination, total: rentalRes.data.total, total_pages: Math.ceil(rentalRes.data.total / pagination.limit),
        }));      
      } else {
        setSpaceRentals([]);
      }
    } catch (error) {
      console.error("Error fetching paid space rentals:", error);
      setSpaceRentals([]);
    }
  }, [pagination.limit, pagination.offset, filterField, filterValue]);
  
  useEffect(() => {
    rentalModal.current = new Modal('#rentalModal', { backdrop: 'static' });
    getSpaceRentals(); 
  }, [getSpaceRentals]);
  
  const changePage = (newPage) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      offset: (newPage - 1) * prevPagination.limit,
      current_page: newPage,
    }));
    getSpaceRentals();
  };

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
    spaceRentals.forEach((rental) => { newExpandedRentals[rental.paidSpaceRentalId] = expand; });
    setExpandedRentals(newExpandedRentals);
  };

  const openRentalModal = (type, rental) => { setType(type); setTempRental(rental); rentalModal.current.show(); };
  const closeRentalModal = () => { rentalModal.current.hide(); };

  const toggleActivationStatus = async (rental) => {
    try {
      const updatedRental = {
        ...rental,
        paidSpaceRentalSuccess: rental.paidSpaceRentalSuccess ? 0 : 1,
      };
      
      await axios.put(`http://localhost:8080/paid_space_rentals/${rental.paidSpaceRentalId}`, updatedRental);

      setSpaceRentals((prevRentals) =>
        prevRentals.map((r) =>
          r.paidSpaceRentalId === rental.paidSpaceRentalId
            ? { ...r, paidSpaceRentalSuccess: updatedRental.paidSpaceRentalSuccess }
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
        await axios.delete(`http://localhost:8080/paid_space_rentals/${rentalId}`);
        setSpaceRentals((prevRentals) => prevRentals.filter(rental => rental.paidSpaceRentalId !== rentalId));
      } catch (error) {
        console.error("Error deleting rental:", error);
      }
    }
  };

  return (
    <div className='p-3'>
      <PaidSpaceRentalModal 
        closeRentalModal={closeRentalModal} 
        getSpaceRentals={() => getSpaceRentals(pagination.current_page)} 
        tempRental={tempRental} 
        type={type} 
      />
      
      <div style={{ backgroundColor: '#D3E9FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0', width: '100%', position: 'relative' }}>
        <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
        <h3 style={{ textAlign: 'center', margin: '0' }}><i className="bi bi-cash-coin me-2"></i>付費空間紀錄</h3>
        <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
      </div>
  
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <ActionButtonsRentals 
          onCreateClick={() => openRentalModal('create', {})} 
          onCollapseClick={() => toggleAllExpandRentals(false)} 
          onSearchSubmit={handleSearchSubmit} 
          onSelectChange={handleSelectChange}
          options={[
            { value: 'paidSpaceRentalUnit', label: '申請單位' },
            { value: 'paidSpaceRentalRenter', label: '申請人' },
            { value: 'paidSpaceRentalEmail', label: '電子郵件' },
            { value: 'paidSpaceRentalPhone', label: '聯絡電話' },
            { value: 'paidSpaceRentalDateTimeStart1', label: '起始時間1' },
            { value: 'paidSpaceRentalDateTimeEnd1', label: '結束時間1' },
            { value: 'paidSpaceRentalDateTimeStart2', label: '起始時間2' },
            { value: 'paidSpaceRentalDateTimeEnd2', label: '結束時間2' },
            { value: 'paidSpaceRentalReason', label: '申請理由' },
            { value: 'paidSpaceRentalAgree', label: '申請者同意' },
            { value: 'paidSpaceRentalSuccess', label: '是否通過(通過為1)' },
            { value: 'paidSpaceName', label: '空間名稱' }
          ]}
        />
      </div>
  
      <table className='table'>
        <thead>
          <tr>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>編號</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>空間名稱</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>申請單位</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>申請人</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>狀態</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>編輯</th>
          </tr>
        </thead>
        <tbody>
          {spaceRentals.map((rental) => (
            <React.Fragment key={rental.paidSpaceRentalId}>
              <tr>
                <td style={{ textAlign: 'center' }}>{rental.paidSpaceRentalId}</td>
                <td style={{ textAlign: 'center' }}>{rental.paidSpaceName}</td>
                <td style={{ textAlign: 'center' }}>{rental.paidSpaceRentalUnit}</td>
                <td style={{ textAlign: 'center' }}>{rental.paidSpaceRentalRenter}</td>
                <td style={{ textAlign: 'center' }}>
                  <button style={{ backgroundColor: 'white', color: rental.paidSpaceRentalSuccess ? '#A4B6A4' : '#9B6A6A', border: '1px solid', borderColor: rental.paidSpaceRentalSuccess ? '#A4B6A4' : '#AF9797', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#E7ECEF'} onMouseLeave={(e) => e.target.style.backgroundColor = 'white'} onClick={() => toggleActivationStatus(rental)}>{rental.paidSpaceRentalSuccess ? '通過' : '未通過'}</button>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button type='button' className='btn btn-sm me-2' style={{ color: '#486484', padding: '5px 10px', border: '1px solid #486484', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => toggleExpandRental(rental.paidSpaceRentalId)}>{expandedRentals[rental.paidSpaceRentalId] ? <i className="bi bi-caret-up"></i> : <i className="bi bi-caret-down"></i>}</button>
                  <button type='button' className='btn btn-sm me-2' style={{ color: '#A4B6A4', padding: '5px 10px', border: '1px solid #A4B6A4', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => openRentalModal('edit', rental)}><i className="bi bi-feather"></i></button>
                  <button type='button' className='btn btn-sm' style={{ color: '#9B6A6A', padding: '5px 10px', border: '1px solid #AF9797', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => deleteRental(rental.paidSpaceRentalId)}><i className="bi bi-trash3"></i></button>
                </td>
              </tr>
              {expandedRentals[rental.paidSpaceRentalId] && (
                <tr key={`expanded-${rental.paidSpaceRentalId}`}>
                  <td colSpan="6" style={{ backgroundColor: '#F2F5F7' }}>
                    <div className="row">
                      <div className="col-md-4">
                        <hr />
                        <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>申請信息</h5>
                        <hr />
                        <p><strong>活動名稱：</strong>{rental.paidSpaceRentalReason}</p>
                        <p><strong>使用人數：</strong>{rental.paidSpaceRentalUsers}</p>
                        <p><strong>活動類型：</strong>
                          {rental.paidSpaceRentalActivityType === 1 && '學術演講'}
                          {rental.paidSpaceRentalActivityType === 2 && '學術研討會'}
                          {rental.paidSpaceRentalActivityType === 3 && `其他: ${rental.paidSpaceRentalTypeOthers}`}
                        </p>

                        <p><strong>申請單位類型：</strong>
                          {rental.paidSpaceRentalUnitType === 1 && '校內'}
                          {rental.paidSpaceRentalUnitType === 2 && '校外'}
                        </p>


                        <p><strong>聯絡電話：</strong>{rental.paidSpaceRentalPhone}</p>
                        <p><strong>電子郵件：</strong>{rental.paidSpaceRentalEmail}</p>
                      </div>
  
                      <div className="col-md-4">
                        <hr />
                        <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>時間信息</h5>
                        <hr />
                        <p><strong>開始 1：</strong>{new Date(rental.paidSpaceRentalDateTimeStart1).toLocaleString()}</p>
                        <p><strong>結束 1：</strong>{new Date(rental.paidSpaceRentalDateTimeEnd1).toLocaleString()}</p>
                        <p><strong>備註1：</strong>{rental.paidSpaceRentalNote1|| '--(無備註)--'}</p>

                        <p><strong>開始 2：</strong>{rental.paidSpaceRentalDateTimeStart2 ? new Date(rental.paidSpaceRentalDateTimeStart2).toLocaleString() : '無'}</p>
                        <p><strong>結束 2：</strong>{rental.paidSpaceRentalDateTimeEnd2 ? new Date(rental.paidSpaceRentalDateTimeEnd2).toLocaleString() : '無'}</p>
                        <p><strong>備註2：</strong>{rental.paidSpaceRentalNote2 || '--(無備註)--'}</p>

                        <p><strong>最遲繳費時間：</strong>{new Date(rental.paidSpaceRentalPayDate).toLocaleString()}</p>
                        <p><strong>創建日期：</strong>{new Date(rental.paidSpaceRentalCreatedDate).toLocaleString()}</p>
                        <p><strong>最後修改時間：</strong>{new Date(rental.paidSpaceRentalLastModified).toLocaleString()}</p>
                      </div>
  
                      <div className="col-md-4">
                        <hr />
                        <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>費用信息</h5>
                        <hr />
                        <p><strong>場地費：</strong>{rental.paidSpaceRentalFeeSpace}</p>
                        <p><strong>清潔費：</strong>{rental.paidSpaceRentalFeeClean}</p>
                        <p><strong>保證金：</strong>{rental.paidSpaceRentalFeePermission}</p>
                        <p><strong>場地費收費級別：</strong>{rental.paidSpaceRentalFeeSpaceType}</p>
                        <p><strong>是否與研發處合辦活動：</strong>{rental.paidSpaceRentalFeeActivityPartner === 1 ? '是' : '否'}</p>
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

export default AdminPaidSpaceRentals;

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import axios from "axios";
// import PaidSpaceRentalModal from "../../components/PaidSpaceRentalModal"; // 確保此 Modal 支持付費空間的資料結構
// import Pagination from "../../components/Pagination";
// import { Modal } from "bootstrap";
// import ActionButtonsRentals from "../../components/ActionButtonsRentals"; // 需調整以支持新的動作

// function AdminPaidSpaceRentals() { 
//   const [spaceRentals, setSpaceRentals] = useState([]); 
//   const [pagination, setPagination] = useState({
//     limit: 5, offset: 0, total: 0, current_page: 1, total_pages: 1
//   });
//   const [expandedRentals, setExpandedRentals] = useState({});
//   const [type, setType] = useState('create');
//   const [tempRental, setTempRental] = useState({});
//   const [filterField, setFilterField] = useState('');
//   const [filterValue, setFilterValue] = useState('');

//   const rentalModal = useRef(null);

//   const getSpaceRentals = useCallback(async () => {
//     try {
//       const rentalRes = await axios.get(`http://localhost:8080/paid_space_rentals`, {
//         params: {
//           limit: pagination.limit,
//           offset: pagination.offset,
//           [filterField]: filterValue
//         },
//       });
  
//       // console.log("API response:", rentalRes.data); // 新增這一行來打印 API 響應
  
//       if (rentalRes.data && Array.isArray(rentalRes.data.results)) {
//         const sortedRentals = rentalRes.data.results.sort((a, b) => a.paidSpaceRentalId - b.paidSpaceRentalId); 
//         setSpaceRentals(sortedRentals);
//         setPagination((prevPagination) => ({
//           ...prevPagination, total: rentalRes.data.total, total_pages: Math.ceil(rentalRes.data.total / pagination.limit),
//         }));      
//       } else {
//         setSpaceRentals([]);
//       }
//     } catch (error) {
//       console.error("Error fetching paid space rentals:", error);
//       setSpaceRentals([]);
//     }
//   }, [pagination.limit, pagination.offset, filterField, filterValue]);
  

//   useEffect(() => {
//     rentalModal.current = new Modal('#rentalModal', { backdrop: 'static' });
//     getSpaceRentals(); // 只在組件加載時調用一次
//   }, [getSpaceRentals]); // 添加 getSpaceRentals 作為依賴項
  
  
//   const changePage = (newPage) => {
//     setPagination((prevPagination) => ({
//       ...prevPagination,
//       offset: (newPage - 1) * prevPagination.limit,
//       current_page: newPage,
//     }));
//     getSpaceRentals(); // 這裡再次調用 getSpaceRentals，但只在頁碼變更時
//   };
  

//   const handleSelectChange = (selectedField) => {
//     setFilterField(selectedField);
//   };

//   const handleSearchSubmit = (field, value) => {
//     setFilterField(field);
//     setFilterValue(value);
//     getSpaceRentals();
//   };

//   const toggleExpandRental = (rentalId) => {
//     setExpandedRentals((prevExpandedRentals) => ({
//       ...prevExpandedRentals, [rentalId]: !prevExpandedRentals[rentalId]
//     }));
//   };

//   const toggleAllExpandRentals = (expand) => {
//     const newExpandedRentals = {};
//     spaceRentals.forEach((rental) => { newExpandedRentals[rental.paidSpaceRentalId] = expand; });
//     setExpandedRentals(newExpandedRentals);
//   };

//   const openRentalModal = (type, rental) => { setType(type); setTempRental(rental); rentalModal.current.show(); };
//   const closeRentalModal = () => { rentalModal.current.hide(); };

//   const toggleActivationStatus = async (rental) => {
//     try {
//       const updatedRental = {
//         ...rental,
//         paidSpaceRentalSuccess: rental.paidSpaceRentalSuccess ? 0 : 1,
//       };
      
//       await axios.put(`http://localhost:8080/paid_space_rentals/${rental.paidSpaceRentalId}`, updatedRental);

//       setSpaceRentals((prevRentals) =>
//         prevRentals.map((r) =>
//           r.paidSpaceRentalId === rental.paidSpaceRentalId
//             ? { ...r, paidSpaceRentalSuccess: updatedRental.paidSpaceRentalSuccess }
//             : r
//         )
//       );
//     } catch (error) {
//       console.error("Error updating rental status:", error);
//     }
//   };

//   const deleteRental = async (rentalId) => {
//     if (window.confirm("確認刪除這一筆紀錄?")) {
//       try {
//         await axios.delete(`http://localhost:8080/paid_space_rentals/${rentalId}`);
//         setSpaceRentals((prevRentals) => prevRentals.filter(rental => rental.paidSpaceRentalId !== rentalId));
//       } catch (error) {
//         console.error("Error deleting rental:", error);
//       }
//     }
//   };



//   return (
//     <div className='p-3'>
//       <PaidSpaceRentalModal 
//         closeRentalModal={closeRentalModal} 
//         getSpaceRentals={() => getSpaceRentals(pagination.current_page)} 
//         tempRental={tempRental} 
//         type={type} 
//       />
      
//       <div style={{ backgroundColor: '#D3E9FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0', width: '100%', position: 'relative' }}>
//         <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
//         <h3 style={{ textAlign: 'center', margin: '0' }}><i className="bi bi-cash-coin me-2"></i>付費空間紀錄</h3>
//         <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
//       </div>
  
//       <div style={{ marginTop: '20px', marginBottom: '20px' }}>
//         <ActionButtonsRentals 
//           onCreateClick={() => openRentalModal('create', {})} 
//           onCollapseClick={() => toggleAllExpandRentals(false)} 
//           onSearchSubmit={handleSearchSubmit} 
//           onSelectChange={handleSelectChange}
//           options={[
//             { value: 'paidSpaceRentalUnit', label: '申請單位' },
//             { value: 'paidSpaceRentalRenter', label: '申請人' },
//             { value: 'paidSpaceRentalEmail', label: '電子郵件' },
//             { value: 'paidSpaceRentalPhone', label: '聯絡電話' },
//             { value: 'paidSpaceRentalDateTimeStart', label: '起始時間' },
//             { value: 'paidSpaceRentalDateTimeEnd', label: '結束時間' },
//             { value: 'paidSpaceRentalReason', label: '申請理由' },
//             { value: 'paidSpaceRentalAgree', label: '申請者同意' },
//             { value: 'paidSpaceRentalSuccess', label: '是否通過(通過為1)' },
//             { value: 'paidSpaceName', label: '空間名稱' }
//           ]}
//         />
//       </div>
  
//       <table className='table'>
//         <thead>
//           <tr>
//             <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>編號</th>
//             <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>空間名稱</th>
//             <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>申請單位</th>
//             <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>申請人</th>
//             <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>狀態</th>
//             <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>編輯</th>
//           </tr>
//         </thead>
//         <tbody>
//           {spaceRentals.map((rental) => (
//             <React.Fragment key={rental.paidSpaceRentalId}>
//               <tr>
//                 <td style={{ textAlign: 'center' }}>{rental.paidSpaceRentalId}</td>
//                 <td style={{ textAlign: 'center' }}>{rental.paidSpaceName}</td>
//                 <td style={{ textAlign: 'center' }}>{rental.paidSpaceRentalUnit}</td>
//                 <td style={{ textAlign: 'center' }}>{rental.paidSpaceRentalRenter}</td>
//                 <td style={{ textAlign: 'center' }}>
//                   <button style={{ backgroundColor: 'white', color: rental.paidSpaceRentalSuccess ? '#A4B6A4' : '#9B6A6A', border: '1px solid', borderColor: rental.paidSpaceRentalSuccess ? '#A4B6A4' : '#AF9797', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#E7ECEF'} onMouseLeave={(e) => e.target.style.backgroundColor = 'white'} onClick={() => toggleActivationStatus(rental)}>{rental.paidSpaceRentalSuccess ? '通過' : '未通過'}</button>
//                 </td>
//                 <td style={{ textAlign: 'center' }}>
//                   <button type='button' className='btn btn-sm me-2' style={{ color: '#486484', padding: '5px 10px', border: '1px solid #486484', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => toggleExpandRental(rental.paidSpaceRentalId)}>{expandedRentals[rental.paidSpaceRentalId] ? <i className="bi bi-caret-up"></i> : <i className="bi bi-caret-down"></i>}</button>
//                   <button type='button' className='btn btn-sm me-2' style={{ color: '#A4B6A4', padding: '5px 10px', border: '1px solid #A4B6A4', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => openRentalModal('edit', rental)}><i className="bi bi-feather"></i></button>
//                   <button type='button' className='btn btn-sm' style={{ color: '#9B6A6A', padding: '5px 10px', border: '1px solid #AF9797', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => deleteRental(rental.paidSpaceRentalId)}><i className="bi bi-trash3"></i></button>
//                 </td>
//               </tr>
//               {expandedRentals[rental.paidSpaceRentalId] && (
//                 <tr key={`expanded-${rental.paidSpaceRentalId}`}>
//                   <td colSpan="6" style={{ backgroundColor: '#F2F5F7' }}>
//                     <div className="row">
//                       <div className="col-md-4">
//                         <hr />
//                         <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>申請信息</h5>
//                         <hr />
//                         <p><strong>活動名稱：</strong>{rental.paidSpaceRentalReason}</p>
//                         <p><strong>使用人數：</strong>{rental.paidSpaceRentalUsers}</p>
//                         <p><strong>活動類型：</strong>
//                           {rental.paidSpaceRentalType === 1 && '1(學術用途)'}
//                           {rental.paidSpaceRentalType === 2 && '2(研究用途)'}
//                           {rental.paidSpaceRentalType === 3 && `3(其他: ${rental.paidSpaceRentalTypeOthers})`}
//                         </p>

//                         <p><strong>申請人：</strong>{rental.paidSpaceRentalRenter}</p>
//                         <p><strong>申請手機：</strong>{rental.paidSpaceRentalPhone}</p>
//                         <p><strong>申請郵件：</strong>{rental.paidSpaceRentalEmail}</p>
//                       </div>
  
//                       <div className="col-md-4">
//                         <hr />
//                         <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>時間信息</h5>
//                         <hr />
//                         <p><strong>申請時間：</strong>{rental.paidSpaceRentalDate}</p>
//                         <p><strong>申請起始時間：</strong>{rental.paidSpaceRentalDateTimeStart}</p>
//                         <p><strong>申請結束時間：</strong>{rental.paidSpaceRentalDateTimeEnd}</p>
//                         <p><strong>最遲繳費時間：</strong>{rental.paidSpaceRentalPayDate}</p>
//                         <p><strong>申請單建立時間：</strong>{new Date(rental.paidSpaceRentalCreatedAt).toLocaleString()}</p>
//                       </div>
  
//                       <div className="col-md-4">
//                         <hr />
//                         <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>費用信息</h5>
//                         <hr />
//                         <p><strong>場地費：</strong>{rental.paidSpaceRentalFeeSpace}</p>
//                         <p><strong>清潔費：</strong>{rental.paidSpaceRentalFeeClean}</p>
//                         <p><strong>保證金：</strong>{rental.paidSpaceRentalFeePermission}</p>
//                         <p><strong>場地費收費級別：</strong>{rental.paidSpaceRentalSpaceType}</p>
//                         <p><strong>是否與研發處合辦活動：</strong>{rental.paidSpaceRentalSpaceActivityType === 1 ? '是' : '否'}</p>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//       <Pagination pagination={pagination} changePage={changePage} />
//     </div>
//   );
  
  
  
// }

// export default AdminPaidSpaceRentals;
