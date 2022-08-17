import styles from "./styles.css"
import { getImageForChain } from "~/utils/known-chains/known-chains"

/* c8 ignore next */
export const links = () => {
  return [{ rel: "stylesheet", href: styles }]
}

export interface AppEndpointProps {
  chain: string
  label?: string
}

export default function ChainWithImage({ chain, label = chain }: AppEndpointProps) {
  return (
    <span className="pokt-chain-with-image">
      {getImageForChain(chain) && <img alt={chain} src={getImageForChain(chain)} />}
      <p>{label}</p>
    </span>
  )
}
