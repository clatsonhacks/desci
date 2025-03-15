import axios from 'axios';

const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_API_KEY = 'c7fab34b84e4c1aafdf4'
const PINATA_SECRET_API_KEY = '3d2b9b3a6fb52f76a1e927a0f8ac3fe0b02fab3233d0040d928821228d8e2177'


export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(PINATA_API_URL, formData, {
      maxBodyLength: Infinity, 
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    throw new Error('Failed to upload file to IPFS');
  }
};
