import axios from "axios";
import { useContext, useEffect, useState, useMemo } from "react";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../store/messageStore';

function ChargeModal({ closeChargeModal, getCharges, type, tempCharge }) {
  // 定義一個內部使用的 InputField 元件
  const InputField = ({ id, name, value, onChange, modified, label }) => (
    <div className='form-group' style={{ marginBottom: '15px' }}>
      <label htmlFor={id}>{label}</label>
      <input 
        type='number' 
        id={id} 
        name={name} 
        value={value} 
        onChange={onChange} 
        className='form-control form-control-sm' 
        style={{ color: modified ? '#AC6A6A' : 'initial' }} 
      />
    </div>
  );

  const initialData = useMemo(() => ({
    chargeLevel: '', chargeCategory: '', paidSpaceId: '', chargeRentalFeeSpace: '', chargeRentalFeeClean: '', chargeRentalFeePermission: ''
  }), []);
  
  const [tempData, setTempData] = useState(initialData);
  const [modifiedFields, setModifiedFields] = useState({});

  const [, dispatch] = useContext(MessageContext);

  useEffect(() => {
    if (type === 'edit' && tempCharge) {
      setTempData({
        chargeLevel: tempCharge.chargeLevel || '', chargeCategory: tempCharge.chargeCategory || '', paidSpaceId: tempCharge.paidSpaceId || '',
        chargeRentalFeeSpace: tempCharge.chargeRentalFeeSpace || '', chargeRentalFeeClean: tempCharge.chargeRentalFeeClean || '', chargeRentalFeePermission: tempCharge.chargeRentalFeePermission || ''
      });
      setModifiedFields({});
    } else {
      setTempData(initialData);
      setModifiedFields({});
    }
  }, [type, tempCharge, initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData((prevData) => ({ ...prevData, [name]: value }));
    setModifiedFields((prevFields) => ({ ...prevFields, [name]: true }));
  };

  const submit = async () => {
    try {
      const payload = {
        chargeLevel: tempData.chargeLevel, chargeCategory: tempData.chargeCategory, paidSpaceId: tempData.paidSpaceId,
        chargeRentalFeeSpace: tempData.chargeRentalFeeSpace, chargeRentalFeeClean: tempData.chargeRentalFeeClean, chargeRentalFeePermission: tempData.chargeRentalFeePermission
      };
  
      let api = `http://localhost:8080/manage_charges`, method = 'post';
  
      if (type === 'edit' && tempCharge.chargeId) {  
        api = `http://localhost:8080/manage_charges/${tempCharge.chargeId}`;
        method = 'put';
      }
  
      const res = await axios({ method, url: api, headers: { 'Content-Type': 'application/json' }, data: payload });
  
      handleSuccessMessage(dispatch, res);
      closeChargeModal();
      getCharges();
    } catch (error) {
      console.error('API Error:', error); 
      handleErrorMessage(dispatch, error);
    }
  };

  return (
    <div className='modal fade' tabIndex='-1' id='ChargeModal' aria-labelledby='exampleModalLabel' aria-hidden='true'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header' style={{ backgroundColor: '#D3E9FF', justifyContent: 'center', padding: '10px 20px' }}>
            <h1 className='modal-title fs-5' id='exampleModalLabel' style={{ fontWeight: 'bold', color: '#000000', textAlign: 'center', width: '100%' }}>
              {type === 'create' ? '建立新收費記錄' : '【收費記錄編輯】'}
            </h1>
            <button type='button' className='btn-close' aria-label='Close' onClick={closeChargeModal} />
          </div>

          <div className='modal-body' style={{ padding: '20px' }}>
            <div className='row'>
              <div className='col-6'>
                <InputField id='chargeLevel' name='chargeLevel' value={tempData.chargeLevel} onChange={handleChange} modified={modifiedFields.chargeLevel} label='收費等級' />
                <InputField id='chargeCategory' name='chargeCategory' value={tempData.chargeCategory} onChange={handleChange} modified={modifiedFields.chargeCategory} label='收費類別' />
                <InputField id='paidSpaceId' name='paidSpaceId' value={tempData.paidSpaceId} onChange={handleChange} modified={modifiedFields.paidSpaceId} label='付費空間ID' />
              </div>
              <div className='col-6'>
                <InputField id='chargeRentalFeeSpace' name='chargeRentalFeeSpace' value={tempData.chargeRentalFeeSpace} onChange={handleChange} modified={modifiedFields.chargeRentalFeeSpace} label='場地費' />
                <InputField id='chargeRentalFeeClean' name='chargeRentalFeeClean' value={tempData.chargeRentalFeeClean} onChange={handleChange} modified={modifiedFields.chargeRentalFeeClean} label='清潔費' />
                <InputField id='chargeRentalFeePermission' name='chargeRentalFeePermission' value={tempData.chargeRentalFeePermission} onChange={handleChange} modified={modifiedFields.chargeRentalFeePermission} label='保證金' />
              </div>
            </div>
            <div className="mt-4">
              <p><strong>付費空間:</strong> 代表對應到哪一個付費空間</p>
              <p><strong>收費級別:</strong> 一級、二級、三級、四級</p>
              <p><strong>收費類別:</strong> 1代表白天，2代表晚上或是假日</p>
            </div>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-primary' style={{ backgroundColor: '#6789bb' }} onClick={submit}>儲存</button>
            <button type='button' className='btn btn-secondary' onClick={closeChargeModal}>關閉</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChargeModal;
