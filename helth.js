import https from "https";
import "dotenv/config";
import { REST } from "@discordjs/rest";
import { ChannelsAPI } from "@discordjs/core";

const channelId = process.env.DC_CHANNEL_ID;
const token = process.env.DC_TOKEN;

const rest = new REST({ version: "10" }).setToken(token);
const channelsApi = new ChannelsAPI(rest);

const websites = [
  { name: "Charity Royale Website", url: "https://charityroyale.at" },
  {
    name: "Charity Royale Control Panel",
    url: "https://charityroyale.hammertime.studio/login",
  },
  {
    name: "Charity Royale Stats",
    url: "https://stats.hammertime.studio/dhalucard/twitter",
  },
];

const checkWebsiteStatus = (website) => {
  const req = https.get(website.url, (res) => {
    if (res.statusCode === 200) {
      const message = website.name + " is UP. Status code: 200  :green_circle:";
      channelsApi.createMessage(channelId, { content: message });
    } else {
      const message =
        "@here " +
        website.name +
        " is DOWN :skull: . Status code: " +
        res.statusCode;
      channelsApi.createMessage(channelId, { content: message });
    }
    res.resume(); // consume the response data to free up memory
  });

  req.on("error", (error) => {
    const message =
      "@here " + website.name + " is DOWN :skull: . Error: " + error.message;
    channelsApi.createMessage(channelId, { content: message });
  });
};

const checkAllWebsites = () => {
  for (const website of websites) {
    checkWebsiteStatus(website);
  }
};

const minutes = 60;
const interval = minutes * 60 * 1000;
const startHelth = () => {
  channelsApi.createMessage(channelId, {
    content:
      "Startup check. This will now run every " +
      minutes +
      " minutes. Please mute the server if you have not.",
  });
  checkAllWebsites();
  setInterval(checkAllWebsites, interval);
};

startHelth();
