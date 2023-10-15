import {
  Body,
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

interface RemovedFromProjectProps {
  siteName: string;
  projectName: string;
  userEmail: string;
}

export const RemovedFromProject = ({
  siteName = "MyBlog",
  projectName = "project name",
  userEmail = "you@example.com",
}: RemovedFromProjectProps) => {
  const previewText = `You have been removed from project on ${siteName}`;

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
              Removed from project on <strong>{siteName}</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {userEmail},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              this email is to inform you that you have been removed from
              project <strong>{projectName}</strong> on {siteName}.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This email was intended for{" "}
              <span className="text-black">{userEmail}</span>.
              {/* This link was
              sent from <span className="text-black">{linkFromIp}</span> located
              in <span className="text-black">{linkFromLocation}</span>. */}{" "}
              If you are concerned about your account&apos;s safety, please
              reply to this email to get in touch with us.
            </Text>
            <Link
              className="text-center text-xs"
              href={`app.${env.NEXT_PUBLIC_APP_DOMAIN}/settings/notifications`}
              target="_blank"
            >
              Set your email preferences
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default RemovedFromProject;
