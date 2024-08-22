import axios from "axios";
import { useContext, useEffect, useState, useMemo } from "react";
import { MessageContext, handleSuccessMessage, handleErrorMessage } from '../../store/messageStore';

function PaidSpaceRentalModal({ closeRentalModal, getSpaceRentals, type, tempRental }) {
  const initialData = useMemo(() => ({
    paidSpaceId: '',
    chargeId: '',
    paidSpaceRentalReason: '',
    paidSpaceRentalUsers: '',
    paidSpaceRentalActivityType: '',
    paidSpaceRentalTypeOthers: '',
    paidSpaceRentalUnitType: '',
    paidSpaceRentalUnit: '',
    paidSpaceRentalRenter: '',
    paidSpaceRentalPhone: '',
    paidSpaceRentalEmail: '',
    paidSpaceRentalDateTimeStart1: '',
    paidSpaceRentalDateTimeEnd1: '',
    paidSpaceRentalNote1: '',
    paidSpaceRentalDateTimeStart2: '',
    paidSpaceRentalDateTimeEnd2: '',
    paidSpaceRentalNote2: '',
    paidSpaceRentalFeeActivityPartner: 0,
    paidSpaceRentalFeeSpaceType: '',
    paidSpaceRentalFeeSpace: '',
    paidSpaceRentalFeeClean: '',
    paidSpaceRentalFeePermission: '',
    paidSpaceRentalPayDate: '',
    paidSpaceRentalCreatedDate: new Date().toISOString().slice(0, 10),
    paidSpaceRentalAgree: 0,
    paidSpaceRentalSuccess: 0,
    paidSpaceName: ''
  }), []);

  const [tempData, setTempData] = useState(initialData);
  const [modifiedFields, setModifiedFields] = useState({});
  const [locations, setLocations] = useState([]);
  const [, dispatch] = useContext(MessageContext);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get('http://localhost:8080/paid_spaces');
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
      const selectedLocation = locations.find(location => location.paidSpaceId === tempRental.paidSpaceId);
      setTempData({
        paidSpaceId: tempRental.paidSpaceId || '',
        chargeId: tempRental.chargeId || '',
        paidSpaceRentalReason: tempRental.paidSpaceRentalReason || '',
        paidSpaceRentalUsers: tempRental.paidSpaceRentalUsers || '',
        paidSpaceRentalActivityType: tempRental.paidSpaceRentalActivityType || '',
        paidSpaceRentalTypeOthers: tempRental.paidSpaceRentalTypeOthers || '',
        paidSpaceRentalUnitType: tempRental.paidSpaceRentalUnitType || '',
        paidSpaceRentalUnit: tempRental.paidSpaceRentalUnit || '',
        paidSpaceRentalRenter: tempRental.paidSpaceRentalRenter || '',
        paidSpaceRentalPhone: tempRental.paidSpaceRentalPhone || '',
        paidSpaceRentalEmail: tempRental.paidSpaceRentalEmail || '',
        paidSpaceRentalDateTimeStart1: tempRental.paidSpaceRentalDateTimeStart1 || '',
        paidSpaceRentalDateTimeEnd1: tempRental.paidSpaceRentalDateTimeEnd1 || '',
        paidSpaceRentalNote1: tempRental.paidSpaceRentalNote1 || '',
        paidSpaceRentalDateTimeStart2: tempRental.paidSpaceRentalDateTimeStart2 || '',
        paidSpaceRentalDateTimeEnd2: tempRental.paidSpaceRentalDateTimeEnd2 || '',
        paidSpaceRentalNote2: tempRental.paidSpaceRentalNote2 || '',
        paidSpaceRentalFeeActivityPartner: tempRental.paidSpaceRentalFeeActivityPartner || 0,
        paidSpaceRentalFeeSpaceType: tempRental.paidSpaceRentalFeeSpaceType || '',
        paidSpaceRentalFeeSpace: tempRental.paidSpaceRentalFeeSpace || '',
        paidSpaceRentalFeeClean: tempRental.paidSpaceRentalFeeClean || '',
        paidSpaceRentalFeePermission: tempRental.paidSpaceRentalFeePermission || '',
        paidSpaceRentalPayDate: tempRental.paidSpaceRentalPayDate || '',
        paidSpaceRentalCreatedDate: tempRental.paidSpaceRentalCreatedDate || new Date().toISOString().slice(0, 10),
        paidSpaceRentalAgree: tempRental.paidSpaceRentalAgree || 0,
        paidSpaceRentalSuccess: tempRental.paidSpaceRentalSuccess || 0,
        paidSpaceName: selectedLocation ? selectedLocation.paidSpaceName : '',
      });
      setModifiedFields({});
    } else {
      setTempData(initialData);
      setModifiedFields({});
    }
  }, [type, tempRental, initialData, locations]);

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    const selectedLocationData = locations.find(location => location.paidSpaceName === selectedLocation);
    setTempData((prevData) => ({
      ...prevData,
      paidSpaceName: selectedLocation,
      paidSpaceId: selectedLocationData ? selectedLocationData.paidSpaceId : '',
    }));
    setModifiedFields((prevFields) => ({
      ...prevFields,
      paidSpaceName: true,
      paidSpaceId: true,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setTempData((prevData) => ({
      ...prevData,
      [name]: checked ? 1 : 0,
    }));
    setModifiedFields((prevFields) => ({
      ...prevFields,
      [name]: true,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericFields = ['paidSpaceRentalPhone', 'paidSpaceRentalUsers', 'paidSpaceRentalFeeSpace', 'paidSpaceRentalFeeClean', 'paidSpaceRentalFeePermission', 'paidSpaceRentalFeeSpaceType'];
    if (numericFields.includes(name) && isNaN(value)) {
      handleErrorMessage(dispatch, {
        response: { data: { message: `欄位 【${name}】 必須是數字` } }
      });
      return;
    }

    setTempData((prevData) => ({
      ...prevData,
      [name]: value === '' ? null : value,
    }));
    setModifiedFields((prevFields) => ({
      ...prevFields,
      [name]: true,
    }));
  };

  const validateFields = () => {
    const requiredFields = [
      { key: 'paidSpaceId', label: '申請地點' },
      { key: 'chargeId', label: '收費項目' },
      { key: 'paidSpaceRentalReason', label: '申請理由' },
      { key: 'paidSpaceRentalUsers', label: '使用人數' },
      { key: 'paidSpaceRentalActivityType', label: '活動類型' },
      { key: 'paidSpaceRentalUnitType', label: '單位類型' },
      { key: 'paidSpaceRentalUnit', label: '申請單位' },
      { key: 'paidSpaceRentalRenter', label: '申請人' },
      { key: 'paidSpaceRentalPhone', label: '聯絡電話' },
      { key: 'paidSpaceRentalEmail', label: '電子郵件' },
      { key: 'paidSpaceRentalDateTimeStart1', label: '第一組起始時間' },
      { key: 'paidSpaceRentalDateTimeEnd1', label: '第一組結束時間' },
      { key: 'paidSpaceRentalFeeSpace', label: '場地費' },
      { key: 'paidSpaceRentalFeeClean', label: '清潔費' },
      { key: 'paidSpaceRentalFeePermission', label: '保證金' },
    ];

    for (let field of requiredFields) {
      if (!tempData[field.key]) {
        handleErrorMessage(dispatch, {
          response: { data: { message: `欄位 【${field.label}】 不能為空` } }
        });
        return false;
      }
    }

    if (type === 'create' && !tempData.paidSpaceRentalAgree) {
      handleErrorMessage(dispatch, {
        response: { data: { message: '請確認使用者同意使用【付費空間】規則' } }
      });
      return false;
    }

    return true;
  };
  const handleTimeValidation = () => {
    const startTime = new Date(tempData.paidSpaceRentalDateTimeStart1);
    const endTime = new Date(tempData.paidSpaceRentalDateTimeEnd1);
  
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
  
    if (![0].includes(startMinutes) || ![0].includes(endMinutes)) {
      handleErrorMessage(dispatch, {
        response: { data: { message: '時間必須為1小時為單位' } }
      });
      return false;
    }
  
    return true;
  };
  

  
  const submit = async () => {
    if (!validateFields() || !handleTimeValidation()) {
      return;
    }
  
    const api = `http://localhost:8080/paid_space_rentals${type === 'edit' && tempRental.paidSpaceRentalId ? `/${tempRental.paidSpaceRentalId}` : ''}`;
    const method = type === 'edit' ? 'put' : 'post';
  
    try {
      const response = await axios[method](api, tempData, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.status === 200 || response.status === 201) {
        handleSuccessMessage(dispatch, type === 'edit' ? '更新成功' : '創建成功', type === 'edit' ? `編輯編號為 ${tempData.paidSpaceId} 的空間成功` : '創建 新的一筆付費空間 成功');
        closeRentalModal();
        getSpaceRentals();
      } else {
        handleErrorMessage(dispatch, {
          response: { data: { message: `Unexpected response status: ${response.status}` } }
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.message || `Failed to ${type === 'edit' ? 'update' : 'create'}`;
      handleErrorMessage(dispatch, {
        response: { data: { message: errorMessage } }
      });
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
                {/* 聯絡資訊 & 申請資訊 */}
                <tr>
                  <th colSpan="2" style={{ backgroundColor: '#D3E9FF', padding: '10px', fontSize: '18px', textAlign: 'center', marginBottom: '10px' }}>聯絡資訊 & 申請資訊</th>
                </tr>
                <tr>
                  <td style={{ padding: '30px' }}>
                    <div className='form-group'>
                      <label htmlFor='paidSpaceRentalRenter'>申請人</label>
                      <input type='text' id='paidSpaceRentalRenter' name='paidSpaceRentalRenter' value={tempData.paidSpaceRentalRenter || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalRenter ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='paidSpaceRentalUnit'>申請單位</label>
                      <input type='text' id='paidSpaceRentalUnit' name='paidSpaceRentalUnit' value={tempData.paidSpaceRentalUnit || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalUnit ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='paidSpaceRentalUnitType'>單位類型</label>
                      <select id='paidSpaceRentalUnitType' name='paidSpaceRentalUnitType' value={tempData.paidSpaceRentalUnitType || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalUnitType ? '#AC6A6A' : 'initial' }}>
                        <option value=''>選擇單位類型</option>
                        <option value='1'>校內單位</option>
                        <option value='2'>校外單位</option>
                      </select>
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='paidSpaceRentalEmail'>電子郵件</label>
                      <input type='text' id='paidSpaceRentalEmail' name='paidSpaceRentalEmail' value={tempData.paidSpaceRentalEmail || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalEmail ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='paidSpaceRentalPhone'>聯絡電話</label>
                      <input type='text' id='paidSpaceRentalPhone' name='paidSpaceRentalPhone' value={tempData.paidSpaceRentalPhone || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalPhone ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>
                  <td style={{ padding: '30px' }}>
                    <div className='form-group'>
                        <label htmlFor='paidSpaceName'>申請地點</label>
                        <select id='paidSpaceName' name='paidSpaceName' value={tempData.paidSpaceName || ''} onChange={handleLocationChange} className='form-control' style={{ color: modifiedFields.paidSpaceName ? '#AC6A6A' : 'initial' }}>
                          <option value=''>選擇申請地點</option>
                          {Array.isArray(locations) && locations.map((location) => (
                            <option key={location.paidSpaceId} value={location.paidSpaceName}>{location.paidSpaceName}</option>
                          ))}
                        </select>
                      </div>
                    <div className='form-group'  style={{ marginTop: '20px' }}>
                      <label htmlFor='paidSpaceRentalReason'>申請理由</label>
                      <textarea id='paidSpaceRentalReason' name='paidSpaceRentalReason' className='form-control' onChange={handleChange} value={tempData.paidSpaceRentalReason || ''} style={{ height: '80px', color: modifiedFields.paidSpaceRentalReason ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='paidSpaceRentalUsers'>使用人數</label>
                      <input type='text' id='paidSpaceRentalUsers' name='paidSpaceRentalUsers' value={tempData.paidSpaceRentalUsers || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalUsers ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='paidSpaceRentalActivityType'>活動類型</label>
                      <select id='paidSpaceRentalActivityType' name='paidSpaceRentalActivityType' value={tempData.paidSpaceRentalActivityType || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalActivityType ? '#AC6A6A' : 'initial' }}>
                        <option value=''>選擇活動類型</option>
                        <option value='1'>學術用途</option>
                        <option value='2'>研究用途</option>
                        <option value='3'>其他</option>
                      </select>
                    </div>
                    {tempData.paidSpaceRentalActivityType === '3' && (
                      <div className='form-group' style={{ marginTop: '20px' }}>
                        <label htmlFor='paidSpaceRentalTypeOthers'>其他類型</label>
                        <input type='text' id='paidSpaceRentalTypeOthers' name='paidSpaceRentalTypeOthers' value={tempData.paidSpaceRentalTypeOthers || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalTypeOthers ? '#AC6A6A' : 'initial' }} />
                      </div>
                    )}
                  </td>
                </tr>

                {/* 時間資訊 */}
                <tr>
                  <th colSpan="2" style={{ backgroundColor: '#D3E9FF', padding: '10px', fontSize: '18px', textAlign: 'center', marginBottom: '10px' }}>時間資訊</th>
                </tr>
                <tr>
                  <td style={{ padding: '30px' }}>
                    <div className='form-group'>
                      <label htmlFor='paidSpaceRentalDateTimeStart1'>第一組起始時間</label>
                      <input type='datetime-local' id='paidSpaceRentalDateTimeStart1' name='paidSpaceRentalDateTimeStart1' value={tempData.paidSpaceRentalDateTimeStart1 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalDateTimeStart1 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='paidSpaceRentalDateTimeEnd1'>第一組結束時間</label>
                      <input type='datetime-local' id='paidSpaceRentalDateTimeEnd1' name='paidSpaceRentalDateTimeEnd1' value={tempData.paidSpaceRentalDateTimeEnd1 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalDateTimeEnd1 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='paidSpaceRentalNote1'>備註1</label>
                      <input type='text' id='paidSpaceRentalNote1' name='paidSpaceRentalNote1' value={tempData.paidSpaceRentalNote1 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalNote1 ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>
                  <td style={{ padding: '30px' }}>
                    <div className='form-group'>
                      <label htmlFor='paidSpaceRentalDateTimeStart2'>第二組起始時間</label>
                      <input type='datetime-local' id='paidSpaceRentalDateTimeStart2' name='paidSpaceRentalDateTimeStart2' value={tempData.paidSpaceRentalDateTimeStart2 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalDateTimeStart2 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='paidSpaceRentalDateTimeEnd2'>第二組結束時間</label>
                      <input type='datetime-local' id='paidSpaceRentalDateTimeEnd2' name='paidSpaceRentalDateTimeEnd2' value={tempData.paidSpaceRentalDateTimeEnd2 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalDateTimeEnd2 ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='paidSpaceRentalNote2'>備註2</label>
                      <input type='text' id='paidSpaceRentalNote2' name='paidSpaceRentalNote2' value={tempData.paidSpaceRentalNote2 || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalNote2 ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>
                </tr>

                {/* 費用資訊 */}
                <tr>
                  <th colSpan="2" style={{ backgroundColor: '#D3E9FF', padding: '10px', fontSize: '18px', textAlign: 'center', marginBottom: '10px' }}>費用資訊</th>
                </tr>
                <tr>
                  <td style={{ padding: '30px' }}>
                    <div className='form-group'>
                      <label htmlFor='paidSpaceRentalFeeSpace'>場地費</label>
                      <input type='text' id='paidSpaceRentalFeeSpace' name='paidSpaceRentalFeeSpace' value={tempData.paidSpaceRentalFeeSpace || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalFeeSpace ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='paidSpaceRentalFeeClean'>清潔費</label>
                      <input type='text' id='paidSpaceRentalFeeClean' name='paidSpaceRentalFeeClean' value={tempData.paidSpaceRentalFeeClean || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalFeeClean ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <label htmlFor='paidSpaceRentalFeePermission'>保證金</label>
                      <input type='text' id='paidSpaceRentalFeePermission' name='paidSpaceRentalFeePermission' value={tempData.paidSpaceRentalFeePermission || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalFeePermission ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>
                  <td style={{ padding: '30px', verticalAlign: 'top' }}>
                    <div className='form-group'>
                      <label htmlFor='paidSpaceRentalFeeSpaceType'>場地費收費級別</label>
                      <input type='text' id='paidSpaceRentalFeeSpaceType' name='paidSpaceRentalFeeSpaceType' value={tempData.paidSpaceRentalFeeSpaceType || ''} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceRentalFeeSpaceType ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className='form-group' style={{ marginTop: '20px' }}>
                      <input type='checkbox' id='paidSpaceRentalFeeActivityPartner' name='paidSpaceRentalFeeActivityPartner' checked={tempData.paidSpaceRentalFeeActivityPartner === 1} onChange={handleCheckboxChange} className='form-check-input' />
                      <label htmlFor='paidSpaceRentalFeeActivityPartner' style={{ marginLeft: '10px' }}>是否與研發處合辦活動</label>
                    </div>
                    {type === 'create' && (
                      <div className='form-group' style={{ marginTop: '20px' }}>
                        <input 
                          type='checkbox' 
                          id='paidSpaceRentalAgree' 
                          name='paidSpaceRentalAgree' 
                          checked={tempData.paidSpaceRentalAgree === 1} 
                          onChange={handleCheckboxChange}  
                          className='form-check-input' 
                        />
                        <label htmlFor='paidSpaceRentalAgree' style={{ marginLeft: '10px' }}>請確認使用者同意使用【付費空間】規則</label>
                      </div>
                    )}
                  </td>
                </tr>
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

export default PaidSpaceRentalModal;

