import React from 'react';

// InfoBox組件接受children, title, onClick等props
function InfoBox({ title, onClick, children, styles }) {
  return (
    <div
      style={styles.infoBox}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = styles.infoBoxHover.transform;
        e.currentTarget.style.boxShadow = styles.infoBoxHover.boxShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = styles.infoBox.boxShadow;
      }}
    >
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default InfoBox;
