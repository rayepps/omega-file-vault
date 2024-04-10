# Omega File Vault

An app that allows users to connect and authenticate using their web3 wallet and then upload files to IPFS.

## Deploy

https://omega-file-vault.vercel.app
https://omega-file-vault.on-fleek.app

## Requirements

- [ ] Users can select a file from their machine and upload it to IPFS
- [ ] After uploading, the user is shown the IPFS hash of their file
- [ ] Users can retrieve files from IPFS by inputting an IPFS file hash
- [ ] Users can connect to their web3 wallet like metamask or wallet connect
- [ ] Users can view their ETH balance after connecting their wallet
- [ ] Web3 balance checking is implemented with either web3.js or ether.js
- [ ] Account changes and network changes are handled gracefully
- [ ] App is deployed to server or hosting service like IPFS or Fleek
- [ ] Integrate a database like Supabase
- [ ] When a file is uploaded, store the metadata for that file, against the connected user, in the database
- [ ] File metadata includes IPFS hash, file size, upload date, processing status
- [ ] Complex query?
- [ ] Backend includes a route (`/api/auth/login`) that uses MetaMask for signing a nonce (a random number or string) to authenticate users
- [ ] Backend includes a route (`/api/user/profile`) that allows users to update their profile information after authentication, like username, email (optional), and preferred settings

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
