const removeThese = [
  "official video",
  "music video",
  "official audio",
  "official",
  "video",
  "audio",
  "ft.",
  "feat.",
  "featuring",
  "prod.",
  "prod",
  "()",
  "[]",
  "-",
  "x",
];

browser.runtime.onMessage.addListener((message) => {
  let sanitizedName = null;

  if (message?.artistName) {
    sanitizedName = Object.values(message).join(" ");
  } else {
    sanitizedName = message?.songTitle.toLowerCase();
    removeThese.forEach((str) => {
      sanitizedName = sanitizedName.replace(str, "");
    });
  }

  findOnGenius(sanitizedName);
});

function findOnGenius(sanitizedName) {
  console.log(sanitizedName);
  const geniusToken =
    "Bearer PcPAfOlYQSjAYOvfNVHuj4vlHbGxAVzWF8xM8Ifja_fWeDdfjqSG8VwQlNqNJ5mF";
  const request = new Request(
    `https://api.genius.com/search?q=${sanitizedName}`,
    {
      method: "GET",
      headers: {
        Authorization: geniusToken,
      },
      mode: "cors",
    }
  );
  fetch(request)
    .then((response) => response.json())
    .then((json) => {
      url = json?.response?.hits[0]?.result?.url;
      if (url) {
        browser.tabs.create({ url });
      } else {
        browser.runtime.sendMessage();
      }
      console.log(json);
    });
}
