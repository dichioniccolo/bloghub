import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  siteName: string;
  userEmail?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const WelcomeEmail = ({
  siteName = "MyBlog",
  userEmail = "me@email.com",
}: WelcomeEmailProps) => {
  const previewText = `Welcome on ${siteName}`;

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
              Welcome on <strong>{siteName}</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {userEmail},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Thanks for signing up on <strong>{siteName}</strong>.
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              My name is Niccolò, and I&apos;m the creator of {siteName} -
              I&apos;m excited to have you on board!
            </Text>
            {/* <Section className="mb-[32px] mt-[32px] text-center">
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
            </Text> */}
            <Link
              className="text-center text-xs"
              href="{{{ pm:unsubscribe }}}"
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

export default WelcomeEmail;

// import {
//   Mjml,
//   MjmlBody,
//   MjmlColumn,
//   MjmlSection,
//   MjmlText,
//   MjmlWrapper,
// } from "@faire/mjml-react";

// import Divider from "./components/Divider";
// import Footer from "./components/Footer";
// import Head from "./components/Head";
// import Header from "./components/Header";

// export function WelcomeEmail({ email }: { email?: string }): JSX.Element {
//   return (
//     <Mjml>
//       <Head />
//       <MjmlBody width={500}>
//         <MjmlWrapper cssClass="container">
//           <Header title="Welcome" />
//           <MjmlSection padding="0">
//             <MjmlColumn>
//               {/* <MjmlImage
//                 cssClass="hero"
//                 padding="0"
//                 align="left"
//                 src="https://dub.sh/_static/thumbnail.png"
//               /> */}
//             </MjmlColumn>
//           </MjmlSection>
//           <MjmlSection cssClass="smooth">
//             <MjmlColumn>
//               <MjmlText cssClass="paragraph">
//                 Thanks for signing up{email && `, ${email}`}!
//               </MjmlText>
//               {/* <MjmlText cssClass="paragraph">
//                 My name is Steven, and I'm the creator of Dub - the open-source
//                 Bitly alternative. I'm excited to have you on board!
//               </MjmlText> */}
//               {/* <MjmlText cssClass="paragraph">
//                 Here are a few things you can do:
//               </MjmlText> */}
//               {/* <MjmlText cssClass="li">
//                 •&nbsp;&nbsp;Create a custom{" "}
//                 <a href="https://app.dub.sh/links" target="_blank">
//                   Dub.sh short link
//                 </a>
//               </MjmlText>
//               <MjmlText cssClass="li">
//                 •&nbsp;&nbsp;Create a new{" "}
//                 <a href="https://app.dub.sh/" target="_blank">
//                   project
//                 </a>{" "}
//                 and add your custom domain
//               </MjmlText>
//               <MjmlText cssClass="li">
//                 •&nbsp;&nbsp;Star the repo on{" "}
//                 <a href="https://github.com/steven-tey/dub" target="_blank">
//                   GitHub
//                 </a>
//               </MjmlText>
//               <MjmlText cssClass="li">
//                 •&nbsp;&nbsp;Follow us on{" "}
//                 <a href="https://twitter.com/dubdotsh/" target="_blank">
//                   Twitter
//                 </a>
//               </MjmlText>
//               <MjmlText cssClass="paragraph">
//                 Let me know if you have any questions or feedback. I'm always
//                 happy to help!
//               </MjmlText>
//               <MjmlText cssClass="paragraph" color={grayDark}>
//                 Steven from Dub
//               </MjmlText> */}
//               <Divider />
//             </MjmlColumn>
//           </MjmlSection>
//           <Footer unsubscribe />
//         </MjmlWrapper>
//       </MjmlBody>
//     </Mjml>
//   );
// }
