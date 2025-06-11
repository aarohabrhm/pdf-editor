import { Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import './global.css'
import EditorPage from './pages/EditorPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/editor" element={<EditorPage />} />
    </Routes>
    
  )
}

export default App