module.exports = {
  siteMetadata: {
    name: "Cooked Rice",
    siteUrl: "https://cooked-rice.com",
    title: "Cooked Rice",
    description: `The AVAX Reward Pool with the lowest Dev fes`,
    socials: [/* { name: "telegramGroup", url: "https://t.me/GarfieldFamily" } */],
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
