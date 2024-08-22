import { Carousel } from 'react-bootstrap';

function SpaceCarousel({ spaceId, urls, altText, maxHeight = '300px' }) {
  return (
    <Carousel indicators={false}>
      {urls.map((url, index) => (
        url && (
          <Carousel.Item key={`${spaceId}-${index}`}>
            <img
              src={url}
              className="d-block w-100"
              style={{ objectFit: 'cover', maxHeight }}
              alt={altText}
            />
          </Carousel.Item>
        )
      ))}
    </Carousel>
  );
}

export default SpaceCarousel;