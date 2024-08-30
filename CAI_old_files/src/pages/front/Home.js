import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (

    <div 
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{
        position: 'relative', // Added to position the ::before element
        overflow: 'hidden',   // Ensures the blur effect does not exceed the boundaries
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          
        // backgroundImage: 'url(https://i.imgur.com/c5atvXd.jpeg)', // 淺藍
        // backgroundImage: 'url(https://i.imgur.com/9J5QjuE.jpeg)',  // 黃
        backgroundImage: 'url(https://i.imgur.com/WM6qF5Z.jpeg)',  // 黃+藍

          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)', // Apply blur effect to the background image
          zIndex: -1,
        }}
      />

      <div 
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ width: '100%', maxWidth: '900px', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', padding: '40px', textAlign: 'center' }}
      >
        <h2 className="fw-bold mb-5" style={{ color: '#415A77', fontSize: '3rem' }}>
          產學中心空間租借
        </h2>
        <div className="d-flex justify-content-center align-items-center mb-3" style={{ width: '100%' }}>
          <Link 
            to="paid_spaces" 
            className="btn btn-primary btn-lg mx-4" 
            style={{ flex: 1, backgroundColor: '#D3E9FF', border: 'none', padding: '60px', borderRadius: '10px', fontSize: '1.7rem', fontWeight: 'bold', color: '#415A77', transition: 'background-color 0.3s, color 0.3s' }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#6096BA'; e.target.style.color = 'white'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#D3E9FF'; e.target.style.color = '#415A77'; }}
          >
            付費空間
          </Link>
          <Link 
            to="spaces" 
            className="btn btn-primary btn-lg mx-4" 
            style={{ flex: 1, backgroundColor: '#D3E9FF', border: 'none', padding: '60px', borderRadius: '10px', fontSize: '1.7rem', fontWeight: 'bold', color: '#415A77', transition: 'background-color 0.3s, color 0.3s' }}
            onMouseOver={(e) => { e.target.style.backgroundColor = '#6096BA'; e.target.style.color = 'white'; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = '#D3E9FF'; e.target.style.color = '#415A77'; }}
          >
            免費空間
          </Link>
        </div>
      </div>
      <div className="mt-5">
        <a 
          href="http://localhost:3000/#/login" 
          className="btn btn-lg"
          style={{ borderRadius: '15px', padding: '10px 20px', fontSize: '1.2rem', backgroundColor: '#6096BA', color: 'white', fontWeight: 'bold', transition: 'background-color 0.3s, color 0.3s' }}
          onMouseOut={(e) => { e.target.style.backgroundColor = '#6096BA'; e.target.style.color = 'white'; }}
          onMouseOver={(e) => { e.target.style.backgroundColor = '#D3E9FF'; e.target.style.color = '#415A77'; }}
        >
          管理員登入
        </a>
      </div>
    </div>
  );
}

export default Home;
