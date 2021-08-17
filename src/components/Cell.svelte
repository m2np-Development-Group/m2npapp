<script>
import AvatarBox from "./AvatarBox.svelte";
import {myMarked,getDateDiff} from "../utils/util";
import {userStore} from "../stores"
import Username from "./Username.svelte"
export let cellData;
export let isRead;
export let onCellClick=()=>{};
</script>

<!-- <a class="level-item">
  <span class="icon is-small"><i class="fas fa-reply"></i>{cellData.nor}</span>
</a>
<a class="level-item">
  <span class="icon is-small"><i class="fas fa-retweet"></i></span>
</a>
<a class="level-item">
  <span class="icon is-small"><i class="fas fa-heart"></i></span>
</a> -->

<article class="media cell" class:isRead={isRead}>
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
          <!-- {@html myMarked(cellData["content"])} -->
          {cellData["content"]}
        </div>
      </div>

    </div>
    <!-- <div class="media-right">
      <button class="delete"></button>
    </div> -->
  </article>

<style>
  .media-content{
    margin-top:-7px;
  }
  .media-left{
    margin-left:5px;
    margin-top:-3px;
  }
  .cell {
    /* overflow: hidden; */
    height: 45px;
    line-height: 18px;
    width:100%;
    margin: 2px;
    overflow: hidden;
  }  
  .isRead{
    opacity:0.5;
  }

</style>