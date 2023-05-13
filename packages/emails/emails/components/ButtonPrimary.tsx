import { Button } from "@react-email/components";

export default function ButtonPrimary({
  link,
  uiText,
}: {
  link: string;
  uiText: string;
}): JSX.Element {
  return (
    <>
      <Button
        className="h-8 rounded-lg bg-black text-left text-sm font-semibold leading-tight text-gray-200"
        href={link}
      >
        {uiText}
      </Button>
      {/* <MjmlButton
        lineHeight={leadingTight}
        fontSize={textSm}
        fontWeight="600"
        height={32}
        align="left"
        href={link}
        backgroundColor={white}
        color={black}
        borderRadius={borderBase}
        cssClass="dark-mode"
      >
        {uiText}
      </MjmlButton> */}
    </>
  );
}
