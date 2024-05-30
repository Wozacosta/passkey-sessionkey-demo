import { Receipt } from "./Receipt";
import { UserOpHash } from "./UserOpHash";

interface Props {
  allData: {userOpHash: `0x${string}`, receipt: any}[];
}

export function AllData({ allData }: Props) {
  return (
    <>
      {allData.map((d, index) => (
        <div key={index} style={{border: "1px solid red"}}>
          <UserOpHash userOpHash={d.userOpHash} />{"       "}
          <Receipt receipt={d.receipt} />
        </div>
      ))}
      </>
  );
}
