import { Column, Section, Text } from "@react-email/components";

export default function Footer({
  unsubscribe,
  footnote = true,
}: {
  unsubscribe?: boolean;
  footnote?: boolean;
}): JSX.Element {
  return (
    <Section>
      <Column>
        <Text className="px-6 pb-6">
          © {new Date().getFullYear()}
          Niccolò Di Chio
          {unsubscribe && (
            <>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              <a href="{{{ pm:unsubscribe }}}" target="_blank">
                Unsubscribe
              </a>
            </>
          )}
        </Text>
        {footnote && (
          <Text className="px-6 pb-6">
            If you have any feedback or questions about this email, simply reply
            to it. I&apos;d love to hear from you!
          </Text>
        )}
      </Column>
    </Section>
  );
}
