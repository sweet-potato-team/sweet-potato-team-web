import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import PaidSpaceRental from './PaidSpaceRental'; 
import PaidSpaceDetails from '../../components/PaidSpaceDetails';
import SpaceCarousel from '../../components/SpaceCarousel';
import ToggleSwitch from '../../components/ToggleSwitch'; 
import ReturnHomeButton from '../../components/ReturnHomeButton'; // 引入新的組件

function PaidSpaces() {
  const [paidSpaces, setPaidSpaces] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 5,
    offset: 0,
    total: 0,
    current_page: 1,
    total_pages: 1,
  });
  const [isLoading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false); 
  const [selectedPaidSpace, setSelectedPaidSpace] = useState(null);
  const [toggleView, setToggleView] = useState(false); 

  const handleShowModal = (paidSpace) => {
    setSelectedPaidSpace(paidSpace);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPaidSpace(null);
  };

  const handleShowPhotoModal = (paidSpace) => {
    setSelectedPaidSpace(paidSpace);
    setShowPhotoModal(true);
  };

  const handleClosePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedPaidSpace(null);
  };

  const getPaidSpaces = useCallback(async (page = 1) => {
    const newOffset = (page - 1) * pagination.limit;
    setLoading(true);
    try {
      const paidSpaceRes = await axios.get('http://localhost:8080/paid_spaces', {
        params: {
          limit: pagination.limit,
          offset: newOffset,
        },
      });

      console.log(paidSpaceRes.data);

      if (paidSpaceRes.data && Array.isArray(paidSpaceRes.data.results)) {
        setPaidSpaces(paidSpaceRes.data.results);
        setPagination((prev) => ({
          ...prev,
          offset: newOffset,
          total: paidSpaceRes.data.total,
          current_page: page,
          total_pages: Math.ceil(paidSpaceRes.data.total / pagination.limit),
        }));
      } else {
        setPaidSpaces([]);
      }
    } catch (error) {
      console.error('Error fetching paid spaces:', error);
      setPaidSpaces([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  useEffect(() => {
    getPaidSpaces(1);
  }, [getPaidSpaces]);

  return (
    <>
      <div className="container mt-md-5 mt-3 mb-7 full-height" style={{ position: 'relative', paddingTop: '50px' }}>
        <ReturnHomeButton /> {/* 使用新的組件 */}
        <div className="d-flex justify-content-center mb-4">
          <ToggleSwitch toggleView={toggleView} setToggleView={setToggleView} /> 
        </div>
        <Loading isLoading={isLoading} />
        <div className="row">
          {paidSpaces.length === 0 && <p>No paid spaces available.</p>}
          {paidSpaces.map((paidSpace, index) => (
            <PaidSpaceDetails
              key={`${paidSpace.paidSpaceId}-${index}`} 
              space={paidSpace}
              handleShowModal={handleShowModal}
              handleShowPhotoModal={handleShowPhotoModal}
            />
          ))}
        </div>
        <nav className="d-flex justify-content-center">
          <Pagination pagination={pagination} changePage={getPaidSpaces} />
        </nav>
      </div>

      {/* 線上租借模態框 */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>租借空間：{selectedPaidSpace && selectedPaidSpace.paidSpaceName}</Modal.Title> 
        </Modal.Header>
        <Modal.Body>
          {selectedPaidSpace && <PaidSpaceRental space={selectedPaidSpace} handleClose={handleCloseModal} />} 
        </Modal.Body>
      </Modal>

      {/* 顯示設備圖片模態框 */}
      <Modal show={showPhotoModal} onHide={handleClosePhotoModal} size="lg" centered>
        <Modal.Header closeButton />
        <Modal.Body>
          {selectedPaidSpace && (
            <SpaceCarousel
              spaceId={selectedPaidSpace.paidSpaceId} 
              urls={[
                selectedPaidSpace.paidItemPhotoUrl1,
                selectedPaidSpace.paidItemPhotoUrl2,
                selectedPaidSpace.paidItemPhotoUrl3,
                selectedPaidSpace.paidItemPhotoUrl4,
                selectedPaidSpace.paidItemPhotoUrl5,
              ]}
              altText={selectedPaidSpace.paidSpaceName}
              maxHeight="500px"
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PaidSpaces;