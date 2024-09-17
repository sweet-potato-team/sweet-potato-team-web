import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('https://sweetpotatobro.taiwan.idv.tw/api/sysUsers')
      .then(response => setUsers(response.data))
      .catch(error => {
        console.error(error);
        // 當請求失敗時，設置一筆假資料
        setUsers([{
          sysUserId: 1,
          userName: '預設用戶',
          userGender: '男',
          userAge: 30
        }]);
      });
  }, []);

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
    padding: '20px',
  };

  return (
    <div style={containerStyle}>
      {users.map(user => (
        <Card
          key={user.sysUserId}
          imageSrc="https://plus.unsplash.com/premium_photo-1661600719400-d537c4981818?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGF0aWVudHxlbnwwfHwwfHx8MA%3D%3D" 
          title={user.userName}
          subtitle={user.userGender}
          description={`${user.userAge} 歲`}
        />
      ))}
    </div>
  );
};

export default AllUsers;
