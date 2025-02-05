// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract PdfStorage {
    mapping(address => string) private pdfHashes;

    event PdfUploaded(address indexed user, string ipfsHash);

    function uploadPdf(string memory _ipfsHash) public {
        pdfHashes[msg.sender] = _ipfsHash;
        emit PdfUploaded(msg.sender, _ipfsHash);
    }

    function getPdf() public view returns (string memory) {
        return pdfHashes[msg.sender];
    }
}
