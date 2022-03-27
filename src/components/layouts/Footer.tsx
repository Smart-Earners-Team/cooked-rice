import { graphql, StaticQuery } from "gatsby";
import React from "react";
import { FaDiscord, FaTelegram, FaTwitter } from "react-icons/fa";
import { StaticImage } from "gatsby-plugin-image";

const footerQuery = graphql`
  query FooterComponentQuery {
    site {
      siteMetadata {
        name
        socials {
          name
          url
        }
      }
    }
  }
`;

type SocialIconTypes = "twitter" | "telegramGroup" | "discord";

interface FooterQueryReturnType {
  site: {
    siteMetadata: {
      name: string;
      socials: {
        name: SocialIconTypes;
        url: string;
      }[];
    };
  };
}
interface FooterProps extends React.ComponentProps<"footer"> {}
export default function Footer(_props: FooterProps) {
  return (
    <StaticQuery
      query={footerQuery}
      render={(data: FooterQueryReturnType) => {
        const { name, socials } = data.site.siteMetadata;
        return (
          <footer className="text-center mt-10 space-y-3">
            <div className="text-center text-sm text-gray-600">Audited by:</div>
            <a
              href="https://tteb.finance/"
              className="w-11/12 max-w-[200px] mx-auto block"
            >
              <StaticImage
                src="../../images/tteb-logo.jpg"
                alt="TTEB Logo"
                placeholder="blurred"
                layout="fullWidth"
              />
            </a>
            <div className="flex justify-center items-center space-x-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full shadow-md p-2 bg-white"
                >
                  {getSocialIcon(social.name)}
                </a>
              ))}
              <a
                href="https://www.avax.network/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full shadow-md p-2 inline-block bg-white hover:opacity-70"
              >
                <StaticImage
                  src="../../images/avax-logo.png"
                  alt="TTEB Logo"
                  placeholder="blurred"
                  layout="fullWidth"
                  className="rounded-full w-8 h-8"
                />
              </a>
            </div>
            <div className="text-xs mt-5">
              copyright &copy; {name} - {new Date().getFullYear()}
            </div>
          </footer>
        );
      }}
    />
  );
}

const getSocialIcon = (name: SocialIconTypes) => {
  let svgIcon = <></>;
  const iconClass = "w-8 h-8 text-red-500 hover:text-red-400";
  switch (name) {
    case "twitter":
      svgIcon = <FaTwitter className={iconClass} title={name} />;
      break;
    case "telegramGroup":
      svgIcon = <FaTelegram className={iconClass} title={name} />;
      break;
    case "discord":
      svgIcon = <FaDiscord className={iconClass} title={name} />;
      break;

    default:
      break;
  }
  return svgIcon;
};
