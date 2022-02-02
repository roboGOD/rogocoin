import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ResponsiveAppBar from "../AppBar/AppBar";
import "./App.scss";

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <div>
        <ResponsiveAppBar />
      </div>
    </ThemeProvider>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});
