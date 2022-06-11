import styles from "./styles.css"
import Table, { links as TableLinks } from "~/components/shared/Table"
import { useMemo } from "react"
import { EndpointRpcError } from "~/models/portal.server"
import Tooltip from "~/components/shared/Tooltip"
import { IconClock } from "@pokt-foundation/ui"
import CopyTextIcon, {
  links as CopyTextIconLinks,
} from "~/components/shared/CopyTextIcon"
import Group from "~/components/shared/Group"

export const links = () => {
  return [...TableLinks(), ...CopyTextIconLinks(), { rel: "stylesheet", href: styles }]
}

interface RequestsErrorsCardProps {
  errorMetrics: EndpointRpcError[]
}

export default function AppRequestsErrorsCard({ errorMetrics }: RequestsErrorsCardProps) {
  const tableData = useMemo(() => {
    return errorMetrics
      .map((error, index) => {
        const date = new Date(error.timestamp)
        return {
          id: `${error.timestamp}-${error.nodepublickey}-${error.bytes}-${index}`,
          method: error.method,
          address: {
            value: error.nodepublickey,
            element: (
              <Group>
                <p className="pokt-table-ellipsis">{error.nodepublickey}</p>
                <CopyTextIcon text={error.nodepublickey} />
              </Group>
            ),
          },
          size: `${error.bytes}B`,
          timestamp: {
            value: `${date.toDateString()} ${date.toTimeString()}`,
            element: (
              <Tooltip
                withArrow
                transition="fade"
                transitionDuration={200}
                label={`${date.toDateString()} ${date.toTimeString()}`}
              >
                <div>
                  <IconClock />
                </div>
              </Tooltip>
            ),
          },
        }
      })
      .filter((error) => !error.method.includes("check"))
  }, [errorMetrics])

  return (
    <div className="pokt-app-requests-by-origin">
      <Table
        label="Requests Errors"
        data={tableData}
        columns={["Type", "Node", "Size", "Date"]}
        paginate={{
          perPage: 10,
        }}
        search
      />
    </div>
  )
}
