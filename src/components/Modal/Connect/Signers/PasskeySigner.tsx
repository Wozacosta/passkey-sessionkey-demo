import { Button, Flex, TextInput } from "@mantine/core";
import {
  KernelVersionType,
  useCreateKernelClientPasskey
} from "@zerodev/waas";
import { useEffect, useState } from "react";

// const publicClient = createPublicClient({
//   transport: http(ZERODEV_BUNDLER_URL),
// });

export default function PasskeySigner({
  version,
}: {
  version: KernelVersionType;
}) {
  const [username, setUsername] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const { connectRegister, connectLogin, data, error } =
    useCreateKernelClientPasskey({ version: version });

  // const createPasskey = async (name: string) => {
  // const passkeyValidator = await createPasskeyValidator(publicClient, {
  //   passkeyName: name,
  //   passkeyServerUrl: "your passkey server URL",
  //   entryPoint: ENTRYPOINT_ADDRESS_V07,
  // })
  // }

  useEffect(() => {
    if (error) {
      setIsLoginLoading(false);
      setIsRegisterLoading(false);
    }
  }, [error]);

  return (
    <Flex justify="between" align="center" style={{ width: "100%" }}>
      <Flex
        flex={1}
        direction="column"
        align="center"
        style={{ padding: "3px" }}
      >
        <TextInput
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
          placeholder="Passkey Name"
          style={{ marginBottom: "3px", padding: "3px" }}
        />
        <Button
          variant="outline"
          style={{ padding: "3px" }}
          loading={isRegisterLoading}
          disabled={isRegisterLoading || isLoginLoading || !username}
          onClick={() => {
            setIsRegisterLoading(true);
            connectRegister({ username });
          }}
        >
          Register
        </Button>
      </Flex>

      <Flex flex={1} justify="center" style={{ padding: "5px" }}>
        <Button
          variant="outline"
          style={{ marginLeft: "3px", padding: "3px" }}
          loading={isLoginLoading}
          disabled={isRegisterLoading || isLoginLoading}
          onClick={() => {
            setIsLoginLoading(true);
            connectLogin();
          }}
        >
          Login
        </Button>
      </Flex>
    </Flex>
  );
}
