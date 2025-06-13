import { useEffect, useState } from 'react';
import { extractPdfText } from '../utils/extractPdfText';

export function usePdf(file) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) return;

    const loadText = async () => {
      setLoading(true);
      setError(null);
      try {
        const pdfText = await extractPdfText(file);
        setText(pdfText);
      } catch (err) {
        setError(err.message || 'Failed to extract text');
      } finally {
        setLoading(false);
      }
    };

    loadText();
  }, [file]);

  return { text, loading, error };
}