import { Mjml, MjmlBody, MjmlWrapper } from "@faire/mjml-react";

import Footer from "./components/Footer";
import Head from "./components/Head";
import Header from "./components/Header";

export default function InvalidDomain({
  domain: _1,
  projectSlug: _2,
  invalidDays: _3,
}: {
  domain: string;
  projectSlug: string;
  invalidDays: number;
}): JSX.Element {
  return (
    <Mjml>
      <Head />
      <MjmlBody width={500}>
        <MjmlWrapper cssClass="container">
          <Header title="Invalid Domain Configuration" />
          {/* <MjmlSection cssClass="smooth">
            <MjmlColumn>
              <MjmlText cssClass="paragraph">Hey there!</MjmlText>
              <MjmlText cssClass="paragraph">
                I did a scan of all our projects and noticed that your domain{" "}
                <code>
                  <a
                    rel="nofollow"
                    style={{
                      textDecoration: "none",
                      color: `${purple} !important`,
                    }}
                  >
                    {domain}
                  </a>
                </code>{" "}
                for your Dub project{" "}
                <a href={`https://app.dub.sh/${projectSlug}`} target="_blank">
                  {projectSlug}↗
                </a>{" "}
                has been invalid for {invalidDays} days.
              </MjmlText>
              <MjmlText cssClass="paragraph">
                If your domain remains unconfigured for 30 days, it will be
                automatically deleted from Dub. Please click the link below to
                configure your domain.
              </MjmlText>
              <ButtonPrimary
                link={`https://app.dub.sh/${projectSlug}/domains`}
                uiText="Configure my domain"
              />
              <MjmlText cssClass="paragraph">
                If you do not want to keep this domain on Dub, you can{" "}
                <a
                  href={`https://app.dub.sh/${projectSlug}/domains`}
                  target="_blank"
                >
                  delete it
                </a>{" "}
                or simply ignore this email. To respect your inbox,{" "}
                {invalidDays < 28
                  ? `I will only send you one more email about this in ${
                      28 - invalidDays
                    } days.`
                  : "this will be the last time I'll email you about this."}
              </MjmlText>
              <MjmlText cssClass="paragraph" color={grayDark}>
                Steven from Dub
              </MjmlText>
              <Divider />
            </MjmlColumn>
          </MjmlSection> */}
          <Footer />
        </MjmlWrapper>
      </MjmlBody>
    </Mjml>
  );
}
