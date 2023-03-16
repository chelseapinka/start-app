import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

function RightPanel() {
  return (
    <Grid2
      container
      className="Left panel Grid container"
      style={{
        backgroundSize: "cover",
        backgroundRepeat: "none",
        backgroundPosition: "50% 50%",
      }}
    >
      <img
        src="quote.png"
        alt="quote"
        style={{
          backgroundImage: "quote.png",
          backgroundSize: "cover",
          backgroundRepeat: "none",
          backgroundPosition: "50% 50%",
        }}
      />
    </Grid2>
  );
}

export default RightPanel;
