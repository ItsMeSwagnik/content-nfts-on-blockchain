"use client";

import { useState, useCallback } from "react";
import {
  mintNft,
  getNft,
  transferNft,
  CONTRACT_ADDRESS,
} from "@/hooks/contract";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Icons ────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ── Styled Input ─────────────────────────────────────────────

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">
        {label}
      </label>
      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-px transition-all focus-within:border-[#7c6cf0]/30 focus-within:shadow-[0_0_20px_rgba(124,108,240,0.08)]">
        <input
          {...props}
          className="w-full rounded-[11px] bg-transparent px-4 py-3 font-mono text-sm text-white/90 placeholder:text-white/15 outline-none"
        />
      </div>
    </div>
  );
}

// ── Method Signature ─────────────────────────────────────────

function MethodSignature({
  name,
  params,
  returns,
  color,
}: {
  name: string;
  params: string;
  returns?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 font-mono text-sm">
      <span style={{ color }} className="font-semibold">fn</span>
      <span className="text-white/70">{name}</span>
      <span className="text-white/20 text-xs">{params}</span>
      {returns && (
        <span className="ml-auto text-white/15 text-[10px]">{returns}</span>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────

type Tab = "view" | "mint" | "transfer";

interface ContractUIProps {
  walletAddress: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function ContractUI({ walletAddress, onConnect, isConnecting }: ContractUIProps) {
  const [activeTab, setActiveTab] = useState<Tab>("view");
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const [mintTo, setMintTo] = useState("");
  const [mintUri, setMintUri] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);

  const [transferTo, setTransferTo] = useState("");
  const [transferId, setTransferId] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  const [viewId, setViewId] = useState("");
  const [isViewing, setIsViewing] = useState(false);
  const [nftData, setNftData] = useState<{owner: string; metadata_uri: string} | null>(null);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const truncateMid = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  const handleMintNft = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!mintTo.trim() || !mintUri.trim()) return setError("Fill in all fields");
    setError(null);
    setIsMinting(true);
    setTxStatus("Awaiting signature...");
    try {
      const tokenId = await mintNft(walletAddress, mintTo.trim(), mintUri.trim());
      setTxStatus(`NFT minted! Token ID: ${tokenId}`);
      setMintedTokenId(tokenId.toString());
      setMintTo("");
      setMintUri("");
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsMinting(false);
    }
  }, [walletAddress, mintTo, mintUri]);

  const handleTransferNft = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!transferId.trim() || !transferTo.trim()) return setError("Fill in all fields");
    setError(null);
    setIsTransferring(true);
    setTxStatus("Awaiting signature...");
    try {
      await transferNft(walletAddress, walletAddress, transferTo.trim(), BigInt(transferId.trim()));
      setTxStatus("NFT transferred!");
      setTransferId("");
      setTransferTo("");
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsTransferring(false);
    }
  }, [walletAddress, transferId, transferTo]);

  const handleViewNft = useCallback(async () => {
    if (!viewId.trim()) return setError("Enter a token ID");
    setError(null);
    setIsViewing(true);
    setNftData(null);
    try {
      const result = await getNft(BigInt(viewId.trim()));
      if (result && typeof result === "object") {
        setNftData(result as {owner: string; metadata_uri: string});
      } else {
        setError("NFT not found");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Query failed");
    } finally {
      setIsViewing(false);
    }
  }, [viewId]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "view", label: "View", icon: <SearchIcon />, color: "#4fc3f7" },
    { key: "mint", label: "Mint", icon: <ImageIcon />, color: "#7c6cf0" },
    { key: "transfer", label: "Transfer", icon: <RefreshIcon />, color: "#fbbf24" },
  ];

  return (
    <div className="w-full max-w-2xl animate-fade-in-up-delayed">
      {/* Toasts */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#f87171]/15 bg-[#f87171]/[0.05] px-4 py-3 backdrop-blur-sm animate-slide-down">
          <span className="mt-0.5 text-[#f87171]"><AlertIcon /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f87171]/90">Error</p>
            <p className="text-xs text-[#f87171]/50 mt-0.5 break-all">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="shrink-0 text-[#f87171]/30 hover:text-[#f87171]/70 text-lg leading-none">&times;</button>
        </div>
      )}

      {txStatus && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#34d399]/15 bg-[#34d399]/[0.05] px-4 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(52,211,153,0.05)] animate-slide-down">
          <span className="text-[#34d399]">
            {txStatus.includes("minted") || txStatus.includes("transferred") ? <CheckIcon /> : <SpinnerIcon />}
          </span>
          <span className="text-sm text-[#34d399]/90">{txStatus}</span>
        </div>
      )}

      {/* Main Card */}
      <Spotlight className="rounded-2xl">
        <AnimatedCard className="p-0" containerClassName="rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6cf0]/20 to-[#4fc3f7]/20 border border-white/[0.06]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7c6cf0]">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Content NFTs</h3>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">{truncateMid(CONTRACT_ADDRESS)}</p>
              </div>
            </div>
            <Badge variant="info" className="text-[10px]">Soroban</Badge>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] px-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setError(null); setNftData(null); }}
                className={cn(
                  "relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all",
                  activeTab === t.key ? "text-white/90" : "text-white/35 hover:text-white/55"
                )}
              >
                <span style={activeTab === t.key ? { color: t.color } : undefined}>{t.icon}</span>
                {t.label}
                {activeTab === t.key && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all"
                    style={{ background: `linear-gradient(to right, ${t.color}, ${t.color}66)` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* View */}
            {activeTab === "view" && (
              <div className="space-y-5">
                <MethodSignature name="get_nft" params="(token_id: u64)" returns="-> ContentNFT" color="#4fc3f7" />
                <Input label="Token ID" value={viewId} onChange={(e) => setViewId(e.target.value)} placeholder="e.g. 1" />
                <ShimmerButton onClick={handleViewNft} disabled={isViewing} shimmerColor="#4fc3f7" className="w-full">
                  {isViewing ? <><SpinnerIcon /> Querying...</> : <><SearchIcon /> View NFT</>}
                </ShimmerButton>

                {nftData && (
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden animate-fade-in-up">
                    <div className="border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-white/25">NFT Details</span>
                      <Badge variant="success">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#34d399]" />
                        Active
                      </Badge>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/35">Token ID</span>
                        <span className="font-mono text-sm text-white/80">{viewId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/35">Owner</span>
                        <span className="font-mono text-sm text-white/80">{truncate(nftData.owner)}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-white/35">Metadata URI</span>
                        <span className="font-mono text-xs text-white/60 break-all">{nftData.metadata_uri}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mint */}
            {activeTab === "mint" && (
              <div className="space-y-5">
                <MethodSignature name="mint" params="(to: Address, metadata_uri: String)" returns="-> u64" color="#7c6cf0" />
                <Input label="Recipient Address" value={mintTo} onChange={(e) => setMintTo(e.target.value)} placeholder="G..." />
                <Input label="Metadata URI" value={mintUri} onChange={(e) => setMintUri(e.target.value)} placeholder="ipfs://..." />
                
                {walletAddress ? (
                  <ShimmerButton onClick={handleMintNft} disabled={isMinting} shimmerColor="#7c6cf0" className="w-full">
                    {isMinting ? <><SpinnerIcon /> Minting...</> : <><ImageIcon /> Mint NFT</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#7c6cf0]/20 bg-[#7c6cf0]/[0.03] py-4 text-sm text-[#7c6cf0]/60 hover:border-[#7c6cf0]/30 hover:text-[#7c6cf0]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to mint NFTs
                  </button>
                )}

                {mintedTokenId && (
                  <div className="rounded-xl border border-[#34d399]/20 bg-[#34d399]/[0.05] px-4 py-3 animate-fade-in-up">
                    <p className="text-xs text-[#34d399]/70">Minted with Token ID:</p>
                    <p className="font-mono text-lg text-[#34d399] mt-1">{mintedTokenId}</p>
                  </div>
                )}
              </div>
            )}

            {/* Transfer */}
            {activeTab === "transfer" && (
              <div className="space-y-5">
                <MethodSignature name="transfer" params="(from: Address, to: Address, token_id: u64)" color="#fbbf24" />
                <Input label="Token ID" value={transferId} onChange={(e) => setTransferId(e.target.value)} placeholder="e.g. 1" />
                <Input label="New Owner Address" value={transferTo} onChange={(e) => setTransferTo(e.target.value)} placeholder="G..." />

                {walletAddress ? (
                  <ShimmerButton onClick={handleTransferNft} disabled={isTransferring} shimmerColor="#fbbf24" className="w-full">
                    {isTransferring ? <><SpinnerIcon /> Transferring...</> : <><RefreshIcon /> Transfer NFT</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#fbbf24]/20 bg-[#fbbf24]/[0.03] py-4 text-sm text-[#fbbf24]/60 hover:border-[#fbbf24]/30 hover:text-[#fbbf24]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to transfer NFTs
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] text-white/15">Content NFTs &middot; Soroban</p>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#7c6cf0]/50" />
                <span className="font-mono text-[9px] text-white/15">Mint</span>
              </span>
              <span className="text-white/10 text-[8px]">&rarr;</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#fbbf24]/50" />
                <span className="font-mono text-[9px] text-white/15">Transfer</span>
              </span>
            </div>
          </div>
        </AnimatedCard>
      </Spotlight>
    </div>
  );
}