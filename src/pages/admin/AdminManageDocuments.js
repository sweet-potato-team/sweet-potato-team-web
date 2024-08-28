import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from "axios";
import DocumentModal from "../../components/admin/DocumentModal";
import Pagination from "../../components/Pagination";
import ActionButtonsRentals from "../../components/admin/ActionButtonsRentals";
import { Modal } from "bootstrap";
import DeleteModal from "../../components/DeleteModal"; // 引入DeleteModal组件


function AdminManageDocuments() {
  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 5,
    offset: 0,
    total: 0,
    current_page: 1,
    total_pages: 1
  });
  const [type, setType] = useState('create');
  const [tempDocument, setTempDocument] = useState({});
  const [filter, setFilter] = useState({ key: '', value: '' });

  const documentModal = useRef(null);


  const getDocuments = useCallback(async () => {
    try {
      const params = {
        limit: pagination.limit,
        offset: pagination.offset,
        orderBy: 'document_id',
        sort: 'asc',
      };
      
      if (filter.key && filter.value) {
        params[filter.key] = filter.value;
      }
  
      // console.log("Fetching documents with params:", params);
  
      const documentRes = await axios.get(`http://localhost:8080/manage_documents`, { params });
  
      // console.log("Documents fetched:", documentRes.data);
  
      if (documentRes.data && Array.isArray(documentRes.data.results)) {
        const sortedDocuments = documentRes.data.results.sort((a, b) => a.documentId - b.documentId);
        setDocuments(sortedDocuments);
        setPagination((prevPagination) => ({
          ...prevPagination,
          total: documentRes.data.total,
          total_pages: Math.ceil(documentRes.data.total / pagination.limit),
        }));      
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    }
  }, [pagination.limit, pagination.offset, filter]);
  
  // 刪除處理 - 開始
  
  const [selectedDocumentId, setSelectedDocumentId] = useState(null); // 新增：用于存储要删除的文档ID
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 新增：控制DeleteModal的显示

  const openDeleteModal = (documentId) => {
    setSelectedDocumentId(documentId);
    setShowDeleteModal(true);
  };
  
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDocumentId(null);
  };
  
  const handleDelete = async (documentId) => {
    try {
      await axios.delete(`http://localhost:8080/manage_documents/${documentId}`);
      setDocuments((prevDocuments) => prevDocuments.filter(document => document.documentId !== documentId));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };
    // 刪除處理 - 結束
  
  useEffect(() => {
    documentModal.current = new Modal('#documentModal', { backdrop: 'static' });
    getDocuments();
  }, [getDocuments]);

  const openDocumentModal = (type, document) => {
    setType(type);
    setTempDocument(document);
    documentModal.current.show();
  };

  const closeDocumentModal = () => {
    documentModal.current.hide();
  };

  const changePage = (newPage) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      offset: (newPage - 1) * prevPagination.limit, 
      current_page: newPage 
    }));
    getDocuments(); 
  };

  const handleSearchSubmit = (selectedFilter, searchText) => {
    setFilter({ key: selectedFilter, value: searchText });
  };

  const handleSelectChange = (selectedKey) => {
    setFilter({ key: selectedKey, value: '' });
  };

  const documentOptions = [
    { value: 'documentName', label: '名稱' },
    { value: 'documentUrl', label: '網址' },
  ];

  return (
    <div className='p-3'>
      <DocumentModal
        closeDocumentModal={closeDocumentModal}
        getDocuments={() => getDocuments(pagination.current_page)}
        tempDocument={tempDocument}
        type={type}
      />
  
      {showDeleteModal && (
        <DeleteModal
          close={closeDeleteModal}
          text="確認刪除這一筆文件?"
          handleDelete={handleDelete}
          id={selectedDocumentId}
        />
      )}
  
      <div style={{ backgroundColor: '#D3E9FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0', width: '100%', position: 'relative' }}>
        <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
        <h3 style={{ textAlign: 'center', margin: '0' }}>
          <i className="bi bi-file-earmark-text me-2"></i> 文件列表
        </h3>
        <hr style={{ margin: '0 auto', borderTop: '3px solid #D3E9FF', width: '100%' }} />
      </div>
  
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <ActionButtonsRentals 
          onCreateClick={() => openDocumentModal('create', {})}
          onSearchSubmit={handleSearchSubmit}
          onSelectChange={handleSelectChange}
          options={documentOptions}
        />
      </div>
  
      <table className='table'>
        <thead>
          <tr>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF', width: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>編號</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF'}}>名稱</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>網址</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>最後修改日期</th>
            <th scope='col' style={{ textAlign: 'center', backgroundColor: '#D3E9FF' }}>編輯</th>
          </tr>
        </thead>
  
        <tbody>
          {documents.map((document) => (
            <tr key={document.documentId}>
              <td style={{ textAlign: 'center', width: '20px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{document.documentId}</td>
              <td style={{ textAlign: 'center' }}>{document.documentName}</td>
              <td style={{ textAlign: 'center' }}>
                {document.documentUrl.length > 15 ? (
                  <a href={document.documentUrl} target="_blank" rel="noopener noreferrer">
                    查看文件
                  </a>
                ) : (
                  document.documentUrl
                )}
              </td>
              <td style={{ textAlign: 'center' }}>{new Date(document.documentLastModifiedDate).toLocaleString()}</td>
              <td style={{ textAlign: 'center' }}>
                <button type='button' className='btn btn-sm me-2' style={{ color: '#A4B6A4', padding: '5px 10px', border: '1px solid #A4B6A4', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => openDocumentModal('edit', document)}><i className="bi bi-feather"></i></button>
                <button type='button' className='btn btn-sm' style={{ color: '#9B6A6A', padding: '5px 10px', border: '1px solid #AF9797', backgroundColor: 'white', borderRadius: '5px' }} onClick={() => openDeleteModal(document.documentId)}><i className="bi bi-trash3"></i></button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
      <Pagination pagination={pagination} changePage={changePage} />
    </div>
  );
  
}

export default AdminManageDocuments;

                // {/* <a href={document.documentUrl} target="_blank" rel="noopener noreferrer">
                //   查看文件
                // </a> */}
