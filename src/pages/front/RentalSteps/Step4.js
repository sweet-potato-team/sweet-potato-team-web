import React, { useEffect } from 'react';

function Step4({ rentalData }) {
  const containerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#28a745',
  };

  const buttonStyle = {
    minWidth: '120px',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#28a745',
    borderColor: '#28a745',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '2rem',
  };

  useEffect(() => {
    const postData = async () => {
      try {
        const response = await fetch('http://localhost:8080/spaceRentals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            spaceRentalUnit: rentalData.unit,
            spaceRentalLocation: rentalData.location,
            spaceRentalDateTime: rentalData.dateTime,
            spaceRentalPhone: rentalData.phone,
            spaceRentalEmail: rentalData.email,
            spaceRentalReason: rentalData.reason,
            spaceRentalRenter: rentalData.renter,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        console.log('Data submitted successfully');
      } catch (error) {
        console.error('Error:', error);
      }
    };

    postData();
  }, [rentalData]);

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>申請成功</h2>
      <p>已將預約資料送至所填寫之郵箱，請查收並等待管理員審核。</p>
      <button style={buttonStyle}>確認</button>
    </div>
  );
}

export default Step4;
