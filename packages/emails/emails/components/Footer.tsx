import { MjmlColumn, MjmlSection, MjmlText } from "mjml-react";

export default function Footer({
  unsubscribe,
  footnote = true,
}: {
  unsubscribe?: boolean;
  footnote?: boolean;
}): JSX.Element {
  return (
    <MjmlSection cssClass="smooth">
      <MjmlColumn>
        <MjmlText cssClass="footer">
          © {new Date().getFullYear()} Niccolò Di Chio
          {unsubscribe && (
            <>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              <a href="{{{ pm:unsubscribe }}}" target="_blank">
                {/* <a href={EMAIL_PREFERENCES_URL} target="_blank"> */}
                Unsubscribe
              </a>
            </>
          )}
        </MjmlText>
        {footnote && (
          <MjmlText cssClass="footer">
            If you have any feedback or questions about this email, simply reply
            to it. I&apos;d love to hear from you!
          </MjmlText>
        )}
      </MjmlColumn>
    </MjmlSection>
  );
}
