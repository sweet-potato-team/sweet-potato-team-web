// SpaceDetails.js
import { Button } from 'react-bootstrap';
import SpaceCarousel from './SpaceCarousel';

function SpaceDetails({ space, handleShowModal, handleShowPhotoModal }) {
    console.log('SpaceDetails received:', space); // 檢查 space 資料
    return (
      <div className="col-12 mb-4">
        <div className="card border-0 shadow-sm position-relative">
          <div className="row g-0">
            <div className="col-md-4 position-relative">
              <SpaceCarousel
                spaceId={space.freeSpaceId}  // 檢查名稱是否正確
                urls={[
                  space.freeFloorPlanUrl,
                  space.freeFloorSpaceUrl1,   // 確保這些屬性名稱與後端一致
                  space.freeFloorSpaceUrl2,
                  space.freeFloorSpaceUrl3
                ]}
                altText={space.freeSpaceName}
              />
            </div>
            <div className="col-md-8 position-relative">
              <div className="card-body">
                <h4 className="card-title" style={{ fontWeight: 'bold' }}>{space.freeSpaceName}</h4>
                <p className="card-text">位置: {space.freeSpaceLocation}</p>
                <p className="card-text">座位數: {space.freeCapacity}</p>
                <p className="card-text">網路: {space.freeInternetAvailable ? '有' : '無'}</p>
                <p className="card-text">聲音輸入: {space.freeAudioInputAvailable ? '有' : '無'}</p>
                <p className="card-text">顯示訊號輸入: {space.freeVideoInputAvailable ? '有' : '無'}</p>
                <p className="card-text">設施: {space.freeFacilities}</p>
                <p className="card-text">概述: {space.freeSpaceOverview}</p>
              </div>
              <div className="position-absolute top-0 end-0 m-3 d-flex justify-content-between" style={{ width: '200px' }}>
                <Button
                  variant="info"
                  onClick={() => handleShowPhotoModal(space)} // 點擊後顯示設備圖片的模態框
                >
                  顯示設備
                </Button>
                <Button
                  variant={space.freeIsActive ? 'success' : 'secondary'}
                  onClick={() => space.freeIsActive && handleShowModal(space)} // 點擊後顯示租借的模態框
                  disabled={!space.freeIsActive}
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
