function Pagination({ pagination, changePage }) {
  return (
    <nav aria-label='Page navigation example'>
      <ul className='pagination'>
        {/* 上一頁按鈕 */}
        <li className={`page-item ${pagination.offset === 0 ? 'disabled' : ''}`}>
          <a
            href='/'
            aria-label='Previous'
            className='page-link'
            onClick={(e) => {
              e.preventDefault(); // 防止預設的超連結跳轉行為
              if (pagination.offset > 0) {
                changePage(pagination.current_page - 1); // 切換到上一頁
              }
            }}
          >
            <span aria-hidden='true'>&laquo;</span>
          </a>
        </li>
        {/* 中間的頁數按鈕 */}
        {[...new Array(pagination.total_pages)].map(
          (
            _, // 忽略第一個參數，因為我們只需要索引
            i, // 索引位置
          ) => (
            // 使用索引作為 key（這在實務中通常不推薦，這裡是為了簡單示範）
            <li className={`page-item ${pagination.current_page === i + 1 ? 'active' : ''}`} key={`${i}_page`}>
              <a
                className='page-link'
                href='/'
                onClick={(e) => {
                  e.preventDefault(); // 防止預設的超連結跳轉行為
                  changePage(i + 1); // 切換到所點擊的頁數
                }}
              >
                {i + 1} {/* 顯示頁數 */}
              </a>
            </li>
          ),
        )}
        {/* 下一頁按鈕 */}
        <li className={`page-item ${pagination.offset + pagination.limit >= pagination.total ? 'disabled' : ''}`}>
          <a
            className='page-link'
            href='/'
            aria-label='Next'
            onClick={(e) => {
              e.preventDefault(); // 防止預設的超連結跳轉行為
              if (pagination.offset + pagination.limit < pagination.total) {
                changePage(pagination.current_page + 1); // 切換到下一頁
              }
            }}
          >
            <span aria-hidden='true'>&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
