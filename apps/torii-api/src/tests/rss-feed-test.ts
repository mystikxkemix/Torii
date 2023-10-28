import Parser from "rss-parser";

const RssTest = async () => {
  const parser = new Parser();
  const feed = await parser.parseURL(
    "https://nyaa.si/?page=rss&q=eminence+in+shadow+S02+vostfr+1080p+AAC&c=0_0&f=0"
  );

  const date = new Date(feed.items[0].isoDate ?? "");
  const now = new Date();
};

export default RssTest;
