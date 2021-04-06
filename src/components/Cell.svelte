<script>
import AvatarBox from "./AvatarBox.svelte";
import {myMarked,getDateDiff} from "../utils/util";
import {userStore} from "../stores"
import Username from "./Username.svelte"
export let cellData;
export let onCellClick=()=>{};
</script>



<article class="media cell">
    <figure class="media-left">
      <p class="image is-32x32">
        {#if $userStore.avatar[cellData.user_id] != null}
        <img
          src={$userStore.avatar[cellData.user_id]??"https://bulma.io/images/placeholders/128x128.png"}
          class="avatars"
          alt="avatar" />
      {/if}
      </p>
    </figure>
    <div class="media-content">
      <div class="content" on:click={onCellClick}>
        
          <strong>{$userStore.displayname[cellData.user_id]}</strong> <small>@{$userStore.username[cellData.user_id]}</small> <small>{getDateDiff(cellData.created_at)}</small>
          
          <div style='height:140px;overflow:hidden'>
          {@html myMarked(cellData["content"])}
        </div>
      </div>
      <nav class="level is-mobile">
        <!-- <AvatarBox userId={cellData.user_id}>
            <small>{getDateDiff(cellData.created_at)}</small>
            <small class="reply_count" class:red={cellData.nor > 0}>{cellData.nor}</small>
          </AvatarBox> -->
        <div class="level-left">
          <a class="level-item">
            <span class="icon is-small"><i class="fas fa-reply"></i>{cellData.nor}</span>
          </a>
          <a class="level-item">
            <span class="icon is-small"><i class="fas fa-retweet"></i></span>
          </a>
          <a class="level-item">
            <span class="icon is-small"><i class="fas fa-heart"></i></span>
          </a>
        </div>
      </nav>
    </div>
    <!-- <div class="media-right">
      <button class="delete"></button>
    </div> -->
  </article>

<style>

  .cell {
    /* overflow: hidden; */
    height: 200px;
max-width:50%;
    margin: 5px;
    overflow: hidden;
  }  

</style>