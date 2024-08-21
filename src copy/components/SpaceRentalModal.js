import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../store/messageStore';

function SpaceRentalModal({ closeSpaceRentalModal, getSpaceRentals, type, tempRental }) {
  const [tempData, setTempData] = useState({
    spaceRentalUnit: '',
    spaceRentalLocation: '',
    spaceRentalDateTime: '',
    spaceRentalPhone: '',
    spaceRentalEmail: '',
    spaceRentalReason: '',
    spaceRentalRenter: ''
  });
  const [, dispatch] = useContext(MessageContext);

  useEffect(() => {
    console.log('Effect triggered. Type:', type, 'tempRental:', tempRental);
    if (type === 'edit' && tempRental && Object.keys(tempRental).length > 0) {
      console.log('Setting tempData:', tempRental);
      setTempData(tempRental);
    } else if (type === 'create') {
      console.log('Creating new rental');
      setTempData({
        spaceRentalUnit: '',
        spaceRentalLocation: '',
        spaceRentalDateTime: '',
        spaceRentalPhone: '',
        spaceRentalEmail: '',
        spaceRentalReason: '',
        spaceRentalRenter: ''
      });
    }
  }, [type, tempRental]);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setTempData({
      ...tempData,
      [name]: value,
    });
  };

  const submit = async () => {
    try {
      let api = `http://localhost:8080/space_rentals`;
      let method = 'post';
      let payload = { ...tempData }; // 複製 tempData，避免修改原對象
  
      // 如果是編輯模式，更新 API URL 並移除 rentalId
      if (type === 'edit' && tempRental.spaceRentalId) {
        api = `http://localhost:8080/space_rentals/${tempRental.spaceRentalId}`;
        method = 'put';
        delete payload.spaceRentalId; // 從數據中移除 rentalId
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
      closeSpaceRentalModal();
      getSpaceRentals();
    } catch (error) {
      console.log(error);
      handleErrorMessage(dispatch, error);
    }
  };
  

  return (
    <>
      <div className='modal-header'>
        <h1 className='modal-title fs-5'>
          { type === 'create' ? '建立新租借記錄' : `編輯租借記錄：${tempData.spaceRentalUnit}`}
        </h1>
        <button
          type='button'
          className='btn-close'
          aria-label='Close'
          onClick={closeSpaceRentalModal}
        />
      </div>
      <div className='modal-body'>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='form-group mb-2'>
              <label className='w-100' htmlFor='spaceRentalUnit'>
                申請單位
                <input
                  type='text'
                  id='spaceRentalUnit'
                  name='spaceRentalUnit'
                  placeholder='請輸入申請單位名稱'
                  className='form-control'
                  onChange={handleChange}
                  value={tempData.spaceRentalUnit || ''}
                />
              </label>
            </div>
            <div className='form-group mb-2'>
              <label className='w-100' htmlFor='spaceRentalLocation'>
                場地名稱
                <input
                  type='text'
                  id='spaceRentalLocation'
                  name='spaceRentalLocation'
                  placeholder='請輸入場地名稱'
                  className='form-control'
                  onChange={handleChange}
                  value={tempData.spaceRentalLocation || ''}
                />
              </label>
            </div>
            <div className='form-group mb-2'>
              <label className='w-100' htmlFor='spaceRentalDateTime'>
                租借日期與時間
                <input
                  type='text'
                  id='spaceRentalDateTime'
                  name='spaceRentalDateTime'
                  placeholder='請輸入租借日期與時間'
                  className='form-control'
                  onChange={handleChange}
                  value={tempData.spaceRentalDateTime || ''}
                />
              </label>
            </div>
            <div className='form-group mb-2'>
              <label className='w-100' htmlFor='spaceRentalPhone'>
                聯絡電話
                <input
                  type='text'
                  id='spaceRentalPhone'
                  name='spaceRentalPhone'
                  placeholder='請輸入聯絡電話'
                  className='form-control'
                  onChange={handleChange}
                  value={tempData.spaceRentalPhone || ''}
                />
              </label>
            </div>
          </div>
          <div className='col-sm-6'>
            <div className='form-group mb-2'>
              <label className='w-100' htmlFor='spaceRentalEmail'>
                電子郵件
                <input
                  type='email'
                  id='spaceRentalEmail'
                  name='spaceRentalEmail'
                  placeholder='請輸入電子郵件'
                  className='form-control'
                  onChange={handleChange}
                  value={tempData.spaceRentalEmail || ''}
                />
              </label>
            </div>
            <div className='form-group mb-2'>
              <label className='w-100' htmlFor='spaceRentalReason'>
                租借事由
                <textarea
                  id='spaceRentalReason'
                  name='spaceRentalReason'
                  placeholder='請輸入租借事由'
                  className='form-control'
                  onChange={handleChange}
                  value={tempData.spaceRentalReason || ''}
                />
              </label>
            </div>
            <div className='form-group mb-2'>
              <label className='w-100' htmlFor='spaceRentalRenter'>
                借用人
                <input
                  type='text'
                  id='spaceRentalRenter'
                  name='spaceRentalRenter'
                  placeholder='請輸入借用人名稱'
                  className='form-control'
                  onChange={handleChange}
                  value={tempData.spaceRentalRenter || ''}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className='modal-footer'>
        <button
          type='button'
          className='btn btn-secondary'
          onClick={closeSpaceRentalModal}
        >
          關閉
        </button>
        <button type='button' className='btn btn-primary' onClick={submit}>
          儲存
        </button>
      </div>
    </>
  );
}

export default SpaceRentalModal;
