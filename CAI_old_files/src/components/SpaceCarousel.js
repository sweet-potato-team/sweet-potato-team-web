import { Carousel } from 'react-bootstrap';

function SpaceCarousel({ spaceId, urls, altText }) {
  return (
    <Carousel indicators={false} style={{ height: '100%' }}>
      {urls.map((url, index) => (
        url && (
          <Carousel.Item key={`${spaceId}-${index}`} style={{ height: '100%' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',  // 確保父容器也填滿寬度
                overflow: 'hidden',
              }}
            >
              <img
                src={url}
                style={{
                  width: '100%',
                  height: 'auto',  // 保持圖片的長寬比
                  maxHeight: '100%',  // 讓圖片高度不超出框架
                  objectFit: 'cover',
                }}
                alt={altText}
              />
            </div>
          </Carousel.Item>
        )
      ))}
    </Carousel>
  );
}

export default SpaceCarousel;
