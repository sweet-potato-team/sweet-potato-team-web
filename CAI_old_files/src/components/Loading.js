import ReactLoading from 'react-loading';

function Loading({ isLoading }) {
  return (
    <>
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundBlendMode: 'multiply',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(5px)',
          }}
        >
          <ReactLoading type='cubes' color='#B7A58F' height={60} width={100} />
        </div>
      )}
    </>
  );
}

export default Loading;
