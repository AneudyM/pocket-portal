import { Flex } from "@mantine/core"
import { Grid, useMantineTheme } from "@pokt-foundation/pocket-blocks"
import { LoaderFunction, json } from "@remix-run/node"
import { Outlet, useLoaderData, useLocation } from "@remix-run/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { flattenTree, nextNodeInTree, organizeData } from "../../utils/docs"
import DocsFooter from "./components/footer/footer"
import { LinksGroupProps } from "~/components/LinksGroup/LinksGroup"
import { Sidebar } from "~/components/Sidebar/Sidebar"
import { initCmsClient } from "~/models/cms/cms.server"
import { documentation } from "~/models/cms/sdk"
import DocumentationSearch from "~/routes/_landing.($lang).docs/components"
import { getClientEnv } from "~/utils/environment.server"
import DocsBreadcrumbs from "./components/Breadcrumbs/Breadcrumbs"

type LoaderData = {
  data: documentation[]
}

export const loader: LoaderFunction = async ({ params }) => {
  const routeLang = params.lang ?? "en-US"
  const cms = initCmsClient()
  const showOnlyPublished = getClientEnv().DOCS_STATUS === "published"

  try {
    const doc = await cms.getDocs({
      filter: {
        ...(showOnlyPublished && { status: { _eq: "published" } }),
      },
      sort: ["id"],
      language: routeLang,
    })

    return json<LoaderData>({
      data: doc.documentation,
    })
  } catch (e) {
    console.error(`Docs error in ${params.slug}: `, e)
    throw new Error(`Error: ${e}`)
  }
}

export default function DocsLayout() {
  const { data }: LoaderData = useLoaderData()
  const [linksGroupItems, setLinksGroupItems] = useState<LinksGroupProps[]>([])
  const organizeDataRef = useRef(organizeData)
  const location = useLocation()

  const flattenedTree = useMemo(() => flattenTree(linksGroupItems), [linksGroupItems])
  const nextDoc = nextNodeInTree(
    flattenedTree,
    flattenedTree.find((ft) => location.pathname.includes(ft.slug)),
  )

  const theme = useMantineTheme()

  useEffect(() => {
    if (data && data.length) {
      const organizedData = organizeDataRef.current(data)
      setLinksGroupItems(organizedData)
    }
  }, [data])

  return (
    <Flex direction="column">
      <Flex align="center" justify="flex-end" sx={{ zIndex: 1200 }}>
        <DocumentationSearch />
      </Flex>
      <Grid
        gutter="sm">
          <Grid.Col lg={2} md={12}
      >
        {linksGroupItems && linksGroupItems.length ? (
          <Sidebar data={linksGroupItems} />
        ) : null}
        </Grid.Col>
      <Grid.Col lg={8} md={12}>
          <DocsBreadcrumbs />
        <Outlet />
        {nextDoc && <DocsFooter nextDoc={nextDoc} />}
      </Grid.Col>
      </Grid>
    </Flex>
  )
}
