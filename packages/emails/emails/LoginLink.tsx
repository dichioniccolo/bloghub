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

import Head from "./components/Head";

interface LoginLinkProps {
  siteName: string;
  url: string;
  userName?: string;
  userEmail?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const LoginLink = ({
  siteName = "MyBlog",
  url = "https://google.com",
  userName = "Niccolò Di Chio",
  userEmail = "me@email.com",
}: LoginLinkProps) => {
  const previewText = `Login link on ${siteName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/static/logo.png`}
                width="40"
                height="37"
                alt={siteName}
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Sign in on <strong>{siteName}</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {userName ?? userEmail},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              here is your login link to sign in on <strong>{siteName}</strong>.
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                pX={20}
                pY={12}
                className="rounded bg-[#000000] text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Sign in
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
              If you were not expecting this link, you can ignore this email. If
              you are concerned about your account&apos;s safety, please reply
              to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default LoginLink;
