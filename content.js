let titleElement = null;

const intervalID = setInterval(() => {
  titleElement = document.querySelector("h1.title > yt-formatted-string");
  let songTitle = titleElement?.innerHTML;

  if (songTitle) {
    const div = document.createElement("div");
    div.id = "open-on-genius-div";

    const button = document.createElement("img");
    button.src = browser.runtime.getURL("images/genius.png");
    button.id = "open-on-genius-button";

    const openText = document.createElement("span");
    openText.textContent = "Open on Genius";
    openText.id = "open-on-genius-text";

    div.appendChild(button);
    div.appendChild(openText);
    div.onclick = () => {
      let artistName = undefined;
      if (
        document
          .querySelector("div.ytd-video-secondary-info-renderer#description")
          .innerHTML.includes("Auto-generated by YouTube.")
      ) {
        artistName = document.querySelector("ytd-channel-name a").innerHTML;
      }
      browser.runtime.sendMessage({
        songTitle,
        ...(artistName && { artistName }),
      });
    };
    titleElement.insertAdjacentElement("afterend", div);

    new MutationObserver(() => {
      songTitle = titleElement?.innerHTML;
    }).observe(titleElement, {
      subtree: true,
      childList: true,
    });

    clearInterval(intervalID);
  }
}, 200);
