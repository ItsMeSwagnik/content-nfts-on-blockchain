# 📜 Content NFT on Stellar (Soroban)
<img width="1919" height="1025" alt="image" src="https://github.com/user-attachments/assets/87df3535-cc7a-4028-85df-79176bc181af" />

## 🧩 Project Description

Content NFT is a decentralized application built on Stellar’s Soroban smart contract platform that allows creators to tokenize digital content as NFTs.

Each NFT represents ownership of unique content such as:

* Articles
* Images
* Music
* Videos
* Any digital media

This project aims to provide creators with verifiable ownership, transparency, and easy transferability of their content on-chain.

---

## ⚙️ What It Does

The platform enables users to:

* Mint NFTs representing digital content
* Store metadata references (e.g., IPFS links)
* Verify ownership on-chain
* Transfer NFTs between users

Each NFT includes:

* Owner address
* Metadata URI pointing to content

---

## ✨ Features

* 🪙 **Mint Content NFTs**
  Easily create NFTs linked to digital content.

* 🔗 **Metadata Support**
  Store off-chain content references like IPFS URLs.

* 👤 **Ownership Tracking**
  Transparent ownership using Stellar addresses.

* 🔄 **Secure Transfers**
  Transfer NFTs between users on-chain.

* ⚡ **Lightweight & Fast**
  Built using Soroban for efficient execution.

---

## 🌐 Deployed Smart Contract

**Contract Address:**
CDJZ36EOQEEUH7O6CDI4IMO3OFSPYIWKRQ77CELZYU3K6UR6DGNSU3VH

---

## 🧑‍💻 Client Integration

Example interaction using JavaScript:

```javascript
await mintNFT(
  "GXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "ipfs://your-content-metadata"
);
```

### Available Functions

* `mint(to, metadata_uri)` → Creates a new NFT
* `get_nft(token_id)` → Fetch NFT details
* `transfer(from, to, token_id)` → Transfer ownership

---

## 🛠️ Tech Stack

* Rust (Soroban SDK)
* Stellar Soroban
* JavaScript (Client Integration)

---

## 🚀 Future Improvements

* 🎨 Creator royalties
* 🛒 NFT marketplace
* 🔐 Access-controlled content
* 📦 On-chain metadata storage
* 🔍 Indexing & search

---

## ⚠️ Disclaimer

This is an experimental project and not audited. Do not use in production without proper security review.

---

## 🤝 Contributing

Pull requests are welcome! Feel free to fork and improve.

---

## 📄 License

MIT License
