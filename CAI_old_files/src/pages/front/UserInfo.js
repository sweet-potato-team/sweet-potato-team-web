import React, { useState, useEffect } from 'react';
import { storage, ref, listAll, getDownloadURL, getMetadata } from '../../firebase'; // 確保正確匯入所需的 Firebase 函數
import Loading from '../../components/Loading';  // 引入自定義的 Loading 組件

function UserInfo({ userId }) {
  const [imageUrl, setImageUrl] = useState('');
  const [uploadTime, setUploadTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);  // 加入 isLoading 狀態
  const [hover, setHover] = useState(false); // 用於 hover 效果

  useEffect(() => {
    console.log('Component is mounted and userId is received:', userId);
    if (!userId) return; // 如果沒有 userId，則直接返回

    const fetchUserImage = async () => {
      try {
        const listRef = ref(storage, `${userId}/`);  // 使用者ID作為資料夾名稱
        // console.log('Attempting to list all files in:', listRef.fullPath); // 確認資料夾路徑

        // 列出該資料夾中的所有檔案
        const listResult = await listAll(listRef);
        const files = listResult.items;

        // 過濾出檔案名稱以 "2_2_1_Personal_Information" 開頭的檔案
        const targetFile = files.find(file => file.name.startsWith('2_2_1_Personal_Information'));

        if (targetFile) {
          // 如果找到符合的檔案，取得其下載 URL
          const publicUrl = await getDownloadURL(targetFile);
          setImageUrl(publicUrl);
          // console.log("【Found image URL】:", publicUrl);

          // 取得檔案的元數據 (metadata)
          const metadata = await getMetadata(targetFile);
          const uploadTimeFormatted = new Date(metadata.timeCreated).toLocaleString(); // 格式化時間
          setUploadTime(uploadTimeFormatted);
        } else {
          console.log("No image found with the specified prefix.");
        }
      } catch (error) {
        console.error("【Error fetching the image】:", error);
      } finally {
        setIsLoading(false); // 圖片加載完成，停止顯示 Loading
      }
    };

    fetchUserImage();
  }, [userId]);

  // 定義樣式
  const styles = {
    container: {
      width: '750px',  // 容器寬度
      height: '425px',  // 容器高度
      backgroundColor: '#f0f0f0',  // 背景色
      border: '1px solid #ccc',  // 邊框
      borderRadius: '10px',  // 圓角
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 auto',
      boxShadow: hover ? '8px 8px 15px rgba(0, 0, 0, 0.3)' : '4px 4px 6px rgba(0, 0, 0, 0.2)', // 陰影效果
      transition: 'transform 0.3s, box-shadow 0.3s',  // 動畫效果
      transform: hover ? 'scale(1.05)' : 'scale(1)',  // 放大效果
    },
    imageWrapper: {
      width: '98%',  // 圖片容器寬度 98%
      height: 'auto',
      display: 'flex',
      justifyContent: 'center',
    },
    image: {
      width: '100%',  // 圖片寬度 100% 視乎 imageWrapper
      height: 'auto',
      maxHeight: '80%',  // 圖片高度限制在容器的 80%
      borderRadius: '8px',
    },
    uploadInfo: {
      marginBottom: '20px',
      color: '#574938'
    },
  };

  return (
    <div>
      <h3 style={styles.uploadInfo}>以下為近期上傳的名片資訊</h3>
      <h3 style={styles.uploadInfo}>上傳時間: {uploadTime}</h3>
      {isLoading ? (  // 如果正在加載，顯示 Loading 組件
        <Loading isLoading={isLoading} />
      ) : imageUrl ? (
        <div
          style={styles.container}
          onMouseEnter={() => setHover(true)}  // 滑鼠進入時啟用 hover 效果
          onMouseLeave={() => setHover(false)}  // 滑鼠離開時禁用 hover 效果
        >
          <div style={styles.imageWrapper}>
            <img src={imageUrl} alt="User" style={styles.image} />
          </div>
        </div>
      ) : (
        <p>No image available</p>  // 如果沒有圖片，顯示提示文字
      )}
    </div>
  );
}

export default UserInfo;


// import React, { useState, useEffect } from 'react';
// import { storage, ref, listAll, getDownloadURL, getMetadata } from '../../firebase'; // 確保正確匯入所需的 Firebase 函數

// function UserInfo({ userId }) {
//   const [imageUrl, setImageUrl] = useState('');
//   const [uploadTime, setUploadTime] = useState('');
//   const [hover, setHover] = useState(false); // 用於 hover 效果

//   useEffect(() => {
//     console.log('Component is mounted and userId is received:', userId);
//     if (!userId) return; // 如果沒有 userId，則直接返回

//     const fetchUserImage = async () => {
//       try {
//         const listRef = ref(storage, `${userId}/`);  // 使用者ID作為資料夾名稱
//         console.log('Attempting to list all files in:', listRef.fullPath); // 確認資料夾路徑

//         // 列出該資料夾中的所有檔案
//         const listResult = await listAll(listRef);
//         const files = listResult.items;

//         // 過濾出檔案名稱以 "2_2_1_Personal_Information" 開頭的檔案
//         const targetFile = files.find(file => file.name.startsWith('2_2_1_Personal_Information'));

//         if (targetFile) {
//           // 如果找到符合的檔案，取得其下載 URL
//           const publicUrl = await getDownloadURL(targetFile);
//           setImageUrl(publicUrl);
//           console.log("【Found image URL】:", publicUrl);

//           // 取得檔案的元數據 (metadata)
//           const metadata = await getMetadata(targetFile);
//           const uploadTimeFormatted = new Date(metadata.timeCreated).toLocaleString(); // 格式化時間
//           setUploadTime(uploadTimeFormatted);

//         } else {
//           console.log("No image found with the specified prefix.");
//         }
//       } catch (error) {
//         console.error("【Error fetching the image】:", error);
//       }
//     };

//     fetchUserImage();
//   }, [userId]);

//   // 定義樣式
//   const styles = {
//     container: {
//       width: '750px',  // 容器寬度
//       height: '425px',  // 容器高度
//       backgroundColor: '#f0f0f0',  // 背景色
//       border: '1px solid #ccc',  // 邊框
//       borderRadius: '10px',  // 圓角
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       margin: '0 auto',
//       boxShadow: hover ? '8px 8px 15px rgba(0, 0, 0, 0.3)' : '4px 4px 6px rgba(0, 0, 0, 0.2)', // 陰影效果
//       transition: 'transform 0.3s, box-shadow 0.3s',  // 動畫效果
//       transform: hover ? 'scale(1.05)' : 'scale(1)',  // 放大效果
//     },
//     imageWrapper: {
//       width: '98%',  // 圖片容器寬度 80%
//       height: 'auto',
//       display: 'flex',
//       justifyContent: 'center',
//     },
//     image: {
//       width: '100%',  // 圖片寬度 100% 視乎 imageWrapper
//       height: 'auto',
//       maxHeight: '80%',  // 圖片高度限制在容器的 80%
//       borderRadius: '8px',
//     },
//     uploadInfo: {
//       // textAlign: 'center',
//       marginBottom: '20px',
//       color: '#574938'
//     },
//   };

//   return (
//     <div>
//       <h3 style={styles.uploadInfo}>以下為近期上傳的名片資訊</h3>
//       <h3 style={styles.uploadInfo}>上傳時間: {uploadTime}</h3>
//       {imageUrl ? (
//         <div
//           style={styles.container}
//           onMouseEnter={() => setHover(true)}  // 滑鼠進入時啟用 hover 效果
//           onMouseLeave={() => setHover(false)}  // 滑鼠離開時禁用 hover 效果
//         >
//           <div style={styles.imageWrapper}>
//             <img src={imageUrl} alt="User" style={styles.image} />
//           </div>
//         </div>
//       ) : (
//         <p>Loading image...</p>
//       )}
//     </div>
//   );
// }

// export default UserInfo;