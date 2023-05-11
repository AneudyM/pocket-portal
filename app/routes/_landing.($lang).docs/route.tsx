import { Box, Grid } from "@pokt-foundation/pocket-blocks"
import { LoaderFunction, json } from "@remix-run/node"
import { Outlet, useLoaderData } from "@remix-run/react"
import { useEffect, useState } from "react"
import { LinksGroupProps } from "~/components/LinksGroup/LinksGroup"
import { Sidebar } from "~/components/Sidebar/Sidebar"
import { initCmsClient } from "~/models/cms/cms.server"
import { documentation } from "~/models/cms/sdk"

type LoaderData = {
  data: documentation[]
}

export const loader: LoaderFunction = async ({ params }) => {
  const routelang = params.lang !== undefined ? params.lang : "en-US"
  const cms = initCmsClient()

  try {
    const doc = await cms.getDocs({
      sort: ["id"],
      language: routelang,
    })

    return json<LoaderData>({
      data: doc.documentation,
    })
  } catch (e) {
    console.error(`Docs error in ${params.slug}: `, e)
    throw new Error(`Error: ${e}`)
  }
}

const replaceAll = (str: string, find: string, replace: string) => {
  return str.replace(new RegExp(find, "g"), replace)
}

export default function DocsLayout() {
  const { data }: LoaderData = useLoaderData()
  const [linksGroupItems, setLinksGroupItems] = useState<LinksGroupProps[]>([])

  useEffect(() => {
    if (data && data.length) {
      setLinksGroupItems(
        data.map((doc: documentation) => {
          return {
            label:
              doc.translations && doc.translations[0]?.title
                ? doc.translations[0].title
                : "",
            link: doc.slug ? doc.slug : "",
            slug: doc.slug ? doc.slug : "",
          }
        }),
      )
    }
  }, [data])

  return (
    <Grid
      gutter="md"
      sx={{
        alignItems: "flex-start",
        flexWrap: "nowrap",
        justifyContent: "flex-start",
      }}
    >
      {linksGroupItems && linksGroupItems.length ? (
        <Sidebar data={linksGroupItems} />
      ) : null}
      <Box ml="56px">
        <Outlet />
      </Box>
    </Grid>
  )
}
