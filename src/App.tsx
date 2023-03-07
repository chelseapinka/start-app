import "./App.css";
import { Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import { SessionProvider } from "@inrupt/solid-ui-react";
import { theme } from "./theme";
import { ThemeProvider } from "@mui/material/styles";
function App() {
  return (
    <div className="App">
      <SessionProvider>
        <ThemeProvider theme={theme}>
          <Grid2 container>
            <Box width={"50%"}>
              <LeftPanel />
            </Box>
            {/* <Box width={"50%"}>
          <RightPanel />
        </Box> */}
          </Grid2>
        </ThemeProvider>
      </SessionProvider>
    </div>
  );
}

export default App;
