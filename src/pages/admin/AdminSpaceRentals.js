import React, { useEffect, useRef, useState, useCallback, useContext  } from 'react';
import axios from "axios";
import SpaceRentalModal from "../../components/admin/SpaceRentalModal"; 
import DeleteModal from "../../components/DeleteModal"; 
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";
import ActionButtonsRentals from "../../components/admin/ActionButtonsRentals";
import { MessageContext, handleErrorMessage, handleSuccessMessage } from '../../store/messageStore';

function AdminSpaceRentals() { 
  const [, dispatch] = useContext(MessageContext);
  const [spaceRentals, setSpaceRentals] = useState([]); 
  const [pagination, setPagination] = useState({
    limit: 5, 
    offset: 0, 
    total: 0, 
    current_page: 1, 
    total_pages: 1
  });
  const [expandedRentals, setExpandedRentals] = useState({});
  const [type, setType] = useState('create');
  const [tempRental, setTempRental] = useState({});
  const [filterField, setFilterField] = useState(''); 
  const [filterValue, setFilterValue] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);

  const rentalModal = useRef(null);

  const getSpaceRentals = useCallback(async () => {
    try {
      const rentalRes = await axios.get(`http://localhost:8080/space_rentals`, {
        params: {
          limit: pagination.limit,
          offset: pagination.offset,
          [filterField]: filterValue 
        },
      });

      if (rentalRes.data && Array.isArray(rentalRes.data.results)) {
        const sortedRentals = rentalRes.data.results.sort((a, b) => a.spaceRentalId - b.spaceRentalId); 
        setSpaceRentals(sortedRentals);
        setPagination((prevPagination) => ({
          ...prevPagination, 
          total: rentalRes.data.total, 
          total_pages: Math.ceil(rentalRes.data.total / pagination.limit),
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

  const changePage = (newPage) => {
    setPagination((prevPagination) => ({
      ...prevPagination, 
      offset: (newPage - 1) * prevPagination.limit, 
      current_page: newPage
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
      ...prevExpandedRentals, 
      [rentalId]: !prevExpandedRentals[rentalId]
    }));
  };

  const toggleAllExpandRentals = (expand) => {
    const newExpandedRentals = {};
    spaceRentals.forEach((rental) => { 
      newExpandedRentals[rental.spaceRentalId] = expand; 
    });
    setExpandedRentals(newExpandedRentals);
  };

  const openRentalModal = (type, rental) => { 
    setType(type); 
    setTempRental(type === 'create' ? { ...rental, spaceRentalSuccess: 2 } : rental); 
    rentalModal.current.show(); 
  };

  const closeRentalModal = () => { 
    rentalModal.current.hide(); 
    getSpaceRentals(); // 在关闭模态框时刷新数据 
  };
  
  const toggleActivationStatus = (rental) => {
    setSelectedRental(rental);
    setShowStatusModal(true); // 顯示選擇對話框
  };

  const handleStatusChange = async (status) => {
    try {
        const updatedRental = {
            ...selectedRental,
            spaceRentalSuccess: status,
            spaceRentalDateStart: selectedRental.spaceRentalDateStart.replace(' ', 'T'),
            spaceRentalDateEnd: selectedRental.spaceRentalDateEnd.replace(' ', 'T')
        };

        await axios.put(`http://localhost:8080/space_rentals/${selectedRental.spaceRentalId}`, updatedRental);
        setSpaceRentals((prevRentals) =>
            prevRentals.map((r) =>
                r.spaceRentalId === selectedRental.spaceRentalId
                    ? { ...r, spaceRentalSuccess: updatedRental.spaceRentalSuccess }
                    : r
            )
        );
        setShowStatusModal(false);

        if (status === 1) {
            handleSuccessMessage(dispatch, '更新成功', "租借狀態更新成功，正在寄出【通過】信，需等待大約15秒左右");
            sendApprovalEmail(selectedRental);  // 寄出通過郵件 // 隨便變更
        } else if (status === 0) {
            handleSuccessMessage(dispatch, '更新成功', "租借狀態更新成功，正在寄出【未通過】信，需等待大約15秒左右");
            sendRejectionEmail(selectedRental);  // 寄出未通過郵件
        }
    } catch (error) {
        console.error("Error updating rental status:", error);
        handleErrorMessage(dispatch, '更新失敗', "租借狀態更新失敗");
    }
};

  
  const sendApprovalEmail = async (rentalData) => {
    const formattedStartDate = rentalData.spaceRentalDateStart.replace('T', ' ');
    const formattedEndDate = rentalData.spaceRentalDateEnd.replace('T', ' ');
    try {
      await axios.post('http://localhost:8080/sendEmail', {
        to: rentalData.spaceRentalEmail,
        subject: '租借申請通過',
        body: `
          <p>租借申請通過</p>
          <ul>
            <li><strong>申請場地：</strong> ${rentalData.freeSpaceName}</li>
            <li><strong>申請單位：</strong> ${rentalData.spaceRentalUnit}</li>
            <li><strong>申請開始日期：</strong> ${formattedStartDate}</li>
            <li><strong>申請結束日期：</strong> ${formattedEndDate}</li>
          </ul>
          <p>感謝您的申請</p>
        `
      });
      handleSuccessMessage(dispatch, '寄信成功', "租借申請通過郵件已寄出");
    } catch (error) {
      console.error('Failed to send email:', error);
      handleErrorMessage(dispatch, '更新失敗', "租借申請通過郵件發送失敗");
    }
  };
  
  const sendRejectionEmail = async (rentalData) => {
    const formattedStartDate = rentalData.spaceRentalDateStart.replace('T', ' ');
    const formattedEndDate = rentalData.spaceRentalDateEnd.replace('T', ' ');
    try {
        await axios.post('http://localhost:8080/sendEmail', {
            to: rentalData.spaceRentalEmail,
            subject: '租借申請未通過',
            body: `
                <p>您的租借申請未通過</p>
                <ul>
                    <li><strong>申請場地：</strong> ${rentalData.freeSpaceName}</li>
                    <li><strong>申請單位：</strong> ${rentalData.spaceRentalUnit}</li>
                    <li><strong>申請開始日期：</strong> ${formattedStartDate}</li>
                    <li><strong>申請結束日期：</strong> ${formattedEndDate}</li>
                </ul>
                <p>如有疑問，請與我們聯繫。</p>
            `
        });
        handleSuccessMessage(dispatch, '寄信成功', "租借申請未通過郵件已寄出，正在刪除該筆紀錄當中，等待15秒");
        setTimeout(() => handleDelete(rentalData.spaceRentalId), 5000); // 延遲兩秒後刪除紀錄
    } catch (error) {
        console.error('Failed to send rejection email:', error);
        handleErrorMessage(dispatch, '寄信失敗', "租借申請未通過郵件發送失敗");
    }
};


  // 刪除處理 - 開始
  const [selectedRentalId, setSelectedRentalId] = useState(null); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const openDeleteModal = (rentalId) => {
    setSelectedRentalId(rentalId);
    setShowDeleteModal(true);
  };
  
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedRentalId(null);
  };
  
  const handleDelete = async (rentalId) => {
    try {
      await axios.delete(`http://localhost:8080/space_rentals/${rentalId}`);
      setSpaceRentals((prevRentals) => prevRentals.filter(rental => rental.spaceRentalId !== rentalId));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting rental:", error);
    }
  };
  // 刪除處理 - 結束

  const spaceOptions = [
    { value: 'spaceRentalUnit', label: '申請單位' },
    { value: 'spaceRentalRenter', label: '申請人' },
    { value: 'spaceRentalEmail', label: '電子郵件' },
    { value: 'spaceRentalPhone', label: '聯絡電話' },
    { value: 'spaceRentalDateStart', label: '租借起始時間' },
    { value: 'spaceRentalDateEnd', label: '租借結束時間' },
    { value: 'spaceRentalReason', label: '申請理由' },
    { value: 'spaceRentalAgree', label: '申請者同意' },
    { value: 'spaceRentalSuccess', label: '是否通過' },
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

      {showDeleteModal && (
        <DeleteModal
          close={closeDeleteModal}
          text="確認刪除這一筆 免費空間紀錄?"
          handleDelete={handleDelete}
          id={selectedRentalId}
        />
      )}

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
                  <button 
                    style={{ 
                      backgroundColor: 'white', 
                      color: rental.spaceRentalSuccess === 1 ? '#A4B6A4' : (rental.spaceRentalSuccess === 0 ? '#9B6A6A' : '#CCCCCC'), 
                      border: '1px solid', 
                      borderColor: rental.spaceRentalSuccess === 1 ? '#A4B6A4' : (rental.spaceRentalSuccess === 0 ? '#AF9797' : '#CCCCCC'), 
                      padding: '5px 10px', 
                      borderRadius: '5px', 
                      cursor: 'pointer' 
                    }} 
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#E7ECEF'} 
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'} 
                    onClick={() => toggleActivationStatus(rental)}
                  >
                    {rental.spaceRentalSuccess === 1 ? '通過' : (rental.spaceRentalSuccess === 0 ? '未通過' : '未選擇')}
                  </button>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button type='button' className='btn btn-sm me-2' style={{ color: '#486484', padding: '5px 10px', border: '1px solid #486484', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => toggleExpandRental(rental.spaceRentalId)}>{expandedRentals[rental.spaceRentalId] ? <i className="bi bi-caret-up"></i> : <i className="bi bi-caret-down"></i>}</button>
                  <button type='button' className='btn btn-sm me-2' style={{ color: '#A4B6A4', padding: '5px 10px', border: '1px solid #A4B6A4', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => openRentalModal('edit', rental)}><i className="bi bi-feather"></i></button>
                  <button type='button' className='btn btn-sm' style={{ color: '#9B6A6A', padding: '5px 10px', border: '1px solid #AF9797', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => openDeleteModal(rental.spaceRentalId)}><i className="bi bi-trash3"></i></button>
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
                        <p><strong>租借起始時間：</strong>{new Date(rental.spaceRentalDateStart).toLocaleString()}</p>
                        <p><strong>租借結束時間：</strong>{new Date(rental.spaceRentalDateEnd).toLocaleString()}</p>
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


      {showStatusModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#AC6A6A' }}>
                <h5 className="modal-title text-white">更改狀態</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  aria-label="Close" 
                  onClick={() => setShowStatusModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <span className="me-5">請選擇要將狀態更改為    :  </span>
                <button 
                  className="btn btn-success me-5" 
                  style={{ backgroundColor: '#6A9E6A', color: 'white' }}
                  onClick={() => {
                    handleStatusChange(1);  // 顯示郵件提示
                    }}
                >
                  通過
                </button>
                <button 
                  className="btn btn-danger" 
                  style={{ backgroundColor: '#AC6A6A', color: 'white' }}
                  onClick={() => handleStatusChange(0)}
                >
                  未通過
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminSpaceRentals;


// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import axios from "axios";
// import SpaceRentalModal from "../../components/admin/SpaceRentalModal"; 
// import DeleteModal from "../../components/DeleteModal"; 
// import Pagination from "../../components/Pagination";
// import { Modal } from "bootstrap";
// import ActionButtonsRentals from "../../components/admin/ActionButtonsRentals";

// function AdminSpaceRentals() { 
//   const [spaceRentals, setSpaceRentals] = useState([]); 
//   const [pagination, setPagination] = useState({
//     limit: 5, 
//     offset: 0, 
//     total: 0, 
//     current_page: 1, 
//     total_pages: 1
//   });
//   const [expandedRentals, setExpandedRentals] = useState({});
//   const [type, setType] = useState('create');
//   const [tempRental, setTempRental] = useState({});
//   const [filterField, setFilterField] = useState(''); 
//   const [filterValue, setFilterValue] = useState('');

//   const rentalModal = useRef(null);

//   const getSpaceRentals = useCallback(async () => {
//     try {
//       const rentalRes = await axios.get(`http://localhost:8080/space_rentals`, {
//         params: {
//           limit: pagination.limit,
//           offset: pagination.offset,
//           [filterField]: filterValue 
//         },
//       });

//       if (rentalRes.data && Array.isArray(rentalRes.data.results)) {
//         const sortedRentals = rentalRes.data.results.sort((a, b) => a.spaceRentalId - b.spaceRentalId); 
//         setSpaceRentals(sortedRentals);
//         setPagination((prevPagination) => ({
//           ...prevPagination, 
//           total: rentalRes.data.total, 
//           total_pages: Math.ceil(rentalRes.data.total / pagination.limit),
//         }));      
//       } else {
//         setSpaceRentals([]);
//       }
//     } catch (error) {
//       console.error("Error fetching space rentals:", error);
//       setSpaceRentals([]);
//     }
//   }, [pagination.limit, pagination.offset, filterField, filterValue]);

//   useEffect(() => {
//     rentalModal.current = new Modal('#rentalModal', { backdrop: 'static' });
//     getSpaceRentals();
//   }, [getSpaceRentals]); 

//   const changePage = (newPage) => {
//     setPagination((prevPagination) => ({
//       ...prevPagination, 
//       offset: (newPage - 1) * prevPagination.limit, 
//       current_page: newPage
//     }));
//     getSpaceRentals();
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
//       ...prevExpandedRentals, 
//       [rentalId]: !prevExpandedRentals[rentalId]
//     }));
//   };

//   const toggleAllExpandRentals = (expand) => {
//     const newExpandedRentals = {};
//     spaceRentals.forEach((rental) => { 
//       newExpandedRentals[rental.spaceRentalId] = expand; 
//     });
//     setExpandedRentals(newExpandedRentals);
//   };

//   const openRentalModal = (type, rental) => { 
//     setType(type); 
//     setTempRental(rental); 
//     rentalModal.current.show(); 
//   };

//   const closeRentalModal = () => { 
//     rentalModal.current.hide(); 
//     getSpaceRentals(); // 在关闭模态框时刷新数据 
//   };
  
//   const toggleActivationStatus = async (rental) => {
//     try {
//         const updatedRental = {
//             ...rental,
//             spaceRentalSuccess: rental.spaceRentalSuccess ? 0 : 1,
//             spaceRentalDateStart: rental.spaceRentalDateStart.replace(' ', 'T'), // 確保符合預期格式
//             spaceRentalDateEnd: rental.spaceRentalDateEnd.replace(' ', 'T') // 確保符合預期格式
//         };

//         await axios.put(`http://localhost:8080/space_rentals/${rental.spaceRentalId}`, updatedRental);

//         setSpaceRentals((prevRentals) =>
//             prevRentals.map((r) =>
//                 r.spaceRentalId === rental.spaceRentalId
//                     ? { ...r, spaceRentalSuccess: updatedRental.spaceRentalSuccess }
//                     : r
//             )
//         );
//     } catch (error) {
//         console.error("Error updating rental status:", error);
//     }
// };


//   // 刪除處理 - 開始
//   const [selectedRentalId, setSelectedRentalId] = useState(null); 
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const openDeleteModal = (rentalId) => {
//     setSelectedRentalId(rentalId);
//     setShowDeleteModal(true);
//   };
  
//   const closeDeleteModal = () => {
//     setShowDeleteModal(false);
//     setSelectedRentalId(null);
//   };
  
//   const handleDelete = async (rentalId) => {
//     try {
//       await axios.delete(`http://localhost:8080/space_rentals/${rentalId}`);
//       setSpaceRentals((prevRentals) => prevRentals.filter(rental => rental.spaceRentalId !== rentalId));
//       closeDeleteModal();
//     } catch (error) {
//       console.error("Error deleting rental:", error);
//     }
//   };
//   // 刪除處理 - 結束

//   const spaceOptions = [
//     { value: 'spaceRentalUnit', label: '申請單位' },
//     { value: 'spaceRentalRenter', label: '申請人' },
//     { value: 'spaceRentalEmail', label: '電子郵件' },
//     { value: 'spaceRentalPhone', label: '聯絡電話' },
//     { value: 'spaceRentalDateStart', label: '租借起始時間' },
//     { value: 'spaceRentalDateEnd', label: '租借結束時間' },
//     { value: 'spaceRentalReason', label: '申請理由' },
//     { value: 'spaceRentalAgree', label: '申請者同意' },
//     { value: 'spaceRentalSuccess', label: '是否通過' },
//     { value: 'freeSpaceName', label: '空間名稱' }
//   ];

//   return (
//     <div className='p-3'>
//       <SpaceRentalModal closeRentalModal={closeRentalModal} getSpaceRentals={() => getSpaceRentals(pagination.current_page)} tempRental={tempRental} type={type} />
//       <div style={{ backgroundColor: '#D3E9FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0', width: '100%', position: 'relative' }}>
//         <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
//         <h3 style={{ textAlign: 'center', margin: '0' }}><i className="bi bi-chat-text me-2"></i> 免費空間紀錄</h3>
//         <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
//       </div>

//       {showDeleteModal && (
//         <DeleteModal
//           close={closeDeleteModal}
//           text="確認刪除這一筆 免費空間紀錄?"
//           handleDelete={handleDelete}
//           id={selectedRentalId}
//         />
//       )}

//       <div style={{ marginTop: '20px', marginBottom: '20px' }}>
//         <ActionButtonsRentals 
//           onCreateClick={() => openRentalModal('create', {})} 
//           onCollapseClick={() => toggleAllExpandRentals(false)} 
//           onSearchSubmit={handleSearchSubmit} 
//           onSelectChange={handleSelectChange}
//           options={spaceOptions}
//         />
//       </div>

//       <table className='table'>
//         <thead>
//           <tr>
//             <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF', width: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>編號</th>
//             <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>空間編號</th>
//             <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>申請單位</th>
//             <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>申請地點</th>
//             <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>狀態</th>
//             <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>編輯</th>
//           </tr>
//         </thead>

//         <tbody>
//           {spaceRentals.map((rental) => (
//             <React.Fragment key={rental.spaceRentalId}>
//               <tr>
//                 <td style={{ textAlign: 'center', width: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rental.spaceRentalId}</td>              
//                 <td style={{ textAlign: 'center' }}>{rental.freeSpaceId}</td>
//                 <td style={{ textAlign: 'center' }}>{rental.spaceRentalUnit}</td>
//                 <td style={{ textAlign: 'center' }}>{rental.freeSpaceName}</td> 
//                 <td style={{ textAlign: 'center' }}>
//                   <button style={{ backgroundColor: 'white', color: rental.spaceRentalSuccess ? '#A4B6A4' : '#9B6A6A', border: '1px solid', borderColor: rental.spaceRentalSuccess ? '#A4B6A4' : '#AF9797', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#E7ECEF'} onMouseLeave={(e) => e.target.style.backgroundColor = 'white'} onClick={() => toggleActivationStatus(rental)}>{rental.spaceRentalSuccess ? '通過' : '未通過'}</button>
//                 </td>
//                 <td style={{ textAlign: 'center' }}>
//                   <button type='button' className='btn btn-sm me-2' style={{ color: '#486484', padding: '5px 10px', border: '1px solid #486484', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => toggleExpandRental(rental.spaceRentalId)}>{expandedRentals[rental.spaceRentalId] ? <i className="bi bi-caret-up"></i> : <i className="bi bi-caret-down"></i>}</button>
//                   <button type='button' className='btn btn-sm me-2' style={{ color: '#A4B6A4', padding: '5px 10px', border: '1px solid #A4B6A4', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => openRentalModal('edit', rental)}><i className="bi bi-feather"></i></button>
//                   <button type='button' className='btn btn-sm' style={{ color: '#9B6A6A', padding: '5px 10px', border: '1px solid #AF9797', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => openDeleteModal(rental.spaceRentalId)}><i className="bi bi-trash3"></i></button>
//                 </td>
//               </tr>
  
//               {expandedRentals[rental.spaceRentalId] && (
//                 <tr key={`expanded-${rental.spaceRentalId}`}>
//                   <td colSpan="6" style={{ backgroundColor: '#F2F5F7' }}>
//                     <div className="row">
//                       <div className="col-md-6">
//                         <hr />
//                         <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>申請信息</h5>
//                         <hr />
//                         <p><strong>租借起始時間：</strong>{new Date(rental.spaceRentalDateStart).toLocaleString()}</p>
//                         <p><strong>租借結束時間：</strong>{new Date(rental.spaceRentalDateEnd).toLocaleString()}</p>
//                         <p><strong>創建時間：</strong>{new Date(rental.spaceRentalCreatedAt).toLocaleString()}</p>
//                         <p><strong>申請理由：</strong>{rental.spaceRentalReason}</p>
//                       </div>

//                       <div className="col-md-6">
//                         <hr />
//                         <h5 style={{ marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>聯絡資訊</h5>
//                         <hr />
//                         <p><strong>申請人：</strong>{rental.spaceRentalRenter}</p>
//                         <p><strong>聯絡電話：</strong>{rental.spaceRentalPhone}</p>
//                         <p><strong>電子郵件：</strong>{rental.spaceRentalEmail}</p>
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

// export default AdminSpaceRentals;
