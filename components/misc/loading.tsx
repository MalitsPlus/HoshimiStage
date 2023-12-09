import { Overlay } from "@mantine/core";
import { IconLoader2 } from "@tabler/icons";

export function Loading() {
  return (
    <Overlay<"div"> opacity={0.8} color="#000" zIndex={1001} className="flex flex-col justify-center items-center" >
      <IconLoader2 width={150} height={150} className="animate-spin-cubic-bezier" />
      <p className='font-mono text-xl'>loading...</p>
    </Overlay>
  )
}
