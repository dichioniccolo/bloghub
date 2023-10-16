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

interface AutomaticProjectDeletionProps {
  siteName: string;
  projectName: string;
  domain: string;
  invalidDays: number;
  ownerEmail: string;
}

export const AutomaticProjectDeletion = ({
  siteName = "MyBlog",
  projectName = "Pippo",
  domain = "google.com",
  invalidDays = 3,
  ownerEmail = "me@email.com",
}: AutomaticProjectDeletionProps) => {
  const previewText = `Your ${siteName} project with domain ${domain} was softly deleted because the domain was invalid for ${invalidDays} days.`;

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
              Hey there!
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Just wanted to let you know that your domain{" "}
              <Link rel="nofollow" className="text-blue-600 no-underline">
                {domain}
              </Link>{" "}
              for project <strong>{projectName}</strong> has been invalid for{" "}
              {invalidDays} days.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Therefore, your project was softly deleted. If you would like to
              restore the project, please contact us at{" "}
              <Link
                rel="nofollow"
                className="text-blue-600 no-underline"
                href="mailto:niccolo@bloghub.it"
              >
                niccolo@bloghub.it
              </Link>
              . We will be happy to help you restore your project.
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                pX={20}
                pY={12}
                className="rounded bg-[#000000] text-center text-[12px] font-semibold text-white no-underline"
                href={env.NEXT_PUBLIC_APP_DOMAIN}
              >
                Create project
              </Button>
            </Section>
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

export default AutomaticProjectDeletion;
