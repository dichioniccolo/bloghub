import { Head as BaseHead, Font } from "@react-email/components";

export default function Head(): JSX.Element {
  return (
    <BaseHead>
      {/* <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" /> */}
      <Font
        fontFamily="Roboto"
        fallbackFontFamily="Verdana"
        webFont={{
          url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
    </BaseHead>
  );
}
