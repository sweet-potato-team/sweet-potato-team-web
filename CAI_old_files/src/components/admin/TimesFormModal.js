import React, { useEffect, useState, useMemo, useContext, useRef } from "react";
import axios from "axios";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../../store/messageStore';
import { Modal } from "bootstrap";

function TimesFormModal({ closeModal, type, tempTime, getManageFreeTimes }) {
  const [, dispatch] = useContext(MessageContext);
  const initialData = useMemo(() => ({
    free_space_id: "",
    space_rental_location: "",
    start_time: "",
    end_time: "",
    manage_status: "admin_blocked",
    space_rental_unit: "管理員",
  }), []);

  const [tempData, setTempData] = useState(initialData);
  const [locations, setLocations] = useState([]);
  const [modifiedFields, setModifiedFields] = useState({});

  const modalRef = useRef(null);

  useEffect(() => {
    modalRef.current = new Modal('#timesModal', { backdrop: 'static' });

    const fetchLocations = async () => {
      try {
        const res = await axios.get("http://localhost:8080/spaces");
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
    if (type === "edit" && tempTime) {
      const selectedLocation = locations.find(
        (location) => location.freeSpaceId === tempTime.freeSpaceId
      );
      setTempData({
        free_space_id: tempTime.freeSpaceId || "",
        space_rental_location: selectedLocation
          ? selectedLocation.freeSpaceName
          : "",
        start_time: tempTime.startTime ? tempTime.startTime.replace(' ', 'T').slice(0, 16) : "",
        end_time: tempTime.endTime ? tempTime.endTime.replace(' ', 'T').slice(0, 16) : "",
        manage_status: tempTime.manageStatus || "admin_blocked",
        space_rental_unit: tempTime.spaceRentalUnit || null,
      });
      setModifiedFields({});
    } else {
      setTempData(initialData);
      setModifiedFields({});
    }
    modalRef.current.show(); // 顯示模態框
  }, [type, tempTime, initialData, locations]);

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
    const { name, value } = e.target;
    setTempData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setModifiedFields((prevFields) => ({
      ...prevFields,
      [name]: true,
    }));
  };

  const validateFields = () => {
    const requiredFields = [
      { key: 'free_space_id', label: '空間編號' },
      { key: 'start_time', label: '開始時間' },
      { key: 'end_time', label: '結束時間' },
      { key: 'manage_status', label: '狀態' },
    ];

    for (let field of requiredFields) {
      if (!tempData[field.key]) {
        handleErrorMessage(dispatch, {
          response: { data: { message: `欄位 【${field.label}】 不能為空` } }
        });
        return false;
      }
    }

    const startTime = new Date(tempData.start_time);
    const endTime = new Date(tempData.end_time);

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

    // 檢查開始時間是否早於08:00
    const startHour = startTime.getHours();
    if (startHour < 8) {
      handleErrorMessage(dispatch, {
        response: { data: { message: '開始時間不能早於早上8點' } }
      });
      return false;
    }

    // 檢查結束時間是否晚於18:00
    const endHour = endTime.getHours();
    if (endHour > 18 || (endHour === 18 && endMinutes > 0)) { // 結束時間晚於18:00
      handleErrorMessage(dispatch, {
        response: { data: { message: '結束時間不能晚於下午6點' } }
      });
      return false;
    }

    return true;
  };



  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
  
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    console.log("Formatted Date: ", formattedDate); // 確認格式化後的時間
    return formattedDate;
  };
  
  const checkAvailability = async () => {
    try {
      const response = await axios.post("http://localhost:8080/manage_free_times/check_availability", {
        freeSpaceId: tempData.free_space_id,
        startTime: formatDate(tempData.start_time),  // 格式化開始時間
        endTime: formatDate(tempData.end_time),      // 格式化結束時間
        manageStatus: "admin_blocked"               // 預設為管理員鎖定狀態
      });
  
      if (response.data.status === 'unavailable') {
        handleErrorMessage(dispatch, {
          response: { data: { message: '該時段已有申請的租借紀錄，或是已經有相同時間段的鎖定時間了' } }
        });
        return false;
      }
  
      return true;
  
    } catch (error) {
      console.error("Error checking availability:", error);
      handleErrorMessage(dispatch, {
        response: { data: { message: '檢查時段可用性時發生錯誤，請稍後再試' } }
      });
      return false;
    }
  };
  

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }
  
    const isAvailable = await checkAvailability();
    if (!isAvailable) {
      return;
    }
  
    try {
      const payload = {
        freeSpaceId: tempData.free_space_id,
        startTime: formatDate(tempData.start_time),  // 格式化開始時間
        endTime: formatDate(tempData.end_time),      // 格式化結束時間
        manageStatus: "admin_blocked",              // 預設為管理員鎖定狀態
        spaceRentalUnit: tempData.space_rental_unit,
      };
  
      const api = type === "edit"
        ? `http://localhost:8080/manage_free_times/${tempTime.manageFreeTimeId}`
        : "http://localhost:8080/manage_free_times";
  
      const method = type === "edit" ? "put" : "post";
  
      await axios({
        method: method,
        url: api,
        headers: {
          "Content-Type": "application/json",
        },
        data: payload,
      });
  
      handleSuccessMessage(dispatch, "操作成功", `成功建立一筆 ${tempData.space_rental_location} 的鎖定時間`);
      handleCloseModal(); // 提交成功後關閉模態框
      if (typeof getManageFreeTimes === 'function') {
        getManageFreeTimes(); // 刷新數據列表
      }
    } catch (error) {
      console.error("API Error:", error);
  
      if (error.response) {
        console.log('错误响应内容:', error.response);
  
        let errorMessage = '請稍後再試';
  
        if (error.response.status === 400) {
          // 檢查後端是否返回了特定的錯誤消息
          errorMessage = error.response.data.message || '該時段的鎖定時間已有其他預約';
        }
  
        handleErrorMessage(dispatch, {
          response: {
            data: {
              message: errorMessage,
            },
          },
        });
      } else {
        handleErrorMessage(dispatch, {
          response: {
            data: {
              message: '請稍後再試',
            },
          },
        });
      }
    }
  };
  


  
  const handleCloseModal = () => {
    modalRef.current.hide(); // 隱藏模態框
    closeModal(); // 調用父組件傳入的關閉方法
  };

  return (
    <div className='modal fade' id='timesModal' tabIndex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header' style={{ backgroundColor: '#D3E9FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
            <h1 className='modal-title fs-5' id='exampleModalLabel' style={{ fontWeight: 'bold', margin: 0, flex: 1, textAlign: 'center', color: '#000000' }}>
              {type === "create" ? "建立鎖定時間" : "修改鎖定時間"}
            </h1>
            <button type='button' className='btn-close' aria-label='Close' onClick={handleCloseModal} style={{ marginLeft: 'auto' }} />
          </div>
          <div className='modal-body' style={{ padding: '20px' }}>
            <table className="table" style={{ borderSpacing: '10px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '30px' }}>
                    <div className="form-group">
                      <label htmlFor="space_rental_location">鎖定地點</label>
                      <select id="space_rental_location" name="space_rental_location" value={tempData.space_rental_location || ''} onChange={handleLocationChange} className="form-control" style={{ color: modifiedFields.space_rental_location ? '#AC6A6A' : 'initial' }}>
                        <option value="">選擇鎖定地點</option>
                        {Array.isArray(locations) && locations.map((location) => (
                          <option key={location.freeSpaceId} value={location.freeSpaceName}>{location.freeSpaceName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                      <label htmlFor="free_space_id">空間編號</label>
                      <input type="text" id="free_space_id" name="free_space_id" value={tempData.free_space_id || ''} onChange={handleChange} className="form-control" style={{ color: modifiedFields.free_space_id ? '#AC6A6A' : 'initial' }} disabled />
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                      <label htmlFor="start_time">開始時間</label>
                      <input type="datetime-local" id="start_time" name="start_time" value={tempData.start_time || ''} onChange={handleChange} className="form-control" style={{ color: modifiedFields.start_time ? '#AC6A6A' : 'initial' }} />
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                      <label htmlFor="end_time">結束時間</label>
                      <input type="datetime-local" id="end_time" name="end_time" value={tempData.end_time || ''} onChange={handleChange} className="form-control" style={{ color: modifiedFields.end_time ? '#AC6A6A' : 'initial' }} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='modal-footer' style={{ backgroundColor: '#F8F9FA', display: 'flex', justifyContent: 'space-between' }}>
            <button type='button' className='btn btn-primary' style={{ backgroundColor: '#6789bb' }} onClick={handleSubmit}>儲存</button>
            <button type='button' className='btn btn-secondary' onClick={handleCloseModal}>取消</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimesFormModal;
