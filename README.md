# Omega File Vault

An app that allows users to connect and authenticate using their web3 wallet and then upload files to IPFS.

## Deploy

https://omega-file-vault.vercel.app
https://omega-file-vault.on-fleek.app

## Requirements

- [x] Users can select a file from their machine and upload it to IPFS
- [x] After uploading, the user is shown the IPFS hash of their file
- [ ] Users can retrieve files from IPFS by inputting an IPFS file hash
- [x] Users can connect to their web3 wallet like metamask or wallet connect
- [x] Users can view their ETH balance after connecting their wallet
- [x] Web3 balance checking is implemented with either web3.js or ether.js
- [ ] Account changes and network changes are handled gracefully
- [x] App is deployed to server or hosting service like IPFS or Fleek
- [x] Integrate a database like Supabase
- [x] When a file is uploaded to IPFS the the metadata for that file is stored in the database
- [x] File metadata includes IPFS hash, file size, upload date, processing status
- [ ] Complex query?
- [x] Backend includes a route (`/api/auth/login`) that uses MetaMask for signing a nonce (a random number or string) to authenticate users
- [x] Backend includes a route (`/api/user/profile`) that allows users to update their profile information after authentication, like username, email (optional), and preferred settings
- [ ] App should be responsive

### Stretch

- [ ] Upload or retrieval failures/exceptions are caught, handled, and displayed to the user
- [ ] User can sign arbitrary messages using their private key
- [ ] A loading indication is shown when files are uploading
- [ ] Implement public and private file sharing using asymmetric encryption

## Resources

- [IPFS documentation](https://docs.ipfs.io/)
- [Web3.js documentation](https://web3js.readthedocs.io/)
- [Ethers.js documentation](https://docs.ethers.io/)
- [MetaMask documentation](https://docs.metamask.io/)
- [IPFS HTTP Client documentation](https://www.npmjs.com/package/ipfs-http-client)

## Notes from the developer

1. I would want to delete expired verifications/nonces from db given more time to implement and infrastructure to work with
2. I tend to be 5x faster at building UI when I have a design to work from where I've already speced out exactly what I'm building, otherwise I tend to iterate in the code which is much much slower. So, here's the [figma](https://www.figma.com/file/DeCNQcO7xMaSTl5Kc0HY1G/Untitled?type=design&node-id=0%3A1&mode=design&t=nJMZb9r1SZjWDDV2-1) I made as a guide for myself. It's also helpful as a tool to go through the requirements and double check that the UI/UX satisfies all our use cases.
3. Most time consuming item was the file uploading, not the IPFS part but just the uploading the FormData, parsing/converting it to a buffer so I can check the signature on the API.
4. There is a ton of polish I don't have time to do (probably no surprise) but the error handling, logging, and error UX in the UI is all lacking -- especially around wallet connection and signing.
