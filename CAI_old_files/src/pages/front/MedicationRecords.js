import React from 'react';

function MedicationRecords({ userId }) {  // 接收 userId 作為 props
  return (
    <div>
      <h2>這是服藥紀錄頁面</h2>
      <p>使用者ID: {userId}</p>  {/* 用 <p> 標籤顯示 userId */}
    </div>
  );
}

export default MedicationRecords;
