<script>
  import { getDateDiff } from "../utils/util";
  import { userStore, globalPopOver } from "../stores";

  let isUserMenuShowing = false;
  export let cellData;
  export let isUnread;
  export let onCellClick = () => {};

  let imgDom;
</script>

{#if isUserMenuShowing}
  <div>
    <button class="button is-small">Small</button>

    <p>testing1</p>
  </div>
{/if}
<article class="media cell" class:isUnread>
  <div style="" class="nor">{cellData.nor}</div>
  <figure class="media-left">
    <div
      class="dropdown-trigger"
      on:click={() => {
        var topPos = imgDom.getBoundingClientRect().top + window.scrollY;
        var leftPos = imgDom.getBoundingClientRect().left + window.scrollX;

        $globalPopOver = {
          isShow: true,
          top: topPos,
          left: leftPos,
          title: $userStore.username[cellData.user_id],
          content: $userStore.username[cellData.user_id],
        };
      }}>
      <img
        bind:this={imgDom}
        src={$userStore.avatar[cellData.user_id] ??
          "https://bulma.io/images/placeholders/128x128.png"}
        class="avatars"
        alt="avatar"
        width="32"
        aria-haspopup="true"
        aria-controls="dropdown-menu7" />
    </div>
  </figure>
  <div class="media-content">
    <div class="content" on:click={onCellClick}>
      <strong class='name' title="@{$userStore.username[cellData.user_id]}"
        >{$userStore.displayname[cellData.user_id]}</strong>
      <small>{getDateDiff(cellData.created_at)}</small>

      <div class="description">
        <!-- {@html myMarked(cellData["content"])} -->
        {cellData["content"].split("\n")[0]}
      </div>
    </div>
  </div>
  <!-- <div class="media-right">
    <button class="delete"></button>
  </div> -->
</article>

<style>
  .content{
    font-size:14px;
  }
  .content .description {
    overflow: hidden;
    margin-top: 3px;
    color: #999;
    font-size: 13px;
  }
  .media-content {
    margin-top: -3px;
    overflow: hidden;
    cursor: pointer;
  }
  .media-left {
    margin: 0px 5px;
    cursor: crosshair;
  }
  .cell {
    padding: 6px 0;
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
    padding: 2px 4px;
  }
  .isUnread .nor {
    background: red;
    color: white;
  }
</style>
