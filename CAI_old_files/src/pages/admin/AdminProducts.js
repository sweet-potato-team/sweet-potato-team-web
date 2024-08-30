import { useEffect, useRef, useState, useContext } from 'react';
import axios from "axios";
import ProductModal from "../../components/ProductModal";
import DeleteModal from "../../components/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from '../../store/messageStore';

function AdminProducts() {
  const [products, setProducts] = useState([]); // 設定產品列表的狀態
  const [pagination, setPagination] = useState({}); // 設定分頁資訊的狀態
  // type: 決定模態框的用途 (新增或編輯)
  const [type, setType] = useState('create'); // 預設為新增模式
  const [tempProduct, setTempProduct] = useState({}); // 暫存選中的產品資料
  const [, dispatch] = useContext(MessageContext); // 使用訊息上下文來顯示成功或錯誤訊息

  const productModal = useRef(null); // 參考產品模態框的 DOM 元素
  const deleteModal = useRef(null); // 參考刪除模態框的 DOM 元素
  useEffect(() => {
    // 初始化模態框並設定靜態背景
    productModal.current = new Modal('#productModal', {
      backdrop: 'static',
    });
    deleteModal.current = new Modal('#deleteModal', {
      backdrop: 'static',
    });

    getProducts(); // 元件掛載時呼叫函式來獲取產品列表
  }, []);

  // 獲取產品列表和分頁資訊的函式
  const getProducts = async (page = 1) => {
    const productRes = await axios.get(
      `/v2/api/${process.env.REACT_APP_API_PATH}/admin/products?page=${page}`, // 發送 GET 請求，根據頁碼獲取資料
    );
    console.log(productRes);
    setProducts(productRes.data.products); // 更新產品列表狀態
    setPagination(productRes.data.pagination); // 更新分頁資訊狀態
  }

  // 開啟產品模態框，決定是新增還是編輯模式
  const openProductModal = (type, product) => {
    setType(type); // 設定操作類型
    setTempProduct(product); // 將選中的產品資料存入狀態
    productModal.current.show(); // 顯示模態框
  }
  
  // 關閉產品模態框
  const closeProductModal = () => {
    productModal.current.hide(); // 隱藏模態框
  }

  // 開啟刪除確認模態框
  const openDeleteModal = (product) => {
    setTempProduct(product); // 將選中的產品資料存入狀態
    deleteModal.current.show(); // 顯示刪除模態框
  };
  
  // 關閉刪除確認模態框
  const closeDeleteModal = () => {
    deleteModal.current.hide(); // 隱藏刪除模態框
  };
  
  // 刪除產品的函式
  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${id}`); // 發送 DELETE 請求刪除產品
      if (res.data.success) {
        getProducts(); // 刪除成功後重新獲取產品列表
        handleSuccessMessage(dispatch, res); // 顯示成功訊息
        deleteModal.current.hide(); // 隱藏刪除模態框
      }
    } catch (error) {
      console.log(error);
      handleErrorMessage(dispatch, error); // 顯示錯誤訊息
    }
  }

  return (
    <div className='p-3'>
      <ProductModal
        closeProductModal={closeProductModal} // 傳遞關閉產品模態框的函式
        getProducts={getProducts} // 傳遞重新獲取產品列表的函式
        tempProduct={tempProduct} // 傳遞暫存的產品資料
        type={type} // 傳遞操作類型 (新增或編輯)
      />
      <DeleteModal
        close={closeDeleteModal} // 傳遞關閉刪除模態框的函式
        text={tempProduct.title} // 傳遞要刪除的產品名稱
        handleDelete={deleteProduct} // 傳遞刪除操作函式
        id={tempProduct.id} // 傳遞要刪除的產品 ID
      />
      <h3>產品列表</h3>
      <hr />
      <div className='text-end'>
        <button
          type='button'
          className='btn btn-primary btn-sm'
          onClick={() => openProductModal('create', {})} // 點擊按鈕以新增新產品
        >
          建立新商品
        </button>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>分類</th>
            <th scope='col'>名稱</th>
            <th scope='col'>租金</th>
            <th scope='col'>啟用狀態</th>
            <th scope='col'>編輯</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            return (
              <tr key={product.id}>
                <td>{product.category}</td>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                <td>
                  <button
                    type='button'
                    className='btn btn-primary btn-sm'
                    onClick={() => openProductModal('edit', product)} // 點擊按鈕以編輯產品
                  >
                    編輯
                  </button>
                  <button
                    type='button'
                    className='btn btn-outline-danger btn-sm ms-2'
                    onClick={() => openDeleteModal(product)} // 點擊按鈕以刪除產品
                  >
                    刪除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={getProducts} /> {/* 傳遞分頁資訊和切換頁面函式 */}
    </div>
  );
}

export default AdminProducts;
