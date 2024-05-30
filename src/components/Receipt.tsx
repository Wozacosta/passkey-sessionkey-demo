import { useState } from "react";
import { Popover } from "react-tiny-popover";

interface Props {
  receipt: {
    receipt: {
      transactionHash: string;
      gasUsed: number; // one used in etherscan's gas usage
    };
    actualGasUsed: number;
    success: boolean;
  };
}

export function Receipt({ receipt }: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  if (!receipt) {
    return <span>Pending...</span>;
  }
  if (!receipt.success) {
    return <span>Error!</span>;
  }
  const txHash = receipt.receipt.transactionHash;
  const slicedTxHash = `${txHash.slice(0, 8)}...${txHash.slice(-8)}`;
  console.log({ gasused: receipt.receipt.gasUsed });
  
  const sepoliaEtherscanUrl = `https://sepolia.etherscan.io/tx/${txHash}`;
  const sepoliaBlockScoutUrl = `https://eth-sepolia.blockscout.com/tx/${txHash}`;

  return (
    <div>
    <Popover
      isOpen={isPopoverOpen}
      positions={["left", "top", "bottom", "right"]}
      padding={10}
      content={
        <div style={{ border: "1px solid blue" }}>
          <a href={sepoliaEtherscanUrl} target="_blank">
            <div style={{ cursor: "crosshair"}}>
              <img width="100px" src="https://etherscan.io/images/brandassets/etherscan-logo.svg" alt="placeholder" />
            </div>
          </a>

          <a href={sepoliaBlockScoutUrl} target="_blank">
            <div style={{ cursor: "crosshair"}}>
                Blockscout
                <img width="20px" style={{display: "inline-block"}} src="https://avatars.githubusercontent.com/u/45625840?s=200&v=4" alt="placeholder" />
            </div>
          </a>
        </div>
      }
      onClickOutside={() => setIsPopoverOpen(false)}
    >
      <button onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
        TxHash {slicedTxHash} (gas used = {receipt.receipt.gasUsed.toString()})
      </button>
      </Popover>
    </div>
  );
}
