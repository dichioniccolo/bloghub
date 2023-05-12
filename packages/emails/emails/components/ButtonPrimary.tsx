import { MjmlButton } from "mjml-react";

import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  lineHeight,
} from "../theme";

export default function ButtonPrimary({
  link,
  uiText,
}: {
  link: string;
  uiText: string;
}): JSX.Element {
  return (
    <>
      <MjmlButton
        lineHeight={lineHeight.tight}
        fontSize={fontSize.sm}
        fontWeight={fontWeight.slightBold}
        height={32}
        align="left"
        href={link}
        backgroundColor={colors.black}
        color={colors.grayLight}
        borderRadius={borderRadius.base}
        cssClass="light-mode"
      >
        {uiText}
      </MjmlButton>
      <MjmlButton
        lineHeight={lineHeight.tight}
        fontSize={fontSize.sm}
        fontWeight={fontWeight.slightBold}
        height={32}
        align="left"
        href={link}
        backgroundColor={colors.white}
        color={colors.black}
        borderRadius={borderRadius.base}
        cssClass="dark-mode"
      >
        {uiText}
      </MjmlButton>
    </>
  );
}
