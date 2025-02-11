"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { uploadFile } from "../utils/uploadToIPFS";
import PdfStorageABI from "../artifacts/contracts/PdfStorage.sol/PdfStorage.json";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia, polygonMumbai, lineaSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "f7a3f07f5892e7bd531bb1386ed8de16",
  chains: [sepolia, polygonMumbai , lineaSepolia],
});
const queryClient = new QueryClient();
const CONTRACT_ADDRESS = "0xB041C3cC6Fa9E24326f317AECb88BC457b480688";
export default function Home() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const TELEGRAM_BOT_TOKEN = "7569440772:AAHKtReqAY-UmuRcfyRNx0yU-HqAfH3KfNs"; 
const TELEGRAM_CHAT_ID = "1371463172"; 
const sendTelegramMessage = async (pdfTitle, ipfsUrl) => {
  const message = `*[New Research Article Dropped!]*\n\n📝 *Title:* ${pdfTitle}\n🔗 *IPFS Link:* ${ipfsUrl} `;
  const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await fetch(telegramApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "Markdown" }),
    });
    console.log("Telegram message sent!");
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
};

const uploadToBlockchain = async () => {
  if (!file) return alert("Select a file first!");
  try {
    const pdfIpfsUrl = await uploadFile(file);
    console.log("Uploaded to IPFS:", pdfIpfsUrl);
    
    if (!pdfIpfsUrl) {
      console.error("IPFS upload failed!");
      alert("IPFS upload failed!");
      return;
    }

    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const signer = await provider.getSigner();
      console.log("Signer Address:", await signer.getAddress());

      const contract = new ethers.Contract(CONTRACT_ADDRESS, PdfStorageABI, signer);
      
      const tx = await contract.uploadPdf(pdfIpfsUrl);
      console.log("Transaction Sent:", tx);
      await tx.wait();
      
      setPdfUrl(pdfIpfsUrl);
      alert("Thank You for your valuable contribution!");

    
      const pdfTitle = file.name; 
      await sendTelegramMessage(pdfTitle, pdfIpfsUrl);

    } else {
      alert("MetaMask not detected");
    }
  } catch (error) {
    console.error("Error uploading to blockchain:", error);
    alert("An error occurred while uploading to the blockchain.");
  }
};

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <ConnectButton />
            <h1>Upload PDF to On Chain</h1>
            <input type="file" onChange={handleFileChange} accept="application/pdf" />
            <button onClick={uploadToBlockchain} style={{ margin: "10px" }}>Upload</button>

            {pdfUrl && (
              <div style={{ marginTop: "30px" }}>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <button>Download PDF</button>
                </a>
              </div>
            )}
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
