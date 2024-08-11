import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../store/messageStore';

function SpaceModal({ closeSpaceModal, getSpaces, type, tempSpace }) {
  const [tempData, setTempData] = useState({
    space_name: '',
    space_location: '',
    floor_plan_url: '',
    photo_url: '',
    capacity: 0,
    internet_available: false,
    audio_input_available: false,
    video_input_available: false,
    facilities: '',
    space_overview: '',
    is_active: true,
  });
  const [, dispatch] = useContext(MessageContext)

  useEffect(() => {
    if (type === 'create') {
      setTempData({
        space_name: '',
        space_location: '',
        floor_plan_url: '',
        photo_url: '',
        capacity: 0,
        internet_available: false,
        audio_input_available: false,
        video_input_available: false,
        facilities: '',
        space_overview: '',
        is_active: true,
      });
    } else if (type === 'edit') {
      setTempData(tempSpace);
    }
  }, [type, tempSpace]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (['capacity'].includes(name)) {
      setTempData({
        ...tempData,
        [name]: Number(value),
      });
    } else if (['internet_available', 'audio_input_available', 'video_input_available', 'is_active'].includes(name)) {
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
      if (type === 'edit') {
        api = `http://localhost:8080/spaces/${tempSpace.space_id}`;
        method = 'put';
      }
      const res = await axios[method](
        api,
        {
          data: tempData,
        },
      );
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
              { type === 'create' ? '建立新空間' : `編輯 ${tempData.space_name}`}
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
                  <label className='w-100' htmlFor='space_name'>
                    空間名稱
                    <input
                      type='text'
                      id='space_name'
                      name='space_name'
                      placeholder='請輸入空間名稱'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.space_name}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='space_location'>
                    空間位置
                    <input
                      type='text'
                      id='space_location'
                      name='space_location'
                      placeholder='請輸入空間位置'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.space_location}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='floor_plan_url'>
                    平面圖連結
                    <input
                      type='text'
                      id='floor_plan_url'
                      name='floor_plan_url'
                      placeholder='請輸入平面圖連結'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.floor_plan_url}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='photo_url'>
                    照片連結
                    <input
                      type='text'
                      id='photo_url'
                      name='photo_url'
                      placeholder='請輸入照片連結'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.photo_url}
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
                  <label className='w-100' htmlFor='space_overview'>
                    空間概述
                    <textarea
                      type='text'
                      id='space_overview'
                      name='space_overview'
                      placeholder='請輸入空間概述'
                      className='form-control'
                      onChange={handleChange}
                      value={tempData.space_overview}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <div className='form-check'>
                    <label
                      className='form-check-label'
                      htmlFor='internet_available'
                    >
                      是否提供網路
                      <input
                        type='checkbox'
                        id='internet_available'
                        name='internet_available'
                        className='form-check-input'
                        onChange={handleChange}
                        checked={tempData.internet_available}
                      />
                    </label>
                  </div>
                </div>
                <div className='form-group mb-2'>
                  <div className='form-check'>
                    <label
                      className='form-check-label'
                      htmlFor='audio_input_available'
                    >
                      是否提供聲音輸入
                      <input
                        type='checkbox'
                        id='audio_input_available'
                        name='audio_input_available'
                        className='form-check-input'
                        onChange={handleChange}
                        checked={tempData.audio_input_available}
                      />
                    </label>
                  </div>
                </div>
                <div className='form-group mb-2'>
                  <div className='form-check'>
                    <label
                      className='form-check-label'
                      htmlFor='video_input_available'
                    >
                      是否提供顯示訊號輸入
                      <input
                        type='checkbox'
                        id='video_input_available'
                        name='video_input_available'
                        className='form-check-input'
                        onChange={handleChange}
                        checked={tempData.video_input_available}
                      />
                    </label>
                  </div>
                </div>
                <div className='form-group mb-2'>
                  <div className='form-check'>
                    <label
                      className='form-check-label'
                      htmlFor='is_active'
                    >
                      是否啟用
                      <input
                        type='checkbox'
                        id='is_active'
                        name='is_active'
                        className='form-check-input'
                        onChange={handleChange}
                        checked={tempData.is_active}
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
