"use client";
import {
  ConnectButton,
  CreateCustomizedKernelButton,
} from "@/components/Button";
import Navbar from "@/components/Navbar";
import SessionBlock from "@/components/SessionBlock";
import SmartAccountBlock from "@/components/SmartAccountBlock";
import { Flex } from "@mantine/core";
import { useKernelClient } from "@zerodev/waas";
import { useState } from "react";

export default function Home() {
  const { isConnected } = useKernelClient();
  const [checked, setChecked] = useState(true);

  return (
    <Flex direction="column" w="100vw" h="100vh">
      <Navbar />
      <div className="flex mt-8 flex-col justify-center items-center">
        <>
          {!isConnected ? (
            <div className="flex flex-row justify-between space-x-4">
              <ConnectButton version={checked ? "v3" : "v2"} />
              <CreateCustomizedKernelButton />
            </div>
          ) : (
            <>
              <SmartAccountBlock />
              <div className="mt-10"></div>
              <SessionBlock />
            </>
          )}
        </>
      </div>
    </Flex>
  );
}
