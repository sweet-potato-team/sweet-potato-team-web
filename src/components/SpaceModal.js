import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../store/messageStore';

function SpaceModal({ closeSpaceModal, getSpaces, type, tempSpace }) {
  const [tempData, setTempData] = useState({
    spaceName: '',
    spaceLocation: '',
    floorPlanUrl: '',
    photoUrl: '',
    capacity: 0,
    internetAvailable: false,
    audioInputAvailable: false,
    videoInputAvailable: false,
    facilities: '',
    spaceOverview: '',
    isActive: true
  });
  const [, dispatch] = useContext(MessageContext)

  useEffect(() => {
    if (type === 'create') {
      setTempData({
        spaceName: '',
        spaceLocation: '',
        floorPlanUrl: '',
        photoUrl: '',
        capacity: 0,
        internetAvailable: false,
        audioInputAvailable: false,
        videoInputAvailable: false,
        facilities: '',
        spaceOverview: '',
        isActive: true,
      });
    } else if (type === 'edit') {
      setTempData(tempSpace);
    }
  }, [type, tempSpace]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (name === 'capacity') {
      setTempData({
        ...tempData,
        [name]: Number(value),
      });
    } else if (['internetAvailable', 'audioInputAvailable', 'videoInputAvailable', 'isActive'].includes(name)) {
      setTempData({
        ...tempData,
        [name]: e.target.checked,
      });
    } else {
      setTempData({
        ...tempData,
        [name]: value,
      });
    }
  };

  const submit = async () => {
    try {
      let api = `http://localhost:8080/spaces`;
      let method = 'post';
      let payload = { ...tempData }; // 複製 tempData，避免修改原對象

      // if (type === 'edit') {
      //   api = `http://localhost:8080/spaces/${tempSpace.spaceId}`;
      //   method = 'put';
      // }
      // console.log(tempData);

      // 如果是編輯模式，更新 API URL 並移除 spaceId
      if (type === 'edit' && tempData.spaceId) {
        api = `http://localhost:8080/spaces/${tempData.spaceId}`;
        method = 'put';
        delete payload.spaceId; // 從數據中移除 spaceId
      }
      console.log("Submitting data:", payload); // 打印提交的數據

      const res = await axios({
        method: method,
        url: api,
        headers: {
          'Content-Type': 'application/json', // 確保Content-Type正確
        },
        data: payload, // 直接傳遞payload
      });
      console.log(res);
      handleSuccessMessage(dispatch, res);
      closeSpaceModal();
      getSpaces();
    } catch (error) {
      console.log(error);
      handleErrorMessage(dispatch, error);
    }
  };

  return (
    <div
      className='modal fade'
      tabIndex='-1'
      id='spaceModal'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5' id='exampleModalLabel'>
              { type === 'create' ? '建立新空間' : `編輯 ${tempData.spaceName}`}
            </h1>
            <button
              type='button'
              className='btn-close'
              aria-label='Close'
              onClick={closeSpaceModal}
            />
          </div>
          <div className='modal-body'>
            <div className='row'>
              <div className='col-sm-6'>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='spaceName'>
                    空間名稱
                    <input
                      type='text'
                      id='spaceName'
                      name='spaceName'
                      placeholder='請輸入空間名稱'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.spaceName}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='spaceLocation'>
                    空間位置
                    <input
                      type='text'
                      id='spaceLocation'
                      name='spaceLocation'
                      placeholder='請輸入空間位置'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.spaceLocation}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='floorPlanUrl'>
                    平面圖連結
                    <input
                      type='text'
                      id='floorPlanUrl'
                      name='floorPlanUrl'
                      placeholder='請輸入平面圖連結'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.floorPlanUrl}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='photoUrl'>
                    照片連結
                    <input
                      type='text'
                      id='photoUrl'
                      name='photoUrl'
                      placeholder='請輸入照片連結'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.photoUrl}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='capacity'>
                    容納人數
                    <input
                      type='number'
                      id='capacity'
                      name='capacity'
                      placeholder='請輸入容納人數'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.capacity}
                    />
                  </label>
                </div>
              </div>
              <div className='col-sm-6'>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='facilities'>
                    設施描述
                    <textarea
                      type='text'
                      id='facilities'
                      name='facilities'
                      placeholder='請輸入設施描述'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.facilities}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='spaceOverview'>
                    空間概述
                    <textarea
                      type='text'
                      id='spaceOverview'
                      name='spaceOverview'
                      placeholder='請輸入空間概述'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.spaceOverview}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <div className='form-check'>
                    <label
                      className='form-check-label'
                      htmlFor='internetAvailable'
                    >
                      是否提供網路
                      <input
                        type='checkbox'
                        id='internetAvailable'
                        name='internetAvailable'
                        className='form-check-input'
                        onChange={handleChange}
                        checked={tempData.internetAvailable}
                      />
                    </label>
                  </div>
                </div>
                <div className='form-group mb-2'>
                  <div className='form-check'>
                    <label
                      className='form-check-label'
                      htmlFor='audioInputAvailable'
                    >
                      是否提供聲音輸入
                      <input
                        type='checkbox'
                        id='audioInputAvailable'
                        name='audioInputAvailable'
                        className='form-check-input'
                        onChange={handleChange}
                        checked={tempData.audioInputAvailable}
                      />
                    </label>
                  </div>
                </div>
                <div className='form-group mb-2'>
                  <div className='form-check'>
                    <label
                      className='form-check-label'
                      htmlFor='videoInputAvailable'
                    >
                      是否提供顯示訊號輸入
                      <input
                        type='checkbox'
                        id='videoInputAvailable'
                        name='videoInputAvailable'
                        className='form-check-input'
                        onChange={handleChange}
                        checked={tempData.videoInputAvailable}
                      />
                    </label>
                  </div>
                </div>
                <div className='form-group mb-2'>
                  <div className='form-check'>
                    <label
                      className='form-check-label'
                      htmlFor='isActive'
                    >
                      是否啟用
                      <input
                        type='checkbox'
                        id='isActive'
                        name='isActive'
                        className='form-check-input'
                        onChange={handleChange}
                        checked={tempData.isActive}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={closeSpaceModal}
            >
              關閉
            </button>
            <button type='button' className='btn btn-primary' onClick={submit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpaceModal;
