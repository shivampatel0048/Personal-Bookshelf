import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookSearchPage, PersonalBookshelfPage } from './components';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<BookSearchPage />} />
        <Route path="/bookshelf" element={<PersonalBookshelfPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

const NotFound = () => (
  <div>
    <h2>404: Page Not Found</h2>
  </div>
);

export default App;
