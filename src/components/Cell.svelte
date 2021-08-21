<script>
import AvatarBox from "./AvatarBox.svelte";
import {myMarked,getDateDiff} from "../utils/util";
import {userStore} from "../stores"
import Username from "./Username.svelte"
export let cellData;
export let isUnread;
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

<article class="media cell" class:isUnread={isUnread}>
  <div style='' class='nor'>{cellData.nor}</div>
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
        
        <div style='overflow:hidden'>
        <!-- {@html myMarked(cellData["content"])} -->
        {cellData["content"].split('\n')[0]}
      </div>
    </div>

  </div>
  <!-- <div class="media-right">
    <button class="delete"></button>
  </div> -->
</article>

<style>
  .media-content{
    margin-top:-3px;
    overflow:hidden;
  }
  .media-left{
    margin:0px 5px;
  }
  .cell {
    padding: 6px 0;
    height: 43px;
    line-height: 18px;
    width:100%;
    margin: 2px;
    overflow: hidden;
    position: relative;
  }  
  .nor{
    position:absolute;right:.7em;top:3px;
    padding:2px 4px;
  }
  .isUnread .nor{
    background:red;color:white;
    
  }
  

</style>