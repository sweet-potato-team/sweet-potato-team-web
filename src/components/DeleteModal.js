import React, { useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';

function DeleteModal({ close, text, handleDelete, id }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const modal = new Modal(modalRef.current, { backdrop: 'static' });
    modal.show();
    return () => {
      modal.hide();
    };
  }, []);

  return (
    <div
      ref={modalRef}
      className="modal fade"
      tabIndex="-1"
      id="deleteModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: '#AC6A6A' }}>
            <h1 className="modal-title text-white fs-5" id="exampleModalLabel">
              刪除確認
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={close}
            />
          </div>
          <div className="modal-body">{text}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={close}>
              取消
            </button>
            <button
              type="button"
              className="btn"
              style={{ backgroundColor: '#AC6A6A', color: 'white' }}
              onClick={() => handleDelete(id)}
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
