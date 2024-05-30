"use client";
import { usePaymasterConfig } from "@/hooks";
import { Button, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  useBalance,
  useKernelClient,
  useSendUserOperation,
} from "@zerodev/waas";
import { useEffect, useState } from "react";
import { Popover } from "react-tiny-popover";
import { parseAbi } from "viem";

export default function SmartAccountBlock() {
  const { address } = useKernelClient();
  const { paymasterConfig } = usePaymasterConfig();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const {
    data: hash,
    write,
    error,
    isPending,
    context,
  } = useSendUserOperation({
    paymaster: paymasterConfig,
  });
  console.log({ context });
  const { data } = useBalance();
  const tokenAddress = "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B";
  const abi = parseAbi(["function mint(address _to, uint256 amount) public"]);

  const sepoliaEtherscanUrl = `https://sepolia.etherscan.io/address/${address}`;
  const sepoliaBlockScoutUrl = `https://eth-sepolia.blockscout.com/address/${address}`;
  const sepoliaJiffyscanScoutUrl = `https://jiffyscan.xyz/account/${address}?network=sepolia&pageNo=0&pageSize=10`;

  useEffect(() => {
    if (error) {
      notifications.show({
        color: "red",
        message: "Fail to send userop",
      });
    }
  }, [error]);

  return (
    <>
      <Title order={3}>Smart Account</Title>
      <Popover
        isOpen={isPopoverOpen}
        positions={["left", "top", "bottom", "right"]}
        padding={10}
        content={
          <div style={{ border: "1px solid blue" }}>
            <a href={sepoliaEtherscanUrl} target="_blank">
              <div style={{ cursor: "crosshair" }}>
                <img
                  width="100px"
                  src="https://etherscan.io/images/brandassets/etherscan-logo.svg"
                  alt="placeholder"
                />
              </div>
            </a>

            <a href={sepoliaBlockScoutUrl} target="_blank">
              <div style={{ cursor: "crosshair" }}>
                Blockscout
                <img
                  width="20px"
                  style={{ display: "inline-block" }}
                  src="https://avatars.githubusercontent.com/u/45625840?s=200&v=4"
                  alt="placeholder"
                />
              </div>
            </a>

            <a href={sepoliaJiffyscanScoutUrl} target="_blank">
              <div style={{ cursor: "crosshair" }}>
                <img
                  src="https://jiffyscan.xyz/images/Frame%2021.svg"
                  alt="placeholder"
                />
              </div>
            </a>
          </div>
        }
        onClickOutside={() => setIsPopoverOpen(false)}
      >
        <div className="mb-4" onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
          Address: {address}
        </div>
      </Popover>

      {data && (
        <div className="mb-4">
          Balance: {`${data.formatted} ${data.symbol}`}
        </div>
      )}
      <div className="flex flex-row justify-center items-center space-x-4 mt-4">
        <Button
          variant="outline"
          disabled={isPending}
          loading={isPending}
          onClick={() => {
            write([
              {
                address: tokenAddress,
                abi: abi,
                functionName: "mint",
                args: [address, 1],
                value: 0n,
              },
              {
                address: tokenAddress,
                abi: abi,
                functionName: "mint",
                args: [address, 1],
                value: 0n,
              },
            ]);
          }}
        >
          Mint
        </Button>
      </div>
      {hash && <div className="mt-4">UserOp Hash: {hash}</div>}
    </>
  );
}
