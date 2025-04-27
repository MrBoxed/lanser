import React from 'react'
import Home from './components/home/home'
import ResponsiveAppBar from './components/Navbar/Navbar'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Movies from './components/movies/Movies';
import Books from './components/books/Books';
import Music from './components/music/Music';

function App() {
  return (
    <>
      <Router>
        <ResponsiveAppBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/books' element={<Books />} />
          <Route path='/music' element={<Music />} />
        </Routes>
      </Router>
    </>
  )
}

export default App