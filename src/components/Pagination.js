function Pagination({ pagination, changePage }) {
  return (
    <nav aria-label='Page navigation example' className='d-flex justify-content-center'>
      <ul className='pagination justify-content-center'>
        {/* 上一页按钮 */}
        <li className={`page-item ${pagination.offset === 0 ? 'disabled' : ''}`}>
          <a
            href='/'
            aria-label='Previous'
            className='page-link'
            onClick={(e) => {
              e.preventDefault();
              if (pagination.offset > 0) {
                changePage(pagination.current_page - 1);
              }
            }}
            style={{ color: '#6096BA' }}
          >
            <span aria-hidden='true'>&laquo;</span>
          </a>
        </li>
        {/* 中间的页数按钮 */}
        {[...new Array(pagination.total_pages)].map((_, i) => (
          <li className={`page-item ${pagination.current_page === i + 1 ? 'active' : ''}`} key={`${i}_page`}>
            <a
              className='page-link'
              href='/'
              onClick={(e) => {
                e.preventDefault();
                changePage(i + 1);
              }}
              style={{ color: pagination.current_page === i + 1 ? '#fff' : '#6096BA', backgroundColor: pagination.current_page === i + 1 ? '#6096BA' : '#fff', borderColor: '#6096BA' }}
            >
              {i + 1}
            </a>
          </li>
        ))}
        {/* 下一页按钮 */}
        <li className={`page-item ${pagination.offset + pagination.limit >= pagination.total ? 'disabled' : ''}`}>
          <a
            className='page-link'
            href='/'
            aria-label='Next'
            onClick={(e) => {
              e.preventDefault();
              if (pagination.offset + pagination.limit < pagination.total) {
                changePage(pagination.current_page + 1);
              }
            }}
            style={{ color: '#6096BA' }}
          >
            <span aria-hidden='true'>&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
