import { useEffect, useState, useContext } from 'react';
import axios from "axios";
import SpaceRentalModal from "../../components/SpaceRentalModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "react-bootstrap";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../../store/messageStore';

function AdminSpaceRentals() {
  const [rentals, setRentals] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 5,
    offset: 0,
    total: 0,
    current_page: 1,
    total_pages: 1
  });
  const [type, setType] = useState('create');
  const [tempRental, setTempRental] = useState({});
  const [, dispatch] = useContext(MessageContext);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    getRentals();
  }, []);

  const getRentals = async (page = 1) => {
    const newOffset = (page - 1) * pagination.limit;
    try {
      const rentalRes = await axios.get(`http://localhost:8080/space_rentals`, {
        params: {
          limit: pagination.limit,
          offset: newOffset,
        },
      });
      if (rentalRes.data && Array.isArray(rentalRes.data.results)) {
        setRentals(rentalRes.data.results);
        setPagination({
          ...pagination,
          offset: newOffset,
          total: rentalRes.data.total,
          current_page: page,
          total_pages: Math.ceil(rentalRes.data.total / pagination.limit),
        });
      } else {
        setRentals([]);
      }
    } catch (error) {
      console.error("Error fetching rentals:", error);
      setRentals([]);
    }
  }

  const openRentalModal = (type, rental) => {
    console.log('Opening modal with type:', type);
    console.log('Opening modal with rental:', rental);
    setType(type);
    setTempRental(rental || {}); // 確保 rental 為空時賦值為空物件
    setShowRentalModal(true);
  }

  const closeRentalModal = () => {
    setShowRentalModal(false);
  }

  const openDeleteModal = (rental) => {
    setTempRental(rental);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const deleteRental = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8080/space_rentals/${id}`);
      if (res.data.success) {
        getRentals(pagination.current_page);
        handleSuccessMessage(dispatch, res);
        closeDeleteModal();
      }
    } catch (error) {
      console.log(error);
      handleErrorMessage(dispatch, error);
    }
  }

  const changePage = (newPage) => {
    getRentals(newPage);
  }

  return (
    <div className='p-3'>
      <Modal show={showRentalModal} onHide={closeRentalModal}>
        <SpaceRentalModal
          closeSpaceRentalModal={closeRentalModal}
          getSpaceRentals={() => getRentals(pagination.current_page)}
          tempRental={tempRental}
          type={type}
        />
      </Modal>

      <Modal show={showDeleteModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>刪除租借記錄</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          確定要刪除 {tempRental.rentalUnit} 的租借記錄嗎？
        </Modal.Body>
        <Modal.Footer>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={closeDeleteModal}
          >
            取消
          </button>
          <button
            type='button'
            className='btn btn-danger'
            onClick={() => deleteRental(tempRental.spaceRentalId)}
          >
            刪除
          </button>
        </Modal.Footer>
      </Modal>

      <h3>租借記錄列表</h3>
      <hr />
      <div className='text-end'>
        <button
          type='button'
          className='btn btn-primary btn-sm'
          style={{ backgroundColor: '#6789bb' }}
          onClick={() => openRentalModal('create', {})}
        >
          建立新租借記錄
        </button>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>申請單位</th>
            <th scope='col'>場地名稱</th>
            <th scope='col'>租借日期與時間</th>
            <th scope='col'>聯絡電話</th>
            <th scope='col'>電子郵件</th>
            <th scope='col'>租借事由</th>
            <th scope='col'>借用人</th>
            <th scope='col'>編輯</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental) => (
            <tr key={rental.spaceRentalId}>
              <td>{rental.spaceRentalUnit}</td>
              <td>{rental.spaceRentalLocation}</td>
              <td>{rental.spaceRentalDateTime}</td>
              <td>{rental.spaceRentalPhone}</td>
              <td>{rental.spaceRentalEmail}</td>
              <td>{rental.spaceRentalReason}</td>
              <td>{rental.spaceRentalRenter}</td>
              <td>
                <button
                  type='button'
                  className='btn btn-primary btn-sm'
                  style={{ backgroundColor: '#6789bb' }}
                  onClick={() => openRentalModal('edit', rental)}
                >
                  編輯
                </button>
                <button
                  type='button'
                  className='btn btn-outline-danger btn-sm ms-2'
                  onClick={() => openDeleteModal(rental)}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={changePage} />
    </div>
  );
}

export default AdminSpaceRentals;
