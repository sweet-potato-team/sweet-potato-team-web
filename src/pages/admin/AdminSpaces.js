import { useEffect, useRef, useState, useContext } from 'react';
import axios from "axios";
import SpaceModal from "../../components/SpaceModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../../store/messageStore';

function AdminSpaces() {
  const [spaces, setSpaces] = useState([]); // 設定空間列表的狀態
  const [pagination, setPagination] = useState({
    limit: 5, // 每頁顯示的數量
    offset: 0, // 當前頁面的起始點
    total: 0,  // 總資料量
    current_page: 1,
    total_pages: 1
  }); // 設定分頁資訊的狀態
  const [type, setType] = useState('create'); // 預設為新增模式
  const [tempSpace, setTempSpace] = useState({}); // 暫存選中的空間資料
  const [, dispatch] = useContext(MessageContext); // 使用訊息上下文來顯示成功或錯誤訊息

  const spaceModal = useRef(null); // 參考空間模態框的 DOM 元素
  const deleteModal = useRef(null); // 參考刪除模態框的 DOM 元素

  useEffect(() => {
    spaceModal.current = new Modal('#spaceModal', {
      backdrop: 'static',
    });
    deleteModal.current = new Modal('#deleteModal', {
      backdrop: 'static',
    });

    getSpaces(); // 元件掛載時呼叫函式來獲取空間列表
  }, []);

  const getSpaces = async (page = 1) => {
    const newOffset = (page - 1) * pagination.limit;
    try {
      const spaceRes = await axios.get(`http://localhost:8080/spaces`, {
        params: {
          limit: pagination.limit,
          offset: newOffset,
        },
      });
      if (spaceRes.data && Array.isArray(spaceRes.data.results)) {
        setSpaces(spaceRes.data.results);
        setPagination({
          ...pagination,
          offset: newOffset,
          total: spaceRes.data.total,
          current_page: page,
          total_pages: Math.ceil(spaceRes.data.total / pagination.limit),
        });
      } else {
        setSpaces([]); // 如果資料格式不符合預期，設置為空陣列
      }
    } catch (error) {
      console.error("Error fetching spaces:", error);
      setSpaces([]); // 如果發生錯誤，設置為空陣列以避免 map 出錯
    }
  }

  const openSpaceModal = (type, space) => {
    setType(type);
    setTempSpace(space);
    spaceModal.current.show();
  }
  
  const closeSpaceModal = () => {
    spaceModal.current.hide();
  }

  const openDeleteModal = (space) => {
    setTempSpace(space);
    deleteModal.current.show();
  };
  
  const closeDeleteModal = () => {
    deleteModal.current.hide();
  };
  
  const deleteSpace = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8080/spaces/${id}`);
      if (res.data.success) {
        getSpaces(pagination.current_page); // 刪除成功後重新獲取當前頁空間列表
        handleSuccessMessage(dispatch, res);
        deleteModal.current.hide();
      }
    } catch (error) {
      console.log(error);
      handleErrorMessage(dispatch, error);
    }
  }

  const changePage = (newPage) => {
    getSpaces(newPage);
  }

  return (
    <div className='p-3'>
      <SpaceModal
        closeSpaceModal={closeSpaceModal}
        getSpaces={() => getSpaces(pagination.current_page)}
        tempSpace={tempSpace}
        type={type}
      />
      <DeleteModal
        close={closeDeleteModal}
        text={tempSpace.spaceName} // 修改對應的欄位名稱
        handleDelete={deleteSpace}
        id={tempSpace.spaceId} // 修改對應的欄位名稱
      />
      <h3>空間列表</h3>
      <hr />
      <div className='text-end'>
        <button
          type='button'
          className='btn btn-primary btn-sm'
          onClick={() => openSpaceModal('create', {})}
        >
          建立新空間
        </button>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>名稱</th>
            <th scope='col'>位置</th>
            <th scope='col'>平面圖連結</th>
            <th scope='col'>照片連結</th>
            <th scope='col'>容納人數</th>
            <th scope='col'>網路</th>
            <th scope='col'>聲音輸入</th>
            <th scope='col'>顯示訊號輸入</th>
            <th scope='col'>設施</th>
            <th scope='col'>空間概述</th>
            <th scope='col'>啟用狀態</th>
            <th scope='col'>編輯</th>
          </tr>
        </thead>
        <tbody>
          {spaces.map((space) => (
            <tr key={space.spaceId}> {/* 修改對應的欄位名稱 */}
              <td>{space.spaceName}</td> {/* 修改對應的欄位名稱 */}
              <td>{space.spaceLocation}</td> {/* 修改對應的欄位名稱 */}
              <td><a href={space.floorPlanUrl} target="_blank" rel="noopener noreferrer">查看平面圖</a></td> {/* 修改對應的欄位名稱 */}
              <td><a href={space.photoUrl} target="_blank" rel="noopener noreferrer">查看照片</a></td> {/* 修改對應的欄位名稱 */}
              <td>{space.capacity}</td>
              <td>{space.internetAvailable ? '是' : '否'}</td> {/* 修改對應的欄位名稱 */}
              <td>{space.audioInputAvailable ? '是' : '否'}</td> {/* 修改對應的欄位名稱 */}
              <td>{space.videoInputAvailable ? '是' : '否'}</td> {/* 修改對應的欄位名稱 */}
              <td>{space.facilities}</td>
              <td>{space.spaceOverview}</td> {/* 修改對應的欄位名稱 */}
              <td>{space.isActive ? '啟用' : '未啟用'}</td> {/* 修改對應的欄位名稱 */}
              <td>
                <button
                  type='button'
                  className='btn btn-primary btn-sm'
                  onClick={() => openSpaceModal('edit', space)}
                >
                  編輯
                </button>
                <button
                  type='button'
                  className='btn btn-outline-danger btn-sm ms-2'
                  onClick={() => openDeleteModal(space)}
                >
                  刪除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={changePage} /> {/* 傳遞分頁資訊和切換頁面函式 */}
    </div>
  );
}

export default AdminSpaces;
