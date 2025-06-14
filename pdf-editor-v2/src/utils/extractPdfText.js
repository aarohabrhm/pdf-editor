import { getDocument } from 'pdfjs-dist';

export async function extractPdfText(file) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await getDocument({ data: typedArray }).promise;

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
        }

        resolve(fullText);
      } catch (err) {
        reject(err);
      }
    };

    reader.readAsArrayBuffer(file);
  });
}
