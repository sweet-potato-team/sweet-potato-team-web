import React from 'react';
import '../../frontpage.css'; // 确保引入 CSS 文件

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#574938',
    color: '#EFEBE6',
    padding: '10px 0',
    textAlign: 'center',
    // width: '100%',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
  };

  return (
    <footer className="Footer" style={footerStyle}>
      <div>&copy; Sweet Potato 🍠</div>
      
    </footer>
  );
};

export default Footer;



// import React from 'react';

// function Footer() {
//   return (
//     <footer style={{ backgroundColor: '#333', padding: '10px', color: 'white', textAlign: 'center' }}>
//       © 2024 Your Company Name. All rights reserved.
//     </footer>
//   );
// }

// export default Footer;
