import { Anchor, Select } from "@pokt-foundation/pocket-blocks"
import { NavLink } from "@remix-run/react"
import clsx from "clsx"
import React, { useEffect, useState } from "react"
import styles from "./styles.css"
// import { useTranslate } from "~/context/TranslateContext"
// import { IconApp, IconNetwork } from "~/components/shared/Icons"

/* c8 ignore start */
export const links = () => {
  return [{ rel: "stylesheet", href: styles }]
}
/* c8 ignore stop */

type NavProps = {
  routes: Route[]
  dropdown?: boolean
  appId?: string
  ariaLabel: string
}

type Route = {
  to: string
  label?: string
  icon?: React.ReactNode | (() => JSX.Element) | React.FunctionComponent
  end?: boolean
  external?: boolean
}

export const Nav = ({ routes, dropdown = false, appId, ariaLabel }: NavProps) => {
  const [mobilePageSelect, setMobilePageSelect] = useState<string | null>(null)

  const reformatRoute = (routes: Route[]) => {
    let routeTable = []
    for (let i = 0; i < routes.length; i += 1) {
      let label = routes[i].label !== undefined ? routes[i].label : "Back to all apps"
      routeTable.push({ value: routes[i].to, label: label })
    }
    return routeTable
  }

  useEffect(() => {
    if (mobilePageSelect !== null) {
      if (mobilePageSelect === "") {
        window.location.href = `/dashboard/apps/${appId}`
      } else if (mobilePageSelect === "/dashboard/apps") {
        window.location.href = mobilePageSelect
      } else {
        window.location.href = `/dashboard/apps/${appId}/${mobilePageSelect}`
      }
    }
  }, [appId, mobilePageSelect])

  const LinkLabel = ({ route }: { route: Route }) => {
    const Icon = route.icon
    return (
      <>
        {/* @ts-ignore eslint-disable-next-line */}
        {route.icon && <Icon width={22} />}
        {route.label && <span>{route.label}</span>}
      </>
    )
  }

  return (
    <nav aria-label={ariaLabel} className={clsx("pokt-nav", dropdown && "mobile")}>
      {dropdown && (
        <div className="mobile-navigation-dropdown">
          <Select
            aria-label="Application navigation"
            className="pokt-nav-dropdown"
            data={reformatRoute(routes)}
            placeholder="Navigate to..."
            onChange={(value) => {
              setMobilePageSelect(value)
            }}
          />
        </div>
      )}
      <ul className="menu">
        {routes.map((route) => (
          <li key={route.to}>
            {route.external ? (
              <Anchor
                className="nav-link"
                href={route.to}
                rel="noreferrer"
                sx={(theme) => ({
                  color: theme.white,
                  transition: "color 0.3s ease-in-out",
                  "&.active": {
                    color: theme.colors[theme.primaryColor][6],
                  },
                  "&:hover": {
                    color: theme.colors[theme.primaryColor][9],
                  },
                })}
                target="_blank"
                variant="text"
              >
                <LinkLabel route={route} />
              </Anchor>
            ) : (
              <Anchor
                className="nav-link"
                component={NavLink}
                end={route.end}
                styles={{}}
                sx={(theme) => ({
                  color: theme.white,
                  transition: "color 0.3s ease-in-out",
                  "&.active": {
                    color: theme.colors[theme.primaryColor][6],
                  },
                  "&:hover": {
                    color: theme.colors[theme.primaryColor][9],
                  },
                })}
                to={route.to}
              >
                <LinkLabel route={route} />
              </Anchor>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Nav
