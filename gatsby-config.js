module.exports = {
  siteMetadata: {
    name: "Cooked Rice",
    siteUrl: "https://cookedrice.io",
    title: "Cooked Rice",
    description: `The AVAX Reward Pool with the lowest Dev fes`,
    socials: [
      { name: "telegramGroup", url: "https://t.me/CookRice" },
      {
        name: "twitter",
        url: "https://twitter.com/CookedR1ce?t=rs8PW7Mp2jK0WaMOz6GQdQ&s=09",
      },
      { name: "discord", url: "https://discord.gg/cook3drice" },
    ],
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-plugin-layout",
      options: {
        component: require.resolve("./src/components/AppWrapper.tsx"),
      },
    },
  ],
};
