import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get('/api/doctors')
      .then(response => setDoctors(response.data))
      .catch(error => {
        console.error(error);
        // 當請求失敗時，設置一筆假資料
        setDoctors([{
          doctorId: 1,
          doctorName: '預設醫生',
          specialization: '骨科',
          hospital: '台灣大醫院'
        }]);
      });
  }, []);

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: '20px',
  };

  return (
    <div style={containerStyle}>
      {doctors.map(doctor => (
        <Card
          key={doctor.doctorId}
          imageSrc="https://plus.unsplash.com/premium_photo-1658506671316-0b293df7c72b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  // 這裡替換為實際圖片路徑
          title={doctor.doctorName}
          subtitle={doctor.specialization}
          description={doctor.hospital}
        />
      ))}
    </div>
  );
};

export default AllDoctors;
