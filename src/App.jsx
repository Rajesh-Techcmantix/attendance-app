import "./App.css";
import { ConfigProvider, theme } from "antd";
import AttendanceDashboard from "./pages/Dashboard/Dashboard";

function App() {
  // const darkTheme = theme.darkAlgorithm;
  const lightTheme = theme.defaultAlgorithm;

  return (
    <ConfigProvider
      theme={{
        algorithm: lightTheme,
        token: {
          colorPrimary: "#177ddc",
        },
      }}
    >
      <AttendanceDashboard />
    </ConfigProvider>
  );
}

export default App;
