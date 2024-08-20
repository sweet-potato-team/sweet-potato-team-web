import axios from "axios";
import { useContext, useEffect, useState, useMemo } from "react";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../store/messageStore';

function PaidSpaceModal({ closePaidSpaceModal, getSpaces, type, tempSpace }) {
  const initialData = useMemo(() => ({
    paid_space_name: '',
    paid_space_location: '',
    paid_floor_plan_url: '',
    paid_floor_space_url_1: '',
    paid_floor_space_url_2: '',
    paid_floor_space_url_3: '',
    paid_item_photo_url_1: '',
    paid_item_photo_url_2: '',
    paid_item_photo_url_3: '',
    paid_item_photo_url_4: '',
    paid_item_photo_url_5: '',
    paid_capacity: 0,
    paid_internet_available: 0,
    paid_audio_input_available: 0,
    paid_video_input_available: 0,
    paid_facilities: '',
    paid_space_overview: '',
    paid_is_active: 1,
    paid_charges_url: ''
  }), []);
  
  const [tempData, setTempData] = useState(initialData);
  const [modifiedFields, setModifiedFields] = useState({});

  const [, dispatch] = useContext(MessageContext);

  useEffect(() => {
    if (type === 'edit' && tempSpace) {
      setTempData({
        paid_space_name: tempSpace.paidSpaceName || '',
        paid_space_location: tempSpace.paidSpaceLocation || '',
        paid_floor_plan_url: tempSpace.paidFloorPlanUrl || '',
        paid_floor_space_url_1: tempSpace.paidFloorSpaceUrl1 || '',
        paid_floor_space_url_2: tempSpace.paidFloorSpaceUrl2 || '',
        paid_floor_space_url_3: tempSpace.paidFloorSpaceUrl3 || '',
        paid_item_photo_url_1: tempSpace.paidItemPhotoUrl1 || '',
        paid_item_photo_url_2: tempSpace.paidItemPhotoUrl2 || '',
        paid_item_photo_url_3: tempSpace.paidItemPhotoUrl3 || '',
        paid_item_photo_url_4: tempSpace.paidItemPhotoUrl4 || '',
        paid_item_photo_url_5: tempSpace.paidItemPhotoUrl5 || '',
        paid_capacity: tempSpace.paidCapacity || 0,
        paid_internet_available: tempSpace.paidInternetAvailable === 1,
        paid_audio_input_available: tempSpace.paidAudioInputAvailable === 1,
        paid_video_input_available: tempSpace.paidVideoInputAvailable === 1,
        paid_facilities: tempSpace.paidFacilities || '',
        paid_space_overview: tempSpace.paidSpaceOverview || '',
        paid_is_active: tempSpace.paidIsActive === 1,
        paid_charges_url: tempSpace.paidChargesUrl || ''
      });
      setModifiedFields({});
    } else {
      setTempData(initialData);
      setModifiedFields({});
    }
  }, [type, tempSpace, initialData]);
  
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setTempData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setModifiedFields((prevFields) => ({
      ...prevFields,
      [name]: true,
    }));
  };

  const submit = async () => {
    try {
      let payload = {
        paidSpaceName: tempData.paid_space_name,
        paidSpaceLocation: tempData.paid_space_location,
        paidFloorPlanUrl: tempData.paid_floor_plan_url,
        paidFloorSpaceUrl1: tempData.paid_floor_space_url_1,
        paidFloorSpaceUrl2: tempData.paid_floor_space_url_2,
        paidFloorSpaceUrl3: tempData.paid_floor_space_url_3,
        paidItemPhotoUrl1: tempData.paid_item_photo_url_1,
        paidItemPhotoUrl2: tempData.paid_item_photo_url_2,
        paidItemPhotoUrl3: tempData.paid_item_photo_url_3,
        paidItemPhotoUrl4: tempData.paid_item_photo_url_4,
        paidItemPhotoUrl5: tempData.paid_item_photo_url_5,
        paidCapacity: tempData.paid_capacity,
        paidInternetAvailable: tempData.paid_internet_available ? 1 : 0,
        paidAudioInputAvailable: tempData.paid_audio_input_available ? 1 : 0,
        paidVideoInputAvailable: tempData.paid_video_input_available ? 1 : 0,
        paidFacilities: tempData.paid_facilities,
        paidSpaceOverview: tempData.paid_space_overview,
        paidIsActive: tempData.paid_is_active ? 1 : 0,
        paidChargesUrl: tempData.paid_charges_url
      };
  
      console.log('Payload:', payload);
  
      let api = `http://localhost:8080/paid_spaces`;
      let method = 'post';
  
      if (type === 'edit' && tempSpace.paidSpaceId) {
        api = `http://localhost:8080/paid_spaces/${tempSpace.paidSpaceId}`;
        method = 'put';
      }
  
      const res = await axios({
        method: method,
        url: api,
        headers: {
          'Content-Type': 'application/json',
        },
        data: payload,
      });
  
      handleSuccessMessage(dispatch, res);
      closePaidSpaceModal();
      getSpaces();
    } catch (error) {
      console.error('API Error:', error);
      handleErrorMessage(dispatch, error);
    }
  };

  return (
    <div className='modal fade' tabIndex='-1' id='PaidSpaceModal' aria-labelledby='exampleModalLabel' aria-hidden='true'>
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header' style={{ backgroundColor: '#D3E9FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
            <h1 className='modal-title fs-5' id='exampleModalLabel' style={{ fontWeight: 'bold', margin: 0, flex: 1, textAlign: 'center', color: '#000000' }}>
              {type === 'create' ? '建立新付費空間' : '【付費空間編輯】'}
            </h1>
            <button type='button' className='btn-close' aria-label='Close' onClick={closePaidSpaceModal} style={{ marginLeft: 'auto' }} />
          </div>

          <div className='modal-body' style={{ padding: '20px' }}>
            <table className="table" style={{ borderSpacing: '10px' }}>
              <tbody>
                <tr>
                  <th colSpan="2" style={{ backgroundColor: '#D3E9FF', padding: '10px', fontSize: '18px', textAlign: 'center', marginBottom: '10px', borderBottom: '2px solid #415A77', boxShadow: '0px -1.5px 0px 0px #415A77' }}>場地資訊</th>
                </tr>
                <tr style={{ borderBottom: '2px solid #415A77' }}>
                  <td style={{ padding: '30px', marginBottom: '50px' }}>
                    <div className='form-group'>
                      <label htmlFor='paid_space_name'>空間名稱</label>
                      <input type='text' id='paid_space_name' name='paid_space_name' value={tempData.paid_space_name || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paid_space_name ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='paid_space_location'>空間位置</label>
                      <input type='text' id='paid_space_location' name='paid_space_location' value={tempData.paid_space_location || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paid_space_location ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='paid_capacity'>容納人數</label>
                      <input type='number' id='paid_capacity' name='paid_capacity' value={tempData.paid_capacity || 0} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paid_capacity ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>
                  <td style={{ padding: '30px', marginBottom: '50px', verticalAlign: 'top' }}>
                    <div className='form-group'>
                      <label htmlFor='paid_facilities'>設施描述</label>
                      <textarea id='paid_facilities' name='paid_facilities' className='form-control' onChange={handleChange} value={tempData.paid_facilities || ''} style={{ height: '80px', color: modifiedFields.paid_facilities ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='paid_space_overview'>空間概述</label>
                      <textarea id='paid_space_overview' name='paid_space_overview' className='form-control' onChange={handleChange} value={tempData.paid_space_overview || ''} style={{ height: '80px', color: modifiedFields.paid_space_overview ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <th colSpan="2" style={{ backgroundColor: '#D3E9FF', padding: '10px', fontSize: '18px', textAlign: 'center', marginBottom: '10px', borderBottom: '2px solid #415A77' }}>場地設備</th>
                </tr>
                <tr style={{ borderBottom: '2px solid #415A77' }}>
                  <td colSpan="2" style={{ padding: '30px', marginBottom: '50px' }}>
                    <div className="d-flex justify-content-between">
                      <div className='form-check'>
                        <input 
                          type='checkbox' 
                          id='paid_internet_available' 
                          name='paid_internet_available' 
                          className='form-check-input' 
                          onChange={handleChange} 
                          checked={!!tempData.paid_internet_available} 
                        />
                        <label className='form-check-label' htmlFor='paid_internet_available'>是否提供網路</label>
                      </div>
                      <div className='form-check'>
                        <input 
                          type='checkbox' 
                          id='paid_audio_input_available' 
                          name='paid_audio_input_available' 
                          className='form-check-input' 
                          onChange={handleChange} 
                          checked={!!tempData.paid_audio_input_available} 
                        />
                        <label className='form-check-label' htmlFor='paid_audio_input_available'>是否提供聲音輸入</label>
                      </div>
                      <div className='form-check'>
                        <input 
                          type='checkbox' 
                          id='paid_video_input_available' 
                          name='paid_video_input_available' 
                          className='form-check-input' 
                          onChange={handleChange} 
                          checked={!!tempData.paid_video_input_available} 
                        />
                        <label className='form-check-label' htmlFor='paid_video_input_available'>是否提供顯示訊號輸入</label>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th colSpan="2" style={{ backgroundColor: '#D3E9FF', padding: '10px', fontSize: '18px', textAlign: 'center', marginBottom: '10px', borderBottom: '2px solid #415A77' }}>圖片連結</th>
                </tr>
                <tr>
                  <td style={{ padding: '30px', marginBottom: '50px' }}>
                    <div className='form-group'>
                      <label htmlFor='paid_floor_plan_url'>平面圖連結 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='paid_floor_plan_url' name='paid_floor_plan_url' value={tempData.paid_floor_plan_url || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paid_floor_plan_url ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='paid_floor_space_url_1'>照片連結 1</label>
                      <input type='text' id='paid_floor_space_url_1' name='paid_floor_space_url_1' value={tempData.paid_floor_space_url_1 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paid_floor_space_url_1 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='paid_floor_space_url_2'>照片連結 2 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='paid_floor_space_url_2' name='paid_floor_space_url_2' value={tempData.paid_floor_space_url_2 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paid_floor_space_url_2 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '40px' }}>
                      <label htmlFor='paid_charges_url'>收費標準表連結 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='paid_charges_url' name='paid_charges_url' value={tempData.paid_charges_url || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paid_charges_url ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>
                  <td style={{ padding: '30px', marginBottom: '50px' }}>
                    <div className='form-group'>
                      <label htmlFor='paid_item_photo_url_1'>物品照片連結 1 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='paid_item_photo_url_1' name='paid_item_photo_url_1' value={tempData.paid_item_photo_url_1 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paid_item_photo_url_1 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='paid_item_photo_url_2'>物品照片連結 2 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='paid_item_photo_url_2' name='paid_item_photo_url_2' value={tempData.paid_item_photo_url_2 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paid_item_photo_url_2 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='paid_item_photo_url_3'>物品照片連結 3 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='paid_item_photo_url_3' name='paid_item_photo_url_3' value={tempData.paid_item_photo_url_3 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paid_item_photo_url_3 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='paid_item_photo_url_4'>物品照片連結 4 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='paid_item_photo_url_4' name='paid_item_photo_url_4' value={tempData.paid_item_photo_url_4 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paid_item_photo_url_4 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='paid_item_photo_url_5'>物品照片連結 5 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='paid_item_photo_url_5' name='paid_item_photo_url_5' value={tempData.paid_item_photo_url_5 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paid_item_photo_url_5 ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-primary' style={{ backgroundColor: '#6789bb' }} onClick={submit}>儲存</button>
            <button type='button' className='btn btn-secondary' onClick={closePaidSpaceModal}>關閉</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PaidSpaceModal;
