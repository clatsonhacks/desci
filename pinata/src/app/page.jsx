"use client";
import { useState } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers'; 
import { uploadFile } from '../utils/uploadToIPFS';
import PdfStorageABI from '../artifacts/contracts/PdfStorage.sol/PdfStorage.json';

const CONTRACT_ADDRESS = '0xB041C3cC6Fa9E24326f317AECb88BC457b480688';

export default function Home() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToBlockchain = async () => {
    if (!file) return alert('Select a file first!');
  
    try {
      const pdfIpfsUrl = await uploadFile(file);
      console.log('Uploaded to IPFS:', pdfIpfsUrl);
  
      if (!pdfIpfsUrl) {
        console.error("IPFS upload failed!");
        alert("IPFS upload failed!");
        return;
      }
  
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
  
        const signer = await provider.getSigner();
        console.log("Signer Address:", await signer.getAddress());
  
        const contract = new ethers.Contract(CONTRACT_ADDRESS, PdfStorageABI, signer);
        console.log("Contract Address:", contract.address); 
  
        const tx = await contract.uploadPdf(pdfIpfsUrl);
        console.log("Transaction Sent:", tx); 
        await tx.wait();
        alert('PDF stored on blockchain!');
      } else {
        alert('MetaMask not detected');
      }
    } catch (error) {
      console.error("Error uploading to blockchain:", error);
      alert("An error occurred while uploading to the blockchain.");
    }
  };
  const fetchPdf = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new Web3Provider(window.ethereum); 
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, PdfStorageABI, signer);

        const storedHash = await contract.getPdf();
         setPdfUrl(storedHash);  
 
      } else {
        alert('Metamask not detected');
      }
    } catch (error) {
      console.error("Error fetching PDF:", error);
      alert("An error occurred while fetching the PDF.");
    }console.log(fetchPdf);
  };
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Upload PDF to Blockchain</h1>
      <input type="file" onChange={handleFileChange} accept="application/pdf" />
      <button onClick={uploadToBlockchain} style={{ margin: '10px' }}>Upload</button>
      <button onClick={fetchPdf}>Fetch PDF</button>

      {pdfUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Stored PDF:</h3>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <button>Download PDF</button>
          </a>
        </div>
      )}
    </div>
  );
}
