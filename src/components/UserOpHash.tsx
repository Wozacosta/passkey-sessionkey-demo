import { useState } from "react";
import { Popover } from "react-tiny-popover";

interface Props {
  userOpHash: `0x${string}`;
}

export function UserOpHash({ userOpHash }: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const slicedUserOpHash = `${userOpHash.slice(0, 8)}...${userOpHash.slice(
    -8
  )}`;
  
  const jiffyUrl = `https://jiffyscan.xyz/userOpHash/${userOpHash}?network=sepolia`

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={["left", "top", "bottom", "right"]}
      padding={10}
      content={
        <div style={{ border: "1px solid blue" }}>
          <a href={jiffyUrl} target="_blank">
            <div style={{ cursor: "crosshair"}}>
              <img src="https://jiffyscan.xyz/images/Frame%2021.svg" alt="placeholder" />
            </div>
          </a>
        </div>
      }
      onClickOutside={() => setIsPopoverOpen(false)}
    >
      <button onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
        <span>UserOp: {slicedUserOpHash}</span>
      </button>
    </Popover>
  );
}
