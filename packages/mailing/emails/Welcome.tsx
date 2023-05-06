import { MjmlColumn, MjmlSection, MjmlText, MjmlWrapper } from "mjml-react";

import BaseLayout from "./components/BaseLayout";
import Divider from "./components/Divider";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { colors } from "./theme";

export default function Welcome({
  siteName,
  email,
}: {
  siteName: string;
  email?: string | null;
}): JSX.Element {
  return (
    <BaseLayout>
      <MjmlWrapper cssClass="container">
        <Header title={`Welcome to ${siteName}`} />
        <MjmlSection cssClass="smooth">
          <MjmlColumn>
            <MjmlText cssClass="paragraph">
              Thanks for signing up{email && `, ${email}`}!
            </MjmlText>
            <MjmlText cssClass="paragraph">
              My name is Niccolò, and I&apos;m the creator of {siteName}.
              I&apos;m excited to have you on board!
            </MjmlText>
            <MjmlText cssClass="paragraph">
              Let me know if you have any questions or feedback. I&apos;m always
              happy to help!
            </MjmlText>
            <MjmlText cssClass="paragraph" color={colors.grayDark}>
              Niccolò Di Chio
            </MjmlText>
            <Divider />
          </MjmlColumn>
        </MjmlSection>
        <Footer unsubscribe />
      </MjmlWrapper>
    </BaseLayout>
  );
}
