import axios from "axios";
import { useContext, useEffect, useState, useMemo } from "react";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../../store/messageStore';

function ChargeModal({ closeChargeModal, getCharges, type, tempCharge }) {
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

  const validateInput = () => {
    for (const [key, value] of Object.entries(tempData)) {
      if (key !== 'paidSpaceId' && (value === '' || isNaN(value))) {
        return `欄位 ${key} 必須是數字且不能為空`;
      }
    }
    return null;
  };

  const checkPaidSpaceIdExists = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/paid_spaces/${tempData.paidSpaceId}`);
      return res.status === 200;
    } catch (error) {
      return false;
    }
  };

  const submit = async () => {
    try {
      const validationError = validateInput();
      if (validationError) {
        handleErrorMessage(dispatch, { response: { data: { message: validationError } } });
        return;
      }

      const isPaidSpaceIdValid = await checkPaidSpaceIdExists();
      if (!isPaidSpaceIdValid) {
        handleErrorMessage(dispatch, { response: { data: { message: '付費空間ID不存在，請確認後再提交' } } });
        return;
      }

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
                <div className='form-group' style={{ marginBottom: '15px' }}>
                  <label htmlFor='chargeLevel'>收費等級</label>
                  <input type='number' id='chargeLevel' name='chargeLevel' value={tempData.chargeLevel} onChange={handleChange} className='form-control' style={{ color: modifiedFields.chargeLevel ? '#AC6A6A' : 'initial' }} />
                </div>
                <div className='form-group' style={{ marginBottom: '15px' }}>
                  <label htmlFor='chargeCategory'>收費類別</label>
                  <input type='number' id='chargeCategory' name='chargeCategory' value={tempData.chargeCategory} onChange={handleChange} className='form-control' style={{ color: modifiedFields.chargeCategory ? '#AC6A6A' : 'initial' }} />
                </div>
                <div className='form-group' style={{ marginBottom: '15px' }}>
                  <label htmlFor='paidSpaceId'>付費空間ID</label>
                  <input type='number' id='paidSpaceId' name='paidSpaceId' value={tempData.paidSpaceId} onChange={handleChange} className='form-control' style={{ color: modifiedFields.paidSpaceId ? '#AC6A6A' : 'initial' }} />
                </div>
              </div>
              <div className='col-6'>
                <div className='form-group' style={{ marginBottom: '15px' }}>
                  <label htmlFor='chargeRentalFeeSpace'>場地費</label>
                  <input type='number' id='chargeRentalFeeSpace' name='chargeRentalFeeSpace' value={tempData.chargeRentalFeeSpace} onChange={handleChange} className='form-control' style={{ color: modifiedFields.chargeRentalFeeSpace ? '#AC6A6A' : 'initial' }} />
                </div>
                <div className='form-group' style={{ marginBottom: '15px' }}>
                  <label htmlFor='chargeRentalFeeClean'>清潔費</label>
                  <input type='number' id='chargeRentalFeeClean' name='chargeRentalFeeClean' value={tempData.chargeRentalFeeClean} onChange={handleChange} className='form-control' style={{ color: modifiedFields.chargeRentalFeeClean ? '#AC6A6A' : 'initial' }} />
                </div>
                <div className='form-group' style={{ marginBottom: '15px' }}>
                  <label htmlFor='chargeRentalFeePermission'>保證金</label>
                  <input type='number' id='chargeRentalFeePermission' name='chargeRentalFeePermission' value={tempData.chargeRentalFeePermission} onChange={handleChange} className='form-control' style={{ color: modifiedFields.chargeRentalFeePermission ? '#AC6A6A' : 'initial' }} />
                </div>
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
