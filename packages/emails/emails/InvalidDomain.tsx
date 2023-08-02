import {
  Body,
  Button,
  Container,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { env } from "../env.mjs";
import Head from "./components/Head";

interface InvalidDomainProps {
  siteName: string;
  projectId: string;
  projectName: string;
  domain: string;
  invalidDays: number;
  ownerEmail: string;
  unsubscribeUrl: string;
}

export const InvalidDomain = ({
  siteName = "MyBlog",
  projectId = "abcd",
  projectName = "Pippo",
  domain = "google.com",
  invalidDays = 3,
  ownerEmail = "me@email.com",
  unsubscribeUrl = "https://example.com/unsubscribe",
}: InvalidDomainProps) => {
  const previewText = `Your ${siteName} domain ${domain} is not configured`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[500px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${env.NEXT_PUBLIC_APP_DOMAIN}/_static/logo.png`}
                width="40"
                height="37"
                alt={siteName}
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Hey there!
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              I did a scan of all our projects and noticed that your domain{" "}
              <Link rel="nofollow" className="text-blue-600 no-underline">
                {domain}
              </Link>{" "}
              for project <strong>{projectName}</strong> has been invalid for{" "}
              {invalidDays} days.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              If your domain remains unconfigured for 7 days, your project will
              be automatically deleted. Please click the link below to configure
              your domain.
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                pX={20}
                pY={12}
                className="rounded bg-[#000000] text-center text-[12px] font-semibold text-white no-underline"
                href={`${env.NEXT_PUBLIC_APP_DOMAIN}/projects/${projectId}/settings`}
              >
                Configure domain
              </Button>
            </Section>
            <Hr />
            <Text className="text-[14px] leading-[24px] text-black">
              If you do not want to keep this project, you can{" "}
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                pX={20}
                pY={12}
                className="rounded bg-[#000000] text-center text-[12px] font-semibold text-white no-underline"
                href={`${env.NEXT_PUBLIC_APP_DOMAIN}/projects/${projectId}/settings`}
              >
                Delete it
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or simply ignore this email.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This email was intended for{" "}
              <span className="text-black">{ownerEmail}</span>. If you were not
              expecting this email, you can ignore it. If you are concerned
              about your account&apos;s safety, please reply to this email to
              get in touch with us.
            </Text>
            <Link
              className="text-center text-xs"
              href={unsubscribeUrl}
              target="_blank"
            >
              Unsubscribe
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InvalidDomain;
