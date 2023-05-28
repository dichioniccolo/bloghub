import {
  Body,
  Container,
  Heading,
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
  unsubscribeUrl: string;
}

export const RemovedFromProject = ({
  siteName = "MyBlog",
  projectName = "project name",
  userEmail = "you@example.com",
  unsubscribeUrl = "https://example.com",
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
                src={`${env.NEXT_PUBLIC_APP_URL}/static/logo.png`}
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
              you have been removed from project <strong>{projectName}</strong>{" "}
              on {siteName}.
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

export default RemovedFromProject;
