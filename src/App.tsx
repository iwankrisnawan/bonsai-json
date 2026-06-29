import { useState } from 'react';
import { JsonSlicer } from './pages/JsonSlicer';
import { ArrayExtractor } from './pages/ArrayExtractor';
import { ArrayComparator } from './pages/ArrayComparator';

export default function App() {
  const [page, setPage] = useState('slicer');

  if (page === 'extractor') {
    return <ArrayExtractor onPageChange={setPage} />;
  }

  if (page === 'comparator') {
    return <ArrayComparator onPageChange={setPage} />;
  }

  return <JsonSlicer onPageChange={setPage} />;
}
