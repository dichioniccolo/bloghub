import { MjmlColumn, MjmlSection, MjmlText, MjmlWrapper } from "mjml-react";

import BaseLayout from "./components/BaseLayout";
import ButtonPrimary from "./components/ButtonPrimary";
import Divider from "./components/Divider";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { colors } from "./theme";

export default function LoginLink({
  siteName,
  url,
}: {
  siteName: string;
  url: string;
}): JSX.Element {
  return (
    <BaseLayout width={500}>
      <MjmlWrapper cssClass="container">
        <Header title="Your Login Link" />
        <MjmlSection cssClass="smooth">
          <MjmlColumn>
            <MjmlText cssClass="paragraph">Welcome to {siteName}!</MjmlText>
            <MjmlText cssClass="paragraph">
              Please click the magic link below to sign in to your account.
            </MjmlText>
            <ButtonPrimary link={url} uiText="Sign In" />
            <MjmlText cssClass="paragraph">
              If you&apos;re on a mobile device, you can also copy the link
              below and paste it into the browser of your choice.
            </MjmlText>
            <MjmlText cssClass="paragraph">
              <a
                rel="nofollow"
                style={{
                  textDecoration: "none",
                  color: `${colors.purple} !important`,
                }}
              >
                {url.replace(/^https?:\/\//, "")}
              </a>
            </MjmlText>
            <MjmlText cssClass="paragraph">
              If you did not request this email, you can safely ignore it.
            </MjmlText>
            <Divider />
          </MjmlColumn>
        </MjmlSection>
        <Footer footnote={false} />
      </MjmlWrapper>
    </BaseLayout>
  );
}
