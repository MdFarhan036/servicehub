import { useRef } from "react";
import { FiPaperclip } from "react-icons/fi";
import { validateFile } from "../../../utils/fileValidation";
import "./MediaUpload.css";

export default function MediaUpload({ onFileSelected, onError }) {
  const inputRef = useRef(null);

  function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const result = validateFile(file);
    if (!result.valid) {
      onError(result.error);
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    onFileSelected({ file, url, kind: result.kind, fileName: file.name });
    e.target.value = "";
  }

  return (
    <>
      <button type="button" className="media-upload-btn" onClick={() => inputRef.current.click()}>
        <FiPaperclip />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        hidden
        onChange={handleChange}
      />
    </>
  );
}
