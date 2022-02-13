<script>
  import Link from "./Link.svelte";
  import Image from "./Image.svelte";
  import { userIdEmojiMap } from "../../stores";
  import { BasicStickers, BasicStickersUrlPrefix } from "../../utils/const";

  export let text;
  export let raw;
  raw;

  function isValidURL(string) {
    var res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res !== null;
  }
  let parts = [];
  const regexMention = new RegExp(/@([a-z\d_]+)/gi);
  const regexHash = new RegExp(/^#([\u4e00-\u9fa5_a-zA-Z0-9]+)/g);
  const regexEmoji = new RegExp(/^\$([\u4e00-\u9fa5_a-zA-Z0-9()-]+)/g);
  $: if (text) {
    parts = [];
    const all = text.split(" ");
    all.forEach((e) => {
      if (e.trim() == " ") {
        return;
      }

      if (isValidURL(e)) {
        parts.push({
          component: Link,
          props: { href: e },
          slot: e,
        });
        return;
      }

      if (regexMention.test(e)) {
        parts.push({
          component: Link,
          props: { href: "/user/" + e.substring(1) },
          slot: e,
        });
      } else if (regexHash.test(e)) {
        parts.push({
          component: Link,
          props: { href: "/search/" + e.substring(1) },
          slot: e,
        });
      } else if (regexEmoji.test(e) && e != "$") {
        const emojiKey = e.substring(1);

        if (emojiKey in $userIdEmojiMap) {
          parts.push({
            component: Image,
            props: {
              href:
                BasicStickersUrlPrefix +
                "/user/123/" +
                $userIdEmojiMap[emojiKey],
            },
            slot: e,
          });
        } else if (emojiKey in BasicStickers) {
          //console.log(BasicStickers[emojiKey])
          parts.push({
            component: Image,
            props: { href: BasicStickersUrlPrefix + BasicStickers[emojiKey] },
            slot: e,
          });
        } else {
          parts.push({
            text: e,
          });
        }
      } else {
        parts.push({
          text: e
            .replace(/&amp;/g, "&")
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"'),
        });
      }
    });
    parts = parts; //trigger svelte
  }
</script>

{#each parts as component}
  {#if component.hasOwnProperty("text")}
    {" " + component.text + " "}
  {:else}
    <svelte:component this={component.component} {...component.props}
      >{component.slot}</svelte:component
    >
  {/if}
{/each}

{#if parts.length == 0}
  <slot />
{/if}
