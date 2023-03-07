import "./App.css";
import { Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import { SessionProvider } from "@inrupt/solid-ui-react";

function App() {
  return (
    <div className="App">
      <SessionProvider>
        <Grid2 container>
          <Box width={"50%"}>
            <LeftPanel />
          </Box>
          {/* <Box width={"50%"}>
          <RightPanel />
        </Box> */}
        </Grid2>
      </SessionProvider>
    </div>
  );
}

export default App;
