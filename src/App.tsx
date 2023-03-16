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
          <Box display="flex" className="App box">
            <Grid2
              container
              flexDirection="row"
              className="App Grid container"
              flexWrap="nowrap"
            >
              <Grid2 m="25px">
                <LeftPanel />
              </Grid2>
              <Grid2>
                <RightPanel />
              </Grid2>
            </Grid2>
          </Box>
        </ThemeProvider>
      </SessionProvider>
    </div>
  );
}

export default App;
