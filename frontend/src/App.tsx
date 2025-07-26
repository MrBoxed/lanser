import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Movies from "./pages/movies/Movies";
import Books from "./pages/books/Books";
import Music from "./pages/music/Music";

import UploadFile from "./pages/upload/Upload";
import WatchPage from "./pages/movies/WatchPage";
import { Login } from "./pages/auth/Login";
import { SignUp } from "./pages/auth/Signup";
import NavBar from "./components/layout/Navbar";
import ErrorPage from "./components/layout/ErrorPage";
import BookReaderPage from "./pages/books/BookReaderPage";

function App() {
  return (
    <div className="h-screen w-screen">
      <Router>
        < NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="movies/watch/:movieId" element={<WatchPage />} />
          <Route path="/music" element={<Music />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/read/:fileId" element={<BookReaderPage />} />
          <Route path="/upload" element={<UploadFile />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </div>
  );
}


export default App
