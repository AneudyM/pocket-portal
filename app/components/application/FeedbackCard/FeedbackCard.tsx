import styles from "./styles.css"
import Card, { links as CardLinks } from "~/components/Card"
import IconDiscord from "~/components/Icons/IconDiscord"
import { useTranslate } from "~/context/TranslateContext"

/* c8 ignore start */
export const links = () => {
  return [...CardLinks(), { rel: "stylesheet", href: styles }]
}
/* c8 ignore stop */

export default function FeedbackCard({ className }: { className?: string }) {
  const {
    t: { feedback },
  } = useTranslate()

  return (
    <a
      aria-label={feedback.discordAriaLabel}
      href="https://discord.gg/portal-rpc"
      rel="noreferrer"
      target="_blank"
    >
      <Card
        sx={{
          "&:hover": {
            backgroundColor: "var(--mantine-color-navy-6)",
          },
        }}
      >
        <div className="feedback box">
          <div className="top">
            <div className="row">
              <div className="spaceholder">
                <img
                  alt={feedback.feedbackShareAltText}
                  aria-hidden="true"
                  className="image"
                  src="/share-feedback.svg"
                />
              </div>
              <div>
                <h3 className="title">{feedback.feedbackTitle}</h3>
                <p className="bodytext">{feedback.feedbackSubText}</p>
              </div>
            </div>

            <IconDiscord className="discord-icon" />
          </div>
        </div>
      </Card>
    </a>
  )
}
