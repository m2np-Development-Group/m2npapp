<script lang="ts">
  import { playerLinks } from "../../stores.js";
  import Image from "./Image.svelte";

  import {
    getUrlExtension,
    matchYoutubeUrl,
    generateYoutubeEmbedUrl,
    matchSoundCloudUrl,
    generateSoundCloudEmbedUrl,
  } from "../../utils/util";
  export let href = "";
  export let title = undefined;

  export const raw = "";
  export const text = "";

  let ytid="";
  let scid="";
  let ext="";

  $: if (href) {
    ytid = matchYoutubeUrl(href);
    if (ytid == "") {
      scid = matchSoundCloudUrl(href);
      if (scid == "") {
        ext = getUrlExtension(href);
        if (ext != "") {
          ext = ext.toLowerCase();
        }
      }
    }
  }
  function pushPlayerLink(href, type) {
    if (!$playerLinks.links.includes(href)) {
      $playerLinks.links.push([href, type]);
      $playerLinks.currentIndex = $playerLinks.links.length - 1;
    } else {
      $playerLinks.currentIndex = $playerLinks.links.indexOf([href, type]);
    }
    $playerLinks = $playerLinks;
  }
</script>

{#if ytid != ""}
  <span
    class="brand-link"
    on:click={() => {
      const link = generateYoutubeEmbedUrl(ytid);
      pushPlayerLink(link, "yt");
    }}
    title={title}><i class="fab fa-youtube" /> {ytid}</span
  >
{:else if scid != ""}
  <span
    class="brand-link"
    on:click={() => {
      const link = generateSoundCloudEmbedUrl(href);
      pushPlayerLink(link, "sc");
    }}
    title={title}><i class="fab fa-soundcloud" /> {scid}</span
  >
{:else if ext == "jpg" || ext == "png" || ext == "gif" || ext == "jpeg"}
  <Image href={href} />
{:else}
  <a href={href} title={title} target="_blank"><slot /></a>
{/if}

<style>
  .brand-link {
    background-color: #ccc;
    color: white;
    border-radius: 3px;
    padding-right: 2px;
    padding-left: 2px;
    cursor: pointer;
  }
  .brand-link:hover {
    background-color: #666;
  }
</style>
