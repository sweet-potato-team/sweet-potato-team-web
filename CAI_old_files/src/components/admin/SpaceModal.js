import axios from "axios";
import { useContext, useEffect, useState, useMemo } from "react";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../../store/messageStore';

function SpaceModal({ closeSpaceModal, getSpaces, type, tempSpace }) {
  const initialData = useMemo(() => ({
    free_space_name: '',
    free_space_location: '',
    free_floor_plan_url: '',
    free_floor_space_url_1: '',
    free_floor_space_url_2: '',
    free_floor_space_url_3: '',
    free_item_photo_url_1: '',
    free_item_photo_url_2: '',
    free_item_photo_url_3: '',
    free_item_photo_url_4: '',
    free_item_photo_url_5: '',
    free_capacity: 0,
    free_internet_available: 0,
    free_audio_input_available: 0,
    free_video_input_available: 0,
    free_facilities: '',
    free_space_overview: '',
    free_is_active: 1,
  }), []);

  const [tempData, setTempData] = useState(initialData);
  const [modifiedFields, setModifiedFields] = useState({});

  const [, dispatch] = useContext(MessageContext);

  useEffect(() => {
    if (type === 'edit' && tempSpace) {
      setTempData({
        free_space_name: tempSpace.freeSpaceName || '',
        free_space_location: tempSpace.freeSpaceLocation || '',
        free_floor_plan_url: tempSpace.freeFloorPlanUrl || '',
        free_floor_space_url_1: tempSpace.freeFloorSpaceUrl1 || '',
        free_floor_space_url_2: tempSpace.freeFloorSpaceUrl2 || '',
        free_floor_space_url_3: tempSpace.freeFloorSpaceUrl3 || '',
        free_item_photo_url_1: tempSpace.freeItemPhotoUrl1 || '',
        free_item_photo_url_2: tempSpace.freeItemPhotoUrl2 || '',
        free_item_photo_url_3: tempSpace.freeItemPhotoUrl3 || '',
        free_item_photo_url_4: tempSpace.freeItemPhotoUrl4 || '',
        free_item_photo_url_5: tempSpace.freeItemPhotoUrl5 || '',
        free_capacity: tempSpace.freeCapacity || 0,
        free_internet_available: tempSpace.freeInternetAvailable === 1,
        free_audio_input_available: tempSpace.freeAudioInputAvailable === 1,
        free_video_input_available: tempSpace.freeVideoInputAvailable === 1,
        free_facilities: tempSpace.freeFacilities || '',
        free_space_overview: tempSpace.freeSpaceOverview || '',
        free_is_active: tempSpace.freeIsActive === 1,
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

  const validateFields = () => {
    const requiredFields = [
      { key: 'free_space_name', label: '空間名稱' },
      { key: 'free_space_location', label: '空間位置' },
      { key: 'free_floor_space_url_1', label: '照片連結 1' },
      { key: 'free_capacity', label: '容納人數' },
      { key: 'free_facilities', label: '設施描述' },
      { key: 'free_space_overview', label: '空間概述' },
    ];

    for (let field of requiredFields) {
      if (!tempData[field.key]) {
        handleErrorMessage(dispatch, {
          response: { data: { message: `欄位 【${field.label}】不能為空` } }
        });
        return false;
      }
    }
    return true;
  };

  const submit = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      let payload = {
        freeSpaceName: tempData.free_space_name,
        freeSpaceLocation: tempData.free_space_location,
        freeFloorPlanUrl: tempData.free_floor_plan_url,
        freeFloorSpaceUrl1: tempData.free_floor_space_url_1,
        freeFloorSpaceUrl2: tempData.free_floor_space_url_2,
        freeFloorSpaceUrl3: tempData.free_floor_space_url_3,
        freeItemPhotoUrl1: tempData.free_item_photo_url_1,
        freeItemPhotoUrl2: tempData.free_item_photo_url_2,
        freeItemPhotoUrl3: tempData.free_item_photo_url_3,
        freeItemPhotoUrl4: tempData.free_item_photo_url_4,
        freeItemPhotoUrl5: tempData.free_item_photo_url_5,
        freeCapacity: tempData.free_capacity,
        freeInternetAvailable: tempData.free_internet_available ? 1 : 0,
        freeAudioInputAvailable: tempData.free_audio_input_available ? 1 : 0,
        freeVideoInputAvailable: tempData.free_video_input_available ? 1 : 0,
        freeFacilities: tempData.free_facilities,
        freeSpaceOverview: tempData.free_space_overview,
        freeIsActive: tempData.free_is_active ? 1 : 0,
      };

      let api = `http://localhost:8080/spaces`;
      let method = 'post';

      if (type === 'edit' && tempSpace.freeSpaceId) {
        api = `http://localhost:8080/spaces/${tempSpace.freeSpaceId}`;
        method = 'put';
      }

      await axios({
        method: method,
        url: api,
        headers: {
          'Content-Type': 'application/json',
        },
        data: payload,
      });

      handleSuccessMessage(dispatch, '操作成功', type === 'edit' ? `編輯 ${tempData.free_space_name} 免費空間成功` : '創建 新的一筆免費空間 成功');
      closeSpaceModal();
      getSpaces();
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.message || `操作失敗，請稍後再試`;
      handleErrorMessage(dispatch, errorMessage);
    }
  };
  
  return (
    <div className='modal fade' tabIndex='-1' id='spaceModal' aria-labelledby='exampleModalLabel' aria-hidden='true'>
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
        <div className='modal-header' style={{ backgroundColor: '#D3E9FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
          <h1 className='modal-title fs-5' id='exampleModalLabel' style={{ fontWeight: 'bold', margin: 0, flex: 1, textAlign: 'center', color: '#000000' }}>
            {type === 'create' ? '建立新免費空間' : '【免費空間編輯】'}
          </h1>
          <button type='button' className='btn-close' aria-label='Close' onClick={closeSpaceModal} style={{ marginLeft: 'auto' }} />
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
                      <label htmlFor='free_space_name'>空間名稱</label>
                      <input type='text' id='free_space_name' name='free_space_name' value={tempData.free_space_name || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.free_space_name ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='free_space_location'>空間位置</label>
                      <input type='text' id='free_space_location' name='free_space_location' value={tempData.free_space_location || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.free_space_location ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='free_capacity'>容納人數</label>
                      <input type='number' id='free_capacity' name='free_capacity' value={tempData.free_capacity || 0} onChange={handleChange} className='form-control' style={{ color: modifiedFields.free_capacity ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>
                  <td style={{ padding: '30px', marginBottom: '50px', verticalAlign: 'top' }}>
                    <div className='form-group'>
                      <label htmlFor='free_facilities'>設施描述</label>
                      <textarea id='free_facilities' name='free_facilities' className='form-control' onChange={handleChange} value={tempData.free_facilities || ''} style={{ height: '80px', color: modifiedFields.free_facilities ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='free_space_overview'>空間概述</label> {/* 新增的字段 */}
                      <textarea id='free_space_overview' name='free_space_overview' className='form-control' onChange={handleChange} value={tempData.free_space_overview || ''} style={{ height: '80px', color: modifiedFields.free_space_overview ? '#AC6A6A' : 'initial' }} />
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
                          id='free_internet_available' 
                          name='free_internet_available' 
                          className='form-check-input' 
                          onChange={handleChange} 
                          checked={!!tempData.free_internet_available} 
                        />
                        <label className='form-check-label' htmlFor='free_internet_available'>是否提供網路</label>
                      </div>
                      <div className='form-check'>
                        <input 
                          type='checkbox' 
                          id='free_audio_input_available' 
                          name='free_audio_input_available' 
                          className='form-check-input' 
                          onChange={handleChange} 
                          checked={!!tempData.free_audio_input_available} 
                        />
                        <label className='form-check-label' htmlFor='free_audio_input_available'>是否提供聲音輸入</label>
                      </div>
                      <div className='form-check'>
                        <input 
                          type='checkbox' 
                          id='free_video_input_available' 
                          name='free_video_input_available' 
                          className='form-check-input' 
                          onChange={handleChange} 
                          checked={!!tempData.free_video_input_available} 
                        />
                        <label className='form-check-label' htmlFor='free_video_input_available'>是否提供顯示訊號輸入</label>
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
                      <label htmlFor='free_floor_plan_url'>平面圖連結 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='free_floor_plan_url' name='free_floor_plan_url' value={tempData.free_floor_plan_url || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.free_floor_plan_url ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='free_floor_space_url_1'>照片連結 1</label>
                      <input type='text' id='free_floor_space_url_1' name='free_floor_space_url_1' value={tempData.free_floor_space_url_1 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.free_floor_space_url_1 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='free_floor_space_url_2'>照片連結 2 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='free_floor_space_url_2' name='free_floor_space_url_2' value={tempData.free_floor_space_url_2 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.free_floor_space_url_2 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='free_floor_space_url_3'>照片連結 3 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='free_floor_space_url_3' name='free_floor_space_url_3' value={tempData.free_floor_space_url_3 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.free_floor_space_url_3 ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>
                  <td style={{ padding: '30px', marginBottom: '50px' }}>
                    <div className='form-group'>
                      <label htmlFor='free_item_photo_url_1'>物品照片連結 1 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='free_item_photo_url_1' name='free_item_photo_url_1' value={tempData.free_item_photo_url_1 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.free_item_photo_url_1 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='free_item_photo_url_2'>物品照片連結 2 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='free_item_photo_url_2' name='free_item_photo_url_2' value={tempData.free_item_photo_url_2 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.free_item_photo_url_2 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='free_item_photo_url_3'>物品照片連結 3 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='free_item_photo_url_3' name='free_item_photo_url_3' value={tempData.free_item_photo_url_3 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.free_item_photo_url_3 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='free_item_photo_url_4'>物品照片連結 4 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='free_item_photo_url_4' name='free_item_photo_url_4' value={tempData.free_item_photo_url_4 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.free_item_photo_url_4 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='free_item_photo_url_5'>物品照片連結 5 <span style={{ fontSize: '12px', color: '#888' }}>( 非必填 )</span></label>
                      <input type='text' id='free_item_photo_url_5' name='free_item_photo_url_5' value={tempData.free_item_photo_url_5 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.free_item_photo_url_5 ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-primary' style={{ backgroundColor: '#6789bb' }} onClick={submit}>儲存</button>
            <button type='button' className='btn btn-secondary' onClick={closeSpaceModal}>關閉</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpaceModal;