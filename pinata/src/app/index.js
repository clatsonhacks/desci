import { useState } from "react";
import { ethers } from "ethers";
import { uploadFile } from "../utils/uploadToIPFS";
import PdfStorageABI from "../contracts/PdfStorage.json";

const CONTRACT_ADDRESS = "0xB041C3cC6Fa9E24326f317AECb88BC457b480688"; 

export default function Home() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToBlockchain = async () => {
    if (!file) return alert("Select a file first!");

    const pdfIpfsUrl = await uploadFile(file);
    console.log("Uploaded to IPFS:", pdfIpfsUrl);

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, PdfStorageABI.abi, signer);

      const tx = await contract.uploadPdf(pdfIpfsUrl);
      await tx.wait();
      alert("PDF stored on blockchain!");
    } else {
      alert("Metamask not detected");
    }
  };

  const fetchPdf = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, PdfStorageABI.abi, signer);

      const storedHash = await contract.getPdf();
      setPdfUrl(storedHash);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Upload PDF to Blockchain</h1>
      <input type="file" onChange={handleFileChange} accept="application/pdf" />
      <button onClick={uploadToBlockchain} style={{ margin: "10px" }}>Upload</button>
      <button onClick={fetchPdf}>Fetch PDF</button>

      {pdfUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Stored PDF:</h3>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <button>Download PDF</button>
          </a>
        </div>
      )}
    </div>
  );
}
