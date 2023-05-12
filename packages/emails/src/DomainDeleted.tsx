import { Mjml, MjmlBody, MjmlWrapper } from "@faire/mjml-react";

import Footer from "./components/Footer";
import Head from "./components/Head";
import Header from "./components/Header";

export default function DomainDeleted({
  domain: _1,
  projectSlug: _2,
}: {
  domain: string;
  projectSlug: string;
}): JSX.Element {
  return (
    <Mjml>
      <Head />
      <MjmlBody width={500}>
        <MjmlWrapper cssClass="container">
          <Header title="Domain Deleted" />
          {/* <MjmlSection cssClass="smooth">
            <MjmlColumn>
              <MjmlText cssClass="paragraph">Hey there!</MjmlText>
              <MjmlText cssClass="paragraph">
                Just wanted to let you know that your domain{" "}
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
                has been invalid for 30 days. As a result, it has been deleted
                from Dub.
              </MjmlText>
              <MjmlText cssClass="paragraph">
                If you would like to restore the domain, you can easily create
                it again on Dub with the link below.
              </MjmlText>
              <ButtonPrimary
                link={`https://app.dub.sh/${projectSlug}/domains`}
                uiText="Add a domain"
              />
              <MjmlText cssClass="paragraph">
                If you did not want to keep using this domain on Dub anyway, you
                can simply ignore this email.
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
