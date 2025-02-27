interface HomePageButtonProps {
  img: string;
  handleClick: () => void;
}

function HomePageButton({ img, handleClick }: HomePageButtonProps) {
  return (
    <>
      <div
        onClick={handleClick}
        className="card mb-4"
        style={{ width: "70vw" }}
      >
        <img
          src={img}
          className="card-img-top mx-auto pt-3"
          style={{ width: "5vh" }}
        />
        <div className="card-body">
          <p className="card-text">Manually add a warranty</p>
        </div>
      </div>
    </>
  );
}

export default HomePageButton;
