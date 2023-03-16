import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    appBackground: React.CSSProperties["color"];
  }
}

export const theme = createTheme({
  palette: {
    appBackground: "#F2F2F2",

    primary: {
      main: "#0D6796",
    },
    secondary: {
      main: "#9671FF",
    },
    text: {
      primary: "#2F2F2F",
      secondary: "#073D6C",
    },
    error: {
      main: "#D32F2F",
    },
    success: {
      main: "#5C8727",
    },
    divider: "#00000050",
  },
  typography: {
    h1: {
      fontSize: 34,
      fontWeight: 800,
      color: "#2F2F2F",
      paddingBottom: "8px",
    },
    h2: {
      color: "#2F2F2F",
      fontSize: 24,
      fontWeight: 800,
      lineHeight: 1.375,
      paddingBottom: "8px",
    },
    h3: {
      fontWeight: 800,
      fontSize: 20,
      color: "#0D6796",
    },
    h4: {
      fontSize: 16,
      fontWeight: 700,
      color: "#2F2F2F",
    },
    body1: {
      fontSize: 16,
      color: "#2F2F2F",
      fontWeight: 400,
      lineHeight: 1.625,
    },
    body2: {
      fontSize: 16,
      color: "#FFFFFF",
      fontWeight: 800,
    },
    button: {
      fontWeight: 800,
      color: "#1B1B1B",
      textTransform: "capitalize",
    },
    caption: {
      fontSize: 12,
      color: "#6D6D6D",
    },
    subtitle1: {
      fontSize: 14,
      fontWeight: 700,
      color: "#0D6796",
    },
    fontFamily: `'Open Sans', sans-serif`,
  },
});
