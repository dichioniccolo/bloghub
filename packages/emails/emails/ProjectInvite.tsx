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

import { env } from "../env";
import Head from "./components/Head";

interface ProjectInviteProps {
  siteName: string;
  url: string;
  userEmail?: string;
}

export const ProjectInvite = ({
  siteName = "MyBlog",
  url = "https://google.com",
  userEmail = "me@email.com",
}: ProjectInviteProps) => {
  const previewText = `You have been invited to join a project on ${siteName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[500px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`https://${env.NEXT_PUBLIC_APP_DOMAIN}/_static/logo.png`}
                width="40"
                height="37"
                alt={siteName}
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Invitation on <strong>{siteName}</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {userEmail},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              you have been invited to join a project on{" "}
              <strong>{siteName}</strong>.
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Accept
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link href={url} className="text-blue-600 no-underline">
                {url}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This link was intended for{" "}
              <span className="text-black">{userEmail}</span>.
              {/* This link was
              sent from <span className="text-black">{linkFromIp}</span> located
              in <span className="text-black">{linkFromLocation}</span>. */}{" "}
              If you were not expecting this invitation, you can ignore this
              email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ProjectInvite;
