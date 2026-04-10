import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDJZ36EOQEEUH7O6CDI4IMO3OFSPYIWKRQ77CELZYU3K6UR6DGNSU3VH",
  }
} as const

export type DataKey = {tag: "Token", values: readonly [u64]} | {tag: "TokenCount", values: void};


export interface ContentNFT {
  metadata_uri: string;
  owner: string;
}

export interface Client {
  /**
   * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  mint: ({to, metadata_uri}: {to: string, metadata_uri: string}, options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a get_nft transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_nft: ({token_id}: {token_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<ContentNFT>>

  /**
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  transfer: ({from, to, token_id}: {from: string, to: string, token_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAEAAAAAAAAABVRva2VuAAAAAAAAAQAAAAYAAAAAAAAAAAAAAApUb2tlbkNvdW50AAA=",
        "AAAAAQAAAAAAAAAAAAAACkNvbnRlbnRORlQAAAAAAAIAAAAAAAAADG1ldGFkYXRhX3VyaQAAABAAAAAAAAAABW93bmVyAAAAAAAAEw==",
        "AAAAAAAAAAAAAAAEbWludAAAAAIAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAxtZXRhZGF0YV91cmkAAAAQAAAAAQAAAAY=",
        "AAAAAAAAAAAAAAAHZ2V0X25mdAAAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAYAAAABAAAH0AAAAApDb250ZW50TkZUAAA=",
        "AAAAAAAAAAAAAAAIdHJhbnNmZXIAAAADAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAACHRva2VuX2lkAAAABgAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    mint: this.txFromJSON<u64>,
        get_nft: this.txFromJSON<ContentNFT>,
        transfer: this.txFromJSON<null>
  }
}