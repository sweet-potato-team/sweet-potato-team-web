import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Modal, Button, Carousel } from 'react-bootstrap';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import SpaceRental from './SpaceRental'; // 引入四步驟的租借流程組件

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
  const [showPhotoModal, setShowPhotoModal] = useState(false); // 新增狀態以控制設備顯示的模態框
  const [selectedSpace, setSelectedSpace] = useState(null); // 用於存儲選中的空間

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
          {spaces.map((space) => {
            return (
              <div className="col-12 mb-4" key={space.spaceId}>
                <div className="card border-0 shadow-sm position-relative">
                  <div className="row g-0">
                    <div className="col-md-4 position-relative">
                      <Carousel indicators={false}>
                        <Carousel.Item>
                          <img
                            src={space.photoUrl}
                            className="d-block w-100"
                            style={{ objectFit: 'cover', maxHeight: '300px' }}
                            alt={space.spaceName}
                          />
                        </Carousel.Item>
                        <Carousel.Item>
                          <img
                            src={space.floorPlanUrl}
                            className="d-block w-100"
                            style={{ objectFit: 'cover', maxHeight: '300px' }}
                            alt={space.spaceName}
                          />
                        </Carousel.Item>
                      </Carousel>
                    </div>
                    <div className="col-md-8 position-relative">
                      <div className="card-body">
                        <h4 className="card-title" style={{ fontWeight: 'bold' }}>{space.spaceName}</h4>
                        <p className="card-text">位置: {space.spaceLocation}</p>
                        <p className="card-text">座位數: {space.capacity}</p>
                        <p className="card-text">網路: {space.internetAvailable ? '有線網路' : '無線網路'}</p>
                        <p className="card-text">聲音輸入: {space.audioInputAvailable ? '有' : '無'}</p>
                        <p className="card-text">顯示訊號輸入: {space.videoInputAvailable ? 'VGA, HDMI' : '無'}</p>
                        <p className="card-text">設施: {space.facilities}</p>
                        <p className="card-text">概述: {space.spaceOverview}</p>
                      </div>
                      <div className="position-absolute top-0 end-0 m-3 d-flex justify-content-between" style={{ width: '200px' }}>
                        <Button
                          variant="info"
                          onClick={() => handleShowPhotoModal(space)} // 點擊後顯示設備圖片的模態框
                        >
                          顯示設備
                        </Button>
                        <Button
                          variant={space.isActive ? 'success' : 'secondary'}
                          onClick={() => space.isActive && handleShowModal(space)} // 點擊後顯示租借的模態框
                          disabled={!space.isActive}
                        >
                          {space.isActive ? '線上租借' : '暫不可租借'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <nav className="d-flex justify-content-center">
          <Pagination pagination={pagination} changePage={getSpaces} />
        </nav>
      </div>

      {/* 線上租借模態框 */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>租借空間：{selectedSpace && selectedSpace.spaceName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSpace && <SpaceRental space={selectedSpace} handleClose={handleCloseModal} />} {/* 傳遞 handleCloseModal 到 SpaceRental */}
        </Modal.Body>
      </Modal>

      {/* 顯示設備圖片模態框 */}
      <Modal show={showPhotoModal} onHide={handleClosePhotoModal} size="lg" centered>
        <Modal.Header closeButton />
        <Modal.Body>
          {selectedSpace && (
            <img
              src={selectedSpace.photoUrl}
              className="d-block w-100"
              style={{ objectFit: 'cover', maxHeight: '500px' }}
              alt={selectedSpace.spaceName}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Spaces;
