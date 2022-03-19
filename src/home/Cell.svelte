<script>
  import { matchSoundCloudUrl, matchYoutubeUrl } from "./../utils/util.js";
  import { getDateDiff } from "../utils/util";
  import { userStore, requestedProfile, requestedArticle } from "../stores";
  import { fade, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { myUnreadIds } from "../stores";
  import API from "../utils/Api";

  let isUserMenuShowing = false;
  export let onCellClick = () => {};
  export let timeline = [];
  const regexEmoji = new RegExp(/^\$([\u4e00-\u9fa5_a-zA-Z0-9()-]+)/);
  const regexMarkdownImage = new RegExp(/^!\[(.*)\]\((.*)\)/);
  let imgDom;
  function isValidHttpUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url;
  }
  function processContent(content) {
    const firstLine = content.split("\n")[0];
    const words = firstLine.split(" ");
    var components = [];
    for (var i = 0; i < words.length; i++) {
      const word = words[i].trim();
      if (word == "") {
        continue;
      }
      const url = isValidHttpUrl(word);
      if (url === false) {
        if (regexEmoji.test(word)) {
          components.push({ type: "emoji" });
        } else if (regexMarkdownImage.test(word)) {
          components.push({ type: "image" });
        } else {
          components.push({ type: "word", value: word });
        }

        continue;
      }
      if (
        url.pathname.endsWith(".png") ||
        url.pathname.endsWith(".jpg") ||
        url.pathname.endsWith(".jpeg") ||
        url.pathname.endsWith(".gif")
      ) {
        components.push({ type: "image", value: url.href });
      } else if (matchYoutubeUrl(url.href)) {
        components.push({ type: "youtube", value: url.href });
      } else if (matchSoundCloudUrl(url.href)) {
        components.push({ type: "soundcloud", value: url.href });
      } else {
        components.push({ type: "link", value: url.hostname });
      }
    }
    return components;
  }
  // animate:flip={{ duration: 300 }}
  //   out:scale={{ duration: 250 }}
</script>

{#if isUserMenuShowing}
  <div>
    <button class="button is-small">Small</button>

    <p>testing1</p>
  </div>
{/if}

{#each timeline as cellData (cellData.id)}
  <article
    class="media cell"
    class:isUnread={$myUnreadIds.includes(cellData.id)}
    in:scale={{ duration: 250 }}
  >
    {#if cellData.nor > 0}
      <div class="nor">{cellData.nor}</div>
    {/if}
    <figure class="media-left is-hidden-mobile">
      <div
        on:click={() => {
          // var topPos = imgDom.getBoundingClientRect().top + window.scrollY;
          // var leftPos = imgDom.getBoundingClientRect().left + window.scrollX;

          // $globalPopOver = {
          //   isShow: true,
          //   top: topPos,
          //   left: leftPos,
          //   title: $userStore.username[cellData.user_id],
          //   content: $userStore.username[cellData.user_id],
          // };

          //show profile on the right column

          API.get("/get_profile", {
            user_id: cellData.user_id,
          }).then((res) => {
            if (res.msg != "ok") {
              if (res.msg == "user not found") {
                console.log("查無此人");
              }
            } else {
              $requestedProfile = res.data;
              $requestedArticle = {};
            }
          });
        }}
      >
        <img
          bind:this={imgDom}
          src={$userStore.avatar[cellData.user_id] ??
            "/assets/anonymous-avatar-sm.jpg"}
          class="avatars"
          alt="avatar"
          width="32"
          aria-haspopup="true"
          aria-controls="dropdown-menu7"
        />
      </div>
    </figure>
    <div class="media-content">
      <div
        class="content"
        on:click={() => {
          $requestedProfile = {};
          onCellClick(cellData);
        }}
      >
        <strong class="name" title="@{$userStore.username[cellData.user_id]}"
          >{$userStore.displayname[cellData.user_id]}</strong
        >
        <small>{getDateDiff(cellData.created_at)}</small>

        <div class="description">
          <!-- {@html myMarked(cellData["content"])} -->
          {#each processContent(cellData["content"]) as component}
            {#if component.type == "word"}
              {component.value.trim()}
            {/if}
            {#if component.type == "image"}
              <i class="fa fa-image" />
            {/if}
            {#if component.type == "youtube"}
              <i class="fab fa-youtube" />
            {/if}
            {#if component.type == "soundcloud"}
              <i class="fab fa-soundcloud" />
            {/if}
            {#if component.type == "emoji"}
              <i class="fa fa-smile" />
            {/if}
            {#if component.type == "link"}
              <i class="fa fa-link" />
            {/if}
          {/each}
        </div>
      </div>
    </div>
    <!-- <div class="media-right">
    <button class="delete"></button>
  </div> -->
  </article>
{/each}

<style>
  .content {
    font-size: 14px;
  }
  .content .description {
    overflow: hidden;
    margin-top: 3px;
    color: #999;
    font-size: 13px;
  }
  .description i {
    display: inline-block;
    background: #ccc;
    color: white;
    padding: 2px 3px 2px 3px;
    border-radius: 3px;
  }
  .media-content {
    overflow: hidden;
    cursor: pointer;
  }
  .media-left {
    margin: 0px 5px;
    cursor: alias;
  }
  .cell {
    padding: 6px 0 2px 0;
    line-height: 1em;
    width: 100%;
    margin: 2px;
    overflow: hidden;
    position: relative;
  }
  .nor {
    position: absolute;
    right: 0.7em;
    top: 3px;
    font-size: 12px;
    padding: 2px 3px;
    border-radius: 3px;
    background: #eee;
    font-weight: bold;
  }
  .isUnread .nor {
    background: red;
    color: white;
  }
  .content small {
    color: #999;
  }
</style>
