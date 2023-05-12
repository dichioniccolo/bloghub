import {
  MjmlAll,
  MjmlAttributes,
  MjmlFont,
  MjmlHead,
  MjmlRaw,
  MjmlStyle,
} from "mjml-react";

import {
  borderRadius,
  colors,
  fontFamily,
  fontSize,
  screens,
  spacing,
} from "../theme";

const { black, blue, grayDark, grayLight, purple } = colors;

export default function Head({ style }: { style?: string }): JSX.Element {
  return (
    <MjmlHead>
      <>
        <MjmlRaw>
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
        </MjmlRaw>
        <MjmlFont
          name="Inter"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700"
        />
        <MjmlStyle>{`
        body {
            -webkit-font-smoothing: antialiased;
            min-width: 320px;
            background-color: ${colors.white};
          }
          a {
            color: inherit
          }
          .gutter {
            padding-left: ${spacing.s7}px;
            padding-right: ${spacing.s7}px;
          }
          .code {
            font-family: ${fontFamily.mono};
            color: ${colors.green200};
            background-color: ${colors.zinc800};
            font-size: ${fontSize.sm}px;
            border-radius: ${borderRadius.sm}px;
            padding: ${spacing.s1}px ${spacing.s3}px;
          }
          .no-wrap {
            white-space: nowrap;
          }
          .hidden {
            display: none;
            max-width: 0px;
            max-height: 0px;
            overflow: hidden;
            mso-hide: all;
          }
          .lg-hidden {
            display: none;
            max-width: 0px;
            max-height: 0px;
            overflow: hidden;
            mso-hide: all;
          }

          /* Large screens */
          @media (min-width:${screens.xs}) {
            .gutter {
              padding-left: ${spacing.s9}px;
              padding-right: ${spacing.s9}px;
            }
            .sm-hidden {
              display: none;
              max-width: 0px;
              max-height: 0px;
              overflow: hidden;
              mso-hide: all;
            }
            .lg-hidden {
              display: block !important;
              max-width: none !important;
              max-height: none !important;
              overflow: visible !important;
              mso-hide: none !important;
            }
          }

        .container {
          border: solid 1px ${grayLight};
          border-radius: 8px;
          background-position-y: 50%;
        }
        strong {
          font-weight: 700;
        }
        .smooth {
          -webkit-font-smoothing: antialiased;
        }
        .title > * {
          font-size: 24px !important;
        }
        .subtitle > * {
          font-size: 16px !important;
          font-weight: 700;
        }
        .paragraph > * {
          font-size: 14px !important;
          line-height: 24px !important;
          white-space: pre-wrap !important;
        }
        .li > * {
          font-size: 14px !important;
          line-height: 12px !important;
        }
        .paragraph a, .li a {
          color: ${blue} !important;
          text-decoration: none;
        }
        .paragraph code, .li code {
          color: ${purple} !important;
        }
        .footer {
          padding: 0 24px 24px !important;
        }
        .footer > * {
          font-size: 13px !important;
          line-height: 22px !important;
          color: ${grayDark} !important;
        }
        .footer a {
          color: ${grayDark} !important;
          text-decoration: none;
        }
        .dark-mode {
          display: none;
        }
        @media (min-width:480px) {
          body {
            padding: 48px 0;
          }
          .container {
            padding: 0 48px;
          }
          td.hero {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
        }
        @media (prefers-color-scheme: dark) {
          body {
            background: ${black};
          }
          .container {
            border: solid 1px ${grayDark};
          }
          .logo > * {
            filter: invert(1) !important;
          }
          .title > * {
            color: #fff !important;
          }
          .subtitle > * {
            color: #fff !important;
          }
          .paragraph > *, .li > * {
            color: #fff !important;
          }
          .dark-mode {
            display: block;
          }
          .light-mode {
            display: none;
          }
        }

          /* Email specific Styles */
        ${style}
      `}</MjmlStyle>
        <MjmlAttributes>
          <MjmlAll font-family='Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' />
        </MjmlAttributes>
      </>
    </MjmlHead>
  );
}
