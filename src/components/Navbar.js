import { NavLink } from "react-router-dom"; 
// 從 react-router-dom 庫中導入 NavLink 組件，用於在應用中創建導航鏈接。

function Navbar({ cartData }) { 
  // 定義一個名為 Navbar 的 React 函數組件，它接收一個 props 'cartData'。

  return (
    <div className='bg-white sticky-top'> 
      {/* 一個頂部固定的 div 元素，背景色為白色。 */}
      <div className='container'>
        {/* 包裹內容的 container，通常用於設置內容的最大寬度並進行居中對齊。 */}
        <nav className='navbar px-0 navbar-expand-lg navbar-light bg-white'>
          {/* 定義一個導航欄元素，使用 Bootstrap 類來進行樣式設置，例如 navbar-light 和 bg-white。 */}
          
          <NavLink
            className='navbar-brand position-absolute' 
            to='/'
            style={{
              left: '50%',
              transform: 'translate(-50%, -50%)',
              top: '50%',
            }}
          >
             <img src="http://www.iic.ncu.edu.tw/images/logo.png" alt="產學營運中心空間租借系統" style={{ maxHeight: '100%', maxWidth: '100%' }} />
          </NavLink>
          {/* 創建一個指向首頁的品牌名稱的鏈接，這個鏈接使用了 position-absolute 來絕對定位在導航欄的中央。 */}

          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          {/* 導航欄的折疊按鈕，在小屏幕設備上顯示，使用了 Bootstrap 的功能來控制折疊/展開。 */}

          <div
            className='collapse navbar-collapse bg-white custom-header-md-open'
            id='navbarNav'
          >
            <ul className='navbar-nav'>
              <li className='nav-item active'>
                <NavLink className='nav-link ps-0' to='/products'>
                  產品列表
                </NavLink>
              </li>
              <li className='nav-item active'>
                <NavLink className='nav-link ps-0' to='/space'>
                  空間列表
                </NavLink>
              </li>
              {/* 導航欄中的產品列表鏈接，當前頁面時會被標記為 active。 */}
            </ul>
          </div>

          <div className='d-flex'>
            <NavLink to='/cart' className='nav-link position-relative'>
              <i className='bi bi-bag-fill'></i>
              {/* 購物車圖標，使用了 Bootstrap Icons。 */}
              {cartData?.carts?.length !== 0 && (
                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                  {cartData?.carts?.length}
                </span>
              )}
            </NavLink>
            {/* 如果購物車中有商品，顯示紅色徽章，顯示購物車中商品的數量。這裡使用了條件渲染和 Bootstrap 樣式進行布局。 */}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
// 將 Navbar 組件導出，供其他模塊導入使用。
