import React from 'react';
import styled from 'styled-components';

// 定義 NavBar 和相關樣式
const NavBarContainer = styled.nav`
  background-color: #574938;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Spacer = styled.div`
  flex-basis: 10%; /* 占據 10% 的空間 */
`;

const LeftSection = styled.div`
  flex-basis: 30%;
  display: flex;
  align-items: center;
  justify-content: center; /* 水平置中 */
`;

const RightSection = styled.ul`
  flex-basis: 50%;
  display: flex;
  justify-content: center; /* 靠右排列 */
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
`;

const NavBarItem = styled.li`
  position: relative;
  margin: 0 40px;

  & i {
    font-size: 30px;
    color: #EFEBE6;
    cursor: pointer;
  }

  & .tooltip-text {
    visibility: hidden;
    background-color: #B7A58F;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 5px 10px;
    position: absolute;
    top: 50%;
    left: 40px;
    transform: translateY(-50%);
    white-space: nowrap;
    z-index: 1;
  }

  &:hover .tooltip-text {
    visibility: visible;
  }

  &:hover i {
    color: #B7A58F; /* 當滑鼠懸停時圖標顏色變化 */
  }
`;

const BackButton = styled.i`
  font-size: 30px;
  color: #EFEBE6;
  margin-right: 20px;
  cursor: pointer;

  &:hover {
    color: #B7A58F;
  }
`;

const Title = styled.h1`
  color: #EFEBE6;
  font-size: 25px;
  margin: 0;
  margin-left: 20px;
`;

function NavBar({ sectionRefs }) {
  const handleClick = (ref, sectionName) => {
    console.log(`正在滾動到：${sectionName}`);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <NavBarContainer>
      <Spacer />
      <LeftSection>
        <BackButton className="bi bi-reply-fill"></BackButton>
        <Title>樹洞系統</Title>
      </LeftSection>
      <Spacer />
      <RightSection>
        <NavBarItem onClick={() => handleClick(sectionRefs.home, '主頁')}>
          <i className="bi bi-house"></i>
          <span className="tooltip-text">主頁</span>
        </NavBarItem>
        <NavBarItem onClick={() => handleClick(sectionRefs.depression, '憂鬱量表')}>
          <i className="bi bi-file-earmark-bar-graph"></i>
          <span className="tooltip-text">憂鬱量表</span>
        </NavBarItem>
        <NavBarItem onClick={() => handleClick(sectionRefs.emotion, '情緒分析')}>
          <i className="bi bi-chat-right-heart"></i>
          <span className="tooltip-text">情緒分析</span>
        </NavBarItem>
        <NavBarItem onClick={() => handleClick(sectionRefs.records, '服藥紀錄')}>
          <i className="bi bi-prescription2"></i>
          <span className="tooltip-text">服藥紀錄</span>
        </NavBarItem>
        <NavBarItem onClick={() => handleClick(sectionRefs.info, '個人資訊')}>
          <i className="bi bi-person-vcard"></i>
          <span className="tooltip-text">個人資訊</span>
        </NavBarItem>
      </RightSection>
    </NavBarContainer>
  );
}

export default NavBar;

// import React from 'react';
// import styled from 'styled-components';

// // 定義 NavBar 和相關樣式
// const NavBarContainer = styled.nav`
//   background-color: #574938;
//   padding: 10px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   position: sticky;
//   top: 0;
//   z-index: 1000;
// `;

// const Spacer = styled.div`
//   flex-basis: 10%; /* 占據 10% 的空間 */
// `;

// const LeftSection = styled.div`
//   flex-basis: 30%;
//   display: flex;
//   align-items: center;
//   justify-content: center; /* 水平置中 */
// `;

// const RightSection = styled.ul`
//   flex-basis: 50%;
//   display: flex;
//   justify-content: center; /* 靠右排列 */
//   list-style: none;
//   margin: 0;
//   padding: 0;
//   align-items: center;
// `;

// const NavBarItem = styled.li`
//   position: relative;
//   margin: 0 40px;

//   & i {
//     font-size: 30px;
//     color: #EFEBE6;
//     cursor: pointer;
//   }

//   & .tooltip-text {
//     visibility: hidden;
//     background-color: #B7A58F;
//     color: #fff;
//     text-align: center;
//     border-radius: 5px;
//     padding: 5px 10px;
//     position: absolute;
//     top: 50%;
//     left: 40px;
//     transform: translateY(-50%);
//     white-space: nowrap;
//     z-index: 1;
//   }

//   &:hover .tooltip-text {
//     visibility: visible;
//   }

//   &:hover i {
//     color: #B7A58F; /* 當滑鼠懸停時圖標顏色變化 */
//   }
// `;

// const BackButton = styled.i`
//   font-size: 30px;
//   color: #EFEBE6;
//   margin-right: 20px;
//   cursor: pointer;

//   &:hover {
//     color: #B7A58F;
//   }
// `;

// const Title = styled.h1`
//   color: #EFEBE6;
//   font-size: 25px;
//   margin: 0;
//   margin-left: 20px;
// `;

// function NavBar({ sectionRefs }) {
//   const handleClick = (ref, sectionName) => {
//     console.log(`正在滾動到：${sectionName}`);
//     if (ref.current) {
//       ref.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   return (
//     <NavBarContainer>
//       <Spacer />
//       <LeftSection>
//         <BackButton className="bi bi-reply-fill"></BackButton>
//         <Title>樹洞系統</Title>
//       </LeftSection>
//       <Spacer />
//       <RightSection>
//         <NavBarItem onClick={() => handleClick(sectionRefs.home, '主頁')}>
//           <i className="bi bi-house"></i>
//           <span className="tooltip-text">主頁</span>
//         </NavBarItem>
//         <NavBarItem onClick={() => handleClick(sectionRefs.depression, '憂鬱量表')}>
//           <i className="bi bi-file-earmark-bar-graph"></i>
//           <span className="tooltip-text">憂鬱量表</span>
//         </NavBarItem>
//         <NavBarItem onClick={() => handleClick(sectionRefs.emotion, '情緒分析')}>
//           <i className="bi bi-chat-right-heart"></i>
//           <span className="tooltip-text">情緒分析</span>
//         </NavBarItem>
//         <NavBarItem onClick={() => handleClick(sectionRefs.records, '服藥紀錄')}>
//           <i className="bi bi-prescription2"></i>
//           <span className="tooltip-text">服藥紀錄</span>
//         </NavBarItem>
//         <NavBarItem onClick={() => handleClick(sectionRefs.info, '個人資訊')}>
//           <i className="bi bi-person-vcard"></i>
//           <span className="tooltip-text">個人資訊</span>
//         </NavBarItem>
//       </RightSection>
//     </NavBarContainer>
//   );
// }

// export default NavBar;
