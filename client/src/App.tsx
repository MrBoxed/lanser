import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import Home from "./pages/home/Home";
import Movies from "./pages/movies/Movies";
import Books from "./pages/books/Books";
import Music from "./pages/music/Music";
import ResponsiveAppBar from "./components/Navbar";
import UploadFile from "./pages/Upload";

function App() {
  return (
    <div className="h-screen w-screen">
      <Router>
        <ResponsiveAppBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/music" element={<Music />} />
          <Route path="/books" element={<Books />} />
          <Route path="/upload" element={<UploadFile />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
