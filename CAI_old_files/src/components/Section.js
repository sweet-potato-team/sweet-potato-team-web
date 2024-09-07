import React, { forwardRef } from 'react';

// 使用 forwardRef 來讓 Section 組件支持 ref
const Section = forwardRef(({ title, backgroundColor, children }, ref) => {
  const sectionStyle = {
    backgroundColor,
    minHeight: '800px',
    padding: '80px 60px', // 加大 padding-top 保證標題不被遮住
    marginBottom: '10px',
    overflowX: 'auto', 
    whiteSpace: 'nowrap' ,
    // // padding: '20px', // 每個區塊內部增加 padding
    // marginTop: '20px',
  };

  const sectionStyle_child = {
    padding: '20px', // 每個區塊內部增加 padding
    marginTop: '20px',
  };
  
  return (
    <div ref={ref} style={sectionStyle}> {/* 將 ref 應用到這個 div 上 */}
      <h2>{title}</h2>

      <div style={sectionStyle_child}>
        {children}
      </div>
      
    </div>
  );
});

export default Section;
