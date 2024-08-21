import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import SpaceRental from './SpaceRental'; 
import SpaceDetails from '../../components/SpaceDetails';
import SpaceCarousel from '../../components/SpaceCarousel';

function Spaces() {
  const [spaces, setSpaces] = useState([]);
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
  const [selectedSpace, setSelectedSpace] = useState(null); 

  const handleShowModal = (space) => {
    setSelectedSpace(space);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSpace(null);
  };

  const handleShowPhotoModal = (space) => {
    setSelectedSpace(space);
    setShowPhotoModal(true);
  };

  const handleClosePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedSpace(null);
  };

  const getSpaces = useCallback(async (page = 1) => {
    const newOffset = (page - 1) * pagination.limit;
    setLoading(true);
    try {
      const spaceRes = await axios.get('http://localhost:8080/spaces', {
        params: {
          limit: pagination.limit,
          offset: newOffset,
        },
      });

      console.log(spaceRes.data);

      if (spaceRes.data && Array.isArray(spaceRes.data.results)) {
        setSpaces(spaceRes.data.results);
        setPagination((prev) => ({
          ...prev,
          offset: newOffset,
          total: spaceRes.data.total,
          current_page: page,
          total_pages: Math.ceil(spaceRes.data.total / pagination.limit),
        }));
      } else {
        setSpaces([]);
      }
    } catch (error) {
      console.error('Error fetching spaces:', error);
      setSpaces([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  useEffect(() => {
    getSpaces(1);
  }, [getSpaces]);

  return (
    <>
      <div className="container mt-md-5 mt-3 mb-7 full-height">
        <Loading isLoading={isLoading} />
        <div className="row">
          {spaces.length === 0 && <p>No spaces available.</p>}
          {spaces.map((space, index) => (
            <SpaceDetails
              key={`${space.freeSpaceId}-${index}`} // 確保 key 的一致性
              space={space}
              handleShowModal={handleShowModal}
              handleShowPhotoModal={handleShowPhotoModal}
            />
          ))}
        </div>
        <nav className="d-flex justify-content-center">
          <Pagination pagination={pagination} changePage={getSpaces} />
        </nav>
      </div>

      {/* 線上租借模態框 */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>租借空間：{selectedSpace && selectedSpace.freeSpaceName}</Modal.Title> {/* 確保 selectedSpace 的一致性 */}
        </Modal.Header>
        <Modal.Body>
          {selectedSpace && <SpaceRental space={selectedSpace} handleClose={handleCloseModal} />} 
        </Modal.Body>
      </Modal>

      {/* 顯示設備圖片模態框 */}
      <Modal show={showPhotoModal} onHide={handleClosePhotoModal} size="lg" centered>
        <Modal.Header closeButton />
        <Modal.Body>
          {selectedSpace && (
            <SpaceCarousel
              spaceId={selectedSpace.freeSpaceId}  // 確保 spaceId 的一致性
              urls={[
                selectedSpace.freeItemPhotoUrl1,
                selectedSpace.freeItemPhotoUrl2,
                selectedSpace.freeItemPhotoUrl3,
                selectedSpace.freeItemPhotoUrl4,
                selectedSpace.freeItemPhotoUrl5,
              ]}
              altText={selectedSpace.freeSpaceName}
              maxHeight="500px"
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Spaces;
