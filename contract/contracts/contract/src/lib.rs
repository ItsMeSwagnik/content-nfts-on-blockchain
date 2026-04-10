#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Env, Symbol, String, Address, Map
};

#[contracttype]
#[derive(Clone)]
pub struct ContentNFT {
    pub owner: Address,
    pub metadata_uri: String,
}

#[contracttype]
pub enum DataKey {
    Token(u64),
    TokenCount,
}

#[contract]
pub struct ContentNFTContract;

#[contractimpl]
impl ContentNFTContract {

    // Mint a new content NFT
    pub fn mint(env: Env, to: Address, metadata_uri: String) -> u64 {
        let mut count: u64 = env.storage().instance()
            .get(&DataKey::TokenCount)
            .unwrap_or(0);

        count += 1;

        let nft = ContentNFT {
            owner: to.clone(),
            metadata_uri,
        };

        env.storage().instance().set(&DataKey::Token(count), &nft);
        env.storage().instance().set(&DataKey::TokenCount, &count);

        count
    }

    // Get NFT details
    pub fn get_nft(env: Env, token_id: u64) -> ContentNFT {
        env.storage().instance()
            .get(&DataKey::Token(token_id))
            .unwrap()
    }

    // Transfer ownership
    pub fn transfer(env: Env, from: Address, to: Address, token_id: u64) {
        let mut nft: ContentNFT = env.storage().instance()
            .get(&DataKey::Token(token_id))
            .unwrap();

        if nft.owner != from {
            panic!("Not the owner");
        }

        nft.owner = to;

        env.storage().instance().set(&DataKey::Token(token_id), &nft);
    }
}