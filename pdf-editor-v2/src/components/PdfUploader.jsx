export default function PdfUploader({ onLoad }) {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) onLoad(file);
  };

  return (
    <div className="p-2">
      <input type="file" accept="application/pdf" onChange={handleUpload} />
    </div>
  );
}