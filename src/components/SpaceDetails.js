import { Button } from 'react-bootstrap';
import SpaceCarousel from './SpaceCarousel';

function SpaceDetails({ space, handleShowModal, handleShowPhotoModal }) {
  const textStyle = { fontSize: '17px', padding: '5px' };
  const btnStyle = {
    color: 'rgb(65, 90, 119)',
    backgroundColor: 'rgb(211, 233, 255)',
    borderColor: 'rgb(211, 233, 255)',
    fontWeight: 'bold',
  };

  const renderFeature = (label, value) => (
    <p className="card-text mb-2" style={textStyle}>
      <strong>{label}:</strong> {value}
    </p>
  );

  const renderIconFeature = (iconClass, label) => (
    <span className="me-4 d-flex align-items-center" style={textStyle}>
      <i className={iconClass} style={{ marginRight: '8px' }}></i>
      <strong>{label}</strong>
    </span>
  );

  return (
    <div className="col-12 mb-4">
      <div
        className="card border-0 shadow-sm position-relative"
        style={{ height: '350px', borderRadius: '15px', overflow: 'hidden' }}
      >
        <div className="row g-0 h-100">
          <div className="col-md-4 position-relative h-100" style={{ display: 'flex', flexDirection: 'column' }}>
            <SpaceCarousel
              spaceId={space.freeSpaceId}
              urls={[
                space.freeFloorPlanUrl,
                space.freeFloorSpaceUrl1,
                space.freeFloorSpaceUrl2,
                space.freeFloorSpaceUrl3,
              ]}
              altText={space.freeSpaceName}
              style={{ flex: 1, height: '100%', objectFit: 'cover' }} // 確保 SpaceCarousel 填滿容器
            />
          </div>
          <div className="col-md-8 position-relative h-100">
            <div className="card-body d-flex flex-column justify-content-between h-100 p-4">
              <div>
                <h4 className="card-title" style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '30px' }}>
                  {space.freeSpaceName}
                </h4>
                {renderFeature('位置', space.freeSpaceLocation)}
                {renderFeature('座位數', space.freeCapacity)}
                {renderFeature('設施', space.freeFacilities)}
                {renderFeature('概述', space.freeSpaceOverview)}

                <hr className="my-3" />

                <div className="d-flex align-items-center">
                  {space.freeInternetAvailable > 0 && renderIconFeature('bi bi-router', '網路')}
                  {space.freeAudioInputAvailable > 0 && renderIconFeature('bi bi-mic-fill', '聲音輸入')}
                  {space.freeVideoInputAvailable > 0 && renderIconFeature('bi bi-reception-3', '顯示訊號輸入')}
                </div>
              </div>
            </div>
            <div className="position-absolute top-0 end-0 m-3 d-flex justify-content-between" style={{ width: '200px' }}>
              <Button variant="info" onClick={() => handleShowPhotoModal(space)} style={btnStyle}>
                顯示設備
              </Button>

              <Button
                variant={space.freeIsActive ? 'success' : 'secondary'}
                onClick={() => space.freeIsActive && handleShowModal(space)}
                disabled={!space.freeIsActive}
                style={{
                  backgroundColor: '#415A77',
                  borderColor: '#415A77',
                  color: '#fff',
                  cursor: space.freeIsActive ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                }}
              >
                {space.freeIsActive ? '線上租借' : '暫不可租借'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpaceDetails;
