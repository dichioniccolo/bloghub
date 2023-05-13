import { Column, Section, Text } from "@react-email/components";

export default function Header({ title }: { title: string }): JSX.Element {
  return (
    <Section>
      <Column>
        {/* <MjmlImage
          padding="12px 0 24px"
          width="44px"
          height="44px"
          align="center"
          src="https://dub.sh/_static/logo.png"
          cssClass="logo"
        /> */}
        <Text className="text-center text-2xl">{title}</Text>
      </Column>
    </Section>
  );
}
