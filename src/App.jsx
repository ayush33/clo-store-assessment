import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ContentsPage from './features/contents/ContentsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ContentsPage />} />
    </Routes>
  );
}
