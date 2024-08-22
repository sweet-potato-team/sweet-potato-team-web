import axios from "axios";
import { useContext, useEffect, useState, useMemo } from "react";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../../store/messageStore';

function SpaceRentalModal({ closeRentalModal, getSpaceRentals, type, tempRental }) {
  const initialData = useMemo(() => ({
    free_space_id: '',  // 空间编号
    space_rental_unit: '',
    space_rental_location: '',  // 申请地点
    space_rental_date_start: '', // 租借起始时间
    space_rental_date_end: '', // 租借结束时间
    space_rental_phone: '',
    space_rental_email: '',
    space_rental_reason: '',
    space_rental_renter: '',
    space_rental_agree: 0,
  }), []);
  
  const [tempData, setTempData] = useState(initialData);
  const [modifiedFields, setModifiedFields] = useState({});
  const [locations, setLocations] = useState([]); // 用于存储申请地点选单
  const [, dispatch] = useContext(MessageContext);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get('http://localhost:8080/spaces');
        if (Array.isArray(res.data.results)) {
          setLocations(res.data.results);
        } else {
          console.error("API response is not an array:", res.data);
          setLocations([]);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocations([]);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (type === 'edit' && tempRental) {
      const selectedLocation = locations.find(location => location.freeSpaceId === tempRental.freeSpaceId);
      setTempData({
        free_space_id: tempRental.freeSpaceId || '',
        space_rental_unit: tempRental.spaceRentalUnit || '',
        space_rental_location: selectedLocation ? selectedLocation.freeSpaceName : '',
        space_rental_date_start: tempRental.spaceRentalDateStart || '',
        space_rental_date_end: tempRental.spaceRentalDateEnd || '',
        space_rental_phone: tempRental.spaceRentalPhone || '',
        space_rental_email: tempRental.spaceRentalEmail || '',
        space_rental_reason: tempRental.spaceRentalReason || '',
        space_rental_renter: tempRental.spaceRentalRenter || '',
        space_rental_agree: tempRental.spaceRentalAgree === 1,
      });
      setModifiedFields({});
    } else {
      setTempData(initialData);
      setModifiedFields({});
    }
  }, [type, tempRental, initialData, locations]);

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    const selectedLocationData = locations.find(location => location.freeSpaceName === selectedLocation);
    setTempData((prevData) => ({
      ...prevData,
      space_rental_location: selectedLocation,
      free_space_id: selectedLocationData ? selectedLocationData.freeSpaceId : '',
    }));
    setModifiedFields((prevFields) => ({
      ...prevFields,
      space_rental_location: true,
      free_space_id: true,
    }));
  };

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
      { key: 'free_space_id', label: '空間編號' },
      { key: 'space_rental_unit', label: '申請單位' },
      { key: 'space_rental_location', label: '申請地點' },
      { key: 'space_rental_date_start', label: '租借起始時間' },
      { key: 'space_rental_date_end', label: '租借結束時間' },
      { key: 'space_rental_phone', label: '聯絡電話' },
      { key: 'space_rental_email', label: '電子郵件' },
      { key: 'space_rental_reason', label: '申請理由' },
      { key: 'space_rental_renter', label: '申請人' },
    ];

    for (let field of requiredFields) {
      if (!tempData[field.key]) {
        handleErrorMessage(dispatch, {
          response: { data: { message: `欄位 【${field.label}】 不能為空` } }
        });
        return false;
      }
    }

    if (type === 'create' && !tempData.space_rental_agree) {
      handleErrorMessage(dispatch, {
        response: { data: { message: '請確認使用者同意使用規則' } }
      });
      return false;
    }

    return true;
  };
  const handleTimeValidation = () => {
    const startTime = new Date(tempData.space_rental_date_start);
    const endTime = new Date(tempData.space_rental_date_end);
  
    // 檢查結束時間是否晚於開始時間
    if (endTime <= startTime) {
      handleErrorMessage(dispatch, {
        response: { data: { message: '結束時間必須晚於開始時間' } }
      });
      return false;
    }
  
    // 檢查分鐘是否為00或30
    const startMinutes = startTime.getMinutes();
    const endMinutes = endTime.getMinutes();
  
    if (![0, 30].includes(startMinutes) || ![0, 30].includes(endMinutes)) {
      handleErrorMessage(dispatch, {
        response: { data: { message: '時間必須為30分鐘、1小時為單位' } }
      });
      return false;
    }
  
    return true;
  };

  
  const submit = async () => {
    if (!validateFields() || !handleTimeValidation()) {
      return;
    }
  
    try {
      const payload = {
        freeSpaceId: tempData.free_space_id,
        spaceRentalUnit: tempData.space_rental_unit,
        spaceRentalDateStart: tempData.space_rental_date_start.replace(' ', 'T'),
        spaceRentalDateEnd: tempData.space_rental_date_end.replace(' ', 'T'),
        spaceRentalPhone: tempData.space_rental_phone,
        spaceRentalEmail: tempData.space_rental_email,
        spaceRentalReason: tempData.space_rental_reason,
        spaceRentalRenter: tempData.space_rental_renter,
        spaceRentalAgree: tempData.space_rental_agree ? 1 : 0,
        spaceRentalSuccess: 0, // 初始狀態為未通過
      };
  
      const api = type === 'edit' && tempRental.spaceRentalId
        ? `http://localhost:8080/space_rentals/${tempRental.spaceRentalId}`
        : 'http://localhost:8080/space_rentals';
  
      const method = type === 'edit' ? 'put' : 'post';
  
      await axios({
        method: method,
        url: api,
        headers: {
          'Content-Type': 'application/json',
        },
        data: payload,
      });
  
      if (type === 'create') {
        handleSuccessMessage(dispatch, '創建成功', '創建 新的一筆付費空間 成功');
      } else if (type === 'edit') {
        handleSuccessMessage(dispatch, '更新成功', `編輯編號為 ${tempData.free_space_id} 的空間成功`);
      }
      
      closeRentalModal(); // 成功訊息後立即關閉視窗
      getSpaceRentals(); // 刷新租借列表
  
    } catch (error) {
      console.error('API Error:', error);
      handleErrorMessage(dispatch, error);
    }
  };

  return (
    <div className='modal fade' id='rentalModal' tabIndex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true'>
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header' style={{ backgroundColor: '#D3E9FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
            <h1 className='modal-title fs-5' id='exampleModalLabel' style={{ fontWeight: 'bold', margin: 0, flex: 1, textAlign: 'center', color: '#000000' }}>
              {type === 'create' ? '建立新租借申請' : '【租借申請編輯】'}
            </h1>
            <button type='button' className='btn-close' aria-label='Close' onClick={closeRentalModal} style={{ marginLeft: 'auto' }} />
          </div>
          <div className='modal-body' style={{ padding: '20px' }}>
            <table className="table" style={{ borderSpacing: '10px' }}>
              <tbody>
                {/* 聯絡資訊 */}
                <tr>
                  <th colSpan="2" style={{ backgroundColor: '#D3E9FF', padding: '10px', fontSize: '18px', textAlign: 'center', marginBottom: '10px' }}>聯絡資訊</th>
                </tr>
                <tr>
                  <td style={{ padding: '30px' }}>
                    <div className='form-group'>
                      <label htmlFor='space_rental_renter'>申請人</label>
                      <input type='text' id='space_rental_renter' name='space_rental_renter' value={tempData.space_rental_renter || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.space_rental_renter ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='space_rental_unit'>申請單位</label>
                      <input type='text' id='space_rental_unit' name='space_rental_unit' value={tempData.space_rental_unit || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.space_rental_unit ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='space_rental_email'>電子郵件</label>
                      <input type='text' id='space_rental_email' name='space_rental_email' value={tempData.space_rental_email || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.space_rental_email ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>

                  <td style={{ padding: '30px' }}>
                    <div className='form-group'>
                      <label htmlFor='space_rental_phone'>聯絡電話</label>
                      <input type='text' id='space_rental_phone' name='space_rental_phone' value={tempData.space_rental_phone || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.space_rental_phone ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='space_rental_location'>申請地點</label>
                      <select id='space_rental_location' name='space_rental_location' value={tempData.space_rental_location || ''} onChange={handleLocationChange} className='form-control' style={{ color: modifiedFields.space_rental_location ? '#AC6A6A' : 'initial' }}>
                        <option value=''>選擇申請地點</option>
                        {Array.isArray(locations) && locations.map((location) => (
                          <option key={location.freeSpaceId} value={location.freeSpaceName}>{location.freeSpaceName}</option>
                        ))}
                      </select>
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='free_space_id'>空間編號</label>
                      <input type='text' id='free_space_id' name='free_space_id' value={tempData.free_space_id || ''} onChange={handleChange} className='form-control' disabled />
                    </div>
                  </td>
                </tr>

                {/* 申请信息 */}
                <tr>
                  <th colSpan="2" style={{ backgroundColor: '#D3E9FF', padding: '10px', fontSize: '18px', textAlign: 'center', marginBottom: '10px' }}>申請資訊</th>
                </tr>

                <tr>
                  <td style={{ padding: '30px' }}>
                    <div className='form-group'>
                      <label htmlFor='space_rental_date_start'>租借起始  <span style={{ fontSize: '12px', color: '#888' }}>( 以30分鐘、1小時為單位 )</span></label>
                      <input type='datetime-local' id='space_rental_date_start' name='space_rental_date_start' value={tempData.space_rental_date_start || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.space_rental_date_start ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '10px' }}>
                      <label htmlFor='space_rental_date_end'>租借結束  <span style={{ fontSize: '12px', color: '#888' }}>( 以30分鐘、1小時為單位 )</span></label>
                      <input type='datetime-local' id='space_rental_date_end' name='space_rental_date_end' value={tempData.space_rental_date_end || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.space_rental_date_end ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>
                  <td style={{ padding: '30px', verticalAlign: 'top' }}>
                    <div className='form-group'>
                      <label htmlFor='space_rental_reason'>申請理由</label>
                      <textarea id='space_rental_reason' name='space_rental_reason' className='form-control' onChange={handleChange} value={tempData.space_rental_reason || ''} style={{ height: '80px', color: modifiedFields.space_rental_reason ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>
                </tr>

                {type === 'create' && (
                  <tr>
                    <td colSpan="2" style={{ padding: '30px', verticalAlign: 'top' }}>
                      <div className='form-check'>
                        <input type='checkbox' id='space_rental_agree' name='space_rental_agree' checked={tempData.space_rental_agree} onChange={handleChange} className='form-check-input' />
                        <label htmlFor='space_rental_agree' className='form-check-label'>請確認使用者同意使用規則</label>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className='modal-footer' style={{ borderTop: '2px #415A77' }}>
            <button type='button' className='btn btn-primary' style={{ backgroundColor: '#6789bb' }} onClick={submit}>儲存</button>
            <button type='button' className='btn btn-secondary' onClick={closeRentalModal}>關閉</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpaceRentalModal;
