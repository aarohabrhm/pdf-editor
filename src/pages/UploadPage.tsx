
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("PDF size must be 5MB or less.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        localStorage.setItem("pdf", reader.result as string);
        navigate("/editor");
      } catch (error) {
        alert("An error occurred while processing the file.");
        console.error("File read error:", error);
      }
    };

    reader.onerror = () => {
    alert("Failed to read the file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="border-2 border-dashed border-gray-300 rounded-xl w-[400px] h-[300px] flex flex-col items-center justify-center text-center p-6">
        <img
          src="https://img.icons8.com/ios-filled/100/folder-invoices.png"
          alt="upload icon"
          className="w-16 h-16 mb-4 opacity-50"
        />
        <p className="text-lg font-semibold">Upload PDF</p>
        <p className="text-sm text-gray-500 mb-4">*you can only upload maximum of 5MB at a time</p>
        <button
          onClick={handleClick}
          className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800"
        >
          + Add files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          hidden
        />
      </div>
    </div>
  );
}

export default UploadPage;
