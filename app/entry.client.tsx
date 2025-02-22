import { ClientProvider } from "@mantine/remix"
import { RemixBrowser } from "@remix-run/react"
// import { startTransition, StrictMode } from "react"
import { hydrate } from "react-dom"
// import { hydrateRoot } from "react-dom/client"

// function hydrate() {
//   startTransition(() => {
//     hydrateRoot(
//       document,
//       <StrictMode>
//         <ClientProvider>
//           <RemixBrowser />
//         </ClientProvider>
//       </StrictMode>,
//     )
//   })
// }

// if (typeof requestIdleCallback === "function") {
//   requestIdleCallback(hydrate)
// } else {
//   // Safari doesn't support requestIdleCallback
//   // https://caniuse.com/requestidlecallback
//   setTimeout(hydrate, 1)
// }

hydrate(
  <ClientProvider>
    <RemixBrowser />
  </ClientProvider>,
  document,
)
