import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div 
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backgroundBlendMode: 'overlay',
        padding: '20px',
      }}
    >
      <h2 
        className="fw-bold mb-5"
        style={{
          color: 'rgba(0, 0, 0)',
          fontSize: '2.5rem',
        }}
      >
        產學中心空間租借系統
      </h2>
      <div 
        className="d-flex justify-content-center align-items-center"
        style={{
          width: '100%',
          maxWidth: '700px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          padding: '40px',
        }}
      >
        <Link 
          to="products" 
          className="btn btn-primary btn-lg mx-3"
          style={{
            flex: 1,
            backgroundColor: '#D3E9FF',
            border: 'none',
            padding: '50px',
            borderRadius: '10px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#1565c0';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#D3E9FF';
            e.target.style.color = 'black';
          }}
        >
          付費空間
        </Link>
        <Link 
          to="spaces" 
          className="btn btn-primary btn-lg mx-3"
          style={{
            flex: 1,
            backgroundColor: '#D3E9FF',
            border: 'none',
            padding: '50px',
            borderRadius: '10px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#1565c0';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#D3E9FF';
            e.target.style.color = 'black';
          }}
        >
          免費空間
        </Link>
      </div>
      <div className="mt-5">
        <a 
          href="http://localhost:3000/#/login" 
          className="btn btn-dark btn-lg"
          style={{
            borderRadius: '10px',
            padding: '5px 15px',
            fontSize: '1rem',
          }}
        >
          管理員登入
        </a>
      </div>
    </div>
  );
}

export default Home;
