import { useRef, useState } from "react";
import { FiUpload, FiFile } from "react-icons/fi";
import { technicianProfile } from "../../../data/technicianData";
import StatusBadge from "../../../components/common/StatusBadge/StatusBadge";
import Button from "../../../components/common/Button/Button";
import { validateFile } from "../../../utils/fileValidation";
import "./Documents.css";

export default function Documents() {
  const [docs, setDocs] = useState(technicianProfile.documents);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const result = validateFile(file);
    if (!result.valid) {
      setError(result.error);
      return;
    }
    setError("");
    setDocs((prev) => [
      ...prev,
      { id: Date.now(), name: file.name, status: "Pending", uploadedOn: new Date().toISOString().slice(0, 10) },
    ]);
    e.target.value = "";
  }

  return (
    <div>
      <div className="docs-header">
        <h1>Documents</h1>
        <Button icon={FiUpload} onClick={() => inputRef.current.click()}>Upload Document</Button>
        <input ref={inputRef} type="file" hidden onChange={handleUpload} />
      </div>

      {error && <div className="docs-error">{error}</div>}

      <div className="docs-list">
        {docs.map((d) => (
          <div key={d.id} className="doc-item card">
            <div className="doc-icon"><FiFile /></div>
            <div className="doc-info">
              <p>{d.name}</p>
              <span className="text-gray">Uploaded on {d.uploadedOn}</span>
            </div>
            <StatusBadge status={d.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
