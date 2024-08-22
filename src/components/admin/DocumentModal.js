import axios from "axios";
import { useContext, useEffect, useState, useMemo } from "react";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../../store/messageStore';

function DocumentModal({ closeDocumentModal, getDocuments, type, tempDocument }) {
  const initialData = useMemo(() => ({
    document_name: '',
    document_url: ''
  }), []);
  
  const [tempData, setTempData] = useState(initialData);
  const [modifiedFields, setModifiedFields] = useState({});

  const [, dispatch] = useContext(MessageContext);

  useEffect(() => {
    if (type === 'edit' && tempDocument) {
      setTempData({
        document_name: tempDocument.documentName || '',
        document_url: tempDocument.documentUrl || ''
      });
      setModifiedFields({});
    } else {
      setTempData(initialData);
      setModifiedFields({});
    }
  }, [type, tempDocument, initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setModifiedFields((prevFields) => ({
      ...prevFields,
      [name]: true,
    }));
  };

  const submit = async () => {
    try {
      const payload = {
        documentName: tempData.document_name,
        documentUrl: tempData.document_url
      };
  
      console.log('Payload:', payload);
  
      let api = `http://localhost:8080/manage_documents`;
      let method = 'post';
  
      if (type === 'edit' && tempDocument.documentId) {  
        api = `http://localhost:8080/manage_documents/${tempDocument.documentId}`;
        method = 'put';
      }
  
      const res = await axios({
        method: method,
        url: api,
        headers: {
          'Content-Type': 'application/json',
        },
        data: payload,
      });
  
      handleSuccessMessage(dispatch, res);
      closeDocumentModal();
      getDocuments();
    } catch (error) {
      console.error('API Error:', error); 
      handleErrorMessage(dispatch, error);
    }
  };

  return (
    <div className='modal fade' tabIndex='-1' id='documentModal' aria-labelledby='exampleModalLabel' aria-hidden='true'>
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header' style={{ backgroundColor: '#D3E9FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
            <h1 className='modal-title fs-5' id='exampleModalLabel' style={{ fontWeight: 'bold', margin: 0, flex: 1, textAlign: 'center', color: '#000000' }}>
              {type === 'create' ? '建立新文件' : '【文件編輯】'}
            </h1>
            <button type='button' className='btn-close' aria-label='Close' onClick={closeDocumentModal} style={{ marginLeft: 'auto' }} />
          </div>

          <div className='modal-body' style={{ padding: '20px' }}>
            <div className='form-group'>
              <label htmlFor='document_name'>文件名稱</label>
              <input 
                type='text' 
                id='document_name' 
                name='document_name' 
                value={tempData.document_name || ''} 
                onChange={handleChange} 
                className='form-control' 
                style={{ color: modifiedFields.document_name ? '#AC6A6A' : 'initial' }} 
              />
            </div>
            <div className='form-group' style={{ marginTop: '10px' }}>
              <label htmlFor='document_url'>文件網址</label>
              <input 
                type='text' 
                id='document_url' 
                name='document_url' 
                value={tempData.document_url || ''} 
                onChange={handleChange} 
                className='form-control' 
                style={{ color: modifiedFields.document_url ? '#AC6A6A' : 'initial' }} 
              />
            </div>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-primary' style={{ backgroundColor: '#6789bb' }} onClick={submit}>儲存</button>
            <button type='button' className='btn btn-secondary' onClick={closeDocumentModal}>關閉</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentModal;
