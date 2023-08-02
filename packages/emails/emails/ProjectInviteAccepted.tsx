import {
  Body,
  Container,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { env } from "../env.mjs";
import Head from "./components/Head";

interface ProjectInviteAcceptedProps {
  siteName: string;
  ownerEmail: string;
  ownerName?: string | null;
  userEmail?: string;
}

export const ProjectInviteAccepted = ({
  siteName = "MyBlog",
  ownerEmail = "owner@email.com",
  ownerName = "John Doe",
  userEmail = "user@email.com",
}: ProjectInviteAcceptedProps) => {
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
              Invitation accepted
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {ownerName ?? ownerEmail},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              the user {userEmail} has accepted your invitation to join your
              project on <strong>{siteName}</strong>.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This email was intended for{" "}
              <span className="text-black">{ownerEmail}</span>.
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

export default ProjectInviteAccepted;
