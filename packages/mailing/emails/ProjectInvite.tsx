import { MjmlColumn, MjmlSection, MjmlText, MjmlWrapper } from "mjml-react";

import BaseLayout from "./components/BaseLayout";
import ButtonPrimary from "./components/ButtonPrimary";
import Divider from "./components/Divider";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { colors } from "./theme";

type Props = {
  url: string;
  projectName: string;
  siteName: string;
};

export default function ProjectInvite({ url, projectName, siteName }: Props) {
  return (
    <BaseLayout>
      <MjmlWrapper cssClass="container">
        <Header title="You've been invited to join a project!" />
        <MjmlSection cssClass="smooth">
          <MjmlColumn>
            <MjmlText cssClass="paragraph">
              You&apos;ve been invited to join the{" "}
              <strong>{projectName}</strong> project on {siteName}!
            </MjmlText>
            <MjmlText cssClass="paragraph">
              You can use the magic link below to sign in and join the project.
            </MjmlText>
            <ButtonPrimary link={url} uiText="Join Project" />
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
