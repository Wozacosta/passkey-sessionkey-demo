"use client";
import { useModal, usePaymasterConfig } from "@/hooks";
import { Button, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  toCallPolicy,
  toGasPolicy,
  toRateLimitPolicy,
  toSudoPolicy,
  toTimestampPolicy,
} from "@zerodev/permissions/policies";
import {
  useKernelClient,
  useSendUserOperationWithSession,
  useSessions,
} from "@zerodev/waas";
import { ENTRYPOINT_ADDRESS_V07, bundlerActions } from "permissionless";
import { useEffect, useState } from "react";
import { parseAbi, parseGwei } from "viem";
import { AllData } from "./AllData";
import { contractABI, contractAddress } from "./Modal/SessionModal";

export interface Data {
  userOpHash: `0x${string}`;
  receipt: any;
}

export function getEllipsedAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

function SessionInfo({
  sessionId,
  policiesStr,
}: {
  sessionId: `0x${string}`;
  policiesStr: string;
}) {
  const { kernelClient, address } = useKernelClient();
  const tokenAddress = "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B";
  const abi = parseAbi(["function mint(address _to, uint256 amount) public"]);
  const { paymasterConfig } = usePaymasterConfig({ sessionId });
  const bundlerClient = kernelClient?.extend(
    bundlerActions(ENTRYPOINT_ADDRESS_V07)
  );

  const [allData, setAllData] = useState<Data[]>([]);

  // const { data, write, isDisabled, isPending, error } =
  //   useSendUserOperationWithSession({
  //     sessionId,
  //     paymaster: paymasterConfig,
  //   });

  const res = useSendUserOperationWithSession({
    sessionId,
    paymaster: paymasterConfig,
  });
  const { data, write, isPending, error } = res;

  useEffect(() => {
    if (error) {
      notifications.show({
        color: "red",
        message: "Fail to send userop",
      });
      console.error(error);
    }
  }, [error]);

  const dataInAllData = (userOpHash: `0x${string}`) => {
    return allData.some((d) => d.userOpHash === userOpHash);
  };

  useEffect(() => {
    const fetchReceipt = async () => {
      if (data === undefined) return;
      if (dataInAllData(data)) return;
      const allDataBefore = [...allData];
      setAllData([...allData, { userOpHash: data, receipt: undefined }]);
      const receipt = await bundlerClient?.waitForUserOperationReceipt({
        hash: data as `0x${string}`,
      });
      setAllData([...allDataBefore, { userOpHash: data, receipt }]);
      console.log({ receipt });
    };

    fetchReceipt().catch(console.error);
  }, [data]);

  return (
    <>
      <div className="flex flex-row justify-center items-center space-x-4 mt-4">
        {sessionId && <p>{`Permission ID: ${sessionId} (${policiesStr})`}</p>}
        <Button
          variant="outline"
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
            ]);
          }}
        >
          Mint With Session
        </Button>
      </div>
      {data && (
        <div className="mt-8 mb-8">
          MintWithSession Latest UserOp Hash: {getEllipsedAddress(data)}
        </div>
      )}
      <AllData allData={allData} />
    </>
  );
}

export default function SessionBlock() {
  const { openSessionModal } = useModal();
  const sessions = useSessions();

  return (
    <>
      <Title order={3}>Session</Title>
      <Button
        variant="outline"
        onClick={() =>
          openSessionModal?.({
            policies: [
              toSudoPolicy({}),
              toGasPolicy({ allowed: parseGwei("1000000000") }),
            ],
          })
        }
      >
        Create Session, (sudo && gas)
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          openSessionModal?.({
            policies: [
              toCallPolicy({
                permissions: [
                  {
                    // target address
                    target: contractAddress,
                    // Maximum value that can be transferred.  In this case we
                    // set it to zero so that no value transfer is possible.
                    valueLimit: BigInt(0),
                    // Contract abi
                    abi: contractABI,
                    // Function name
                    functionName: "mint",
                    // An array of conditions, each corresponding to an argument for
                    // the function.
                  },
                ],
              }),
            ],
          })
        }
      >
        Create Session, (call policy)
      </Button>

      {/* <Button
        variant="outline"
        onClick={() =>
          openSessionModal?.({
            policies: [
              toGasPolicy({
                enforcePaymaster: true,
              }),
            ],
          })
        }
      >
        Create Session, (gas policy, enforce paymaster)
      </Button> */}
      <Button
        variant="outline"
        onClick={() =>
          openSessionModal?.({
            policies: [
              toRateLimitPolicy({
                count: 2,
                interval: 60, // seconds
              }),
            ],
          })
        }
      >
        Create Session, (rate limit, 2tx/min)
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          openSessionModal?.({
            policies: [
              toTimestampPolicy({
                validAfter: 1704085200, // January 1, 2024 12:00 AM UTC
                validUntil: 1735707599, // December 31, 2024 11:59 PM UTC
              }),
            ],
          })
        }
      >
        Create Session, (after / before)
      </Button>

      {sessions &&
        Object.keys(sessions).map((sId, index) => {
          console.log({ sessions });
          const policiesStr = sessions[sId as `0x${string}`].policies
            .map((pol) => pol.policyParams.type)
            .join(", ");

          return (
            <SessionInfo
              key={index}
              sessionId={sId as `0x${string}`}
              policiesStr={policiesStr}
            />
          );
        })}
    </>
  );
}
