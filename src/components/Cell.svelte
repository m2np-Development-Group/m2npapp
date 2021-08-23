<script>
import AvatarBox from "./AvatarBox.svelte";
import {myMarked,getDateDiff} from "../utils/util";
import {userStore} from "../stores"
import Username from "./Username.svelte"

let isUserMenuShowing=false;
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
      <div class="dropdown is-up" class:is-active={isUserMenuShowing}>
        <div class="dropdown-trigger" on:click={()=>{isUserMenuShowing=!isUserMenuShowing;}}>
          <img
          src={$userStore.avatar[cellData.user_id]??"https://bulma.io/images/placeholders/128x128.png"}
          class="avatars"
          alt="avatar"
          width="32"
          aria-haspopup="true" 
          aria-controls="dropdown-menu7"
          />
        </div>
        <div class="dropdown-menu" id="dropdown-menu7" role="menu">
          <div class="dropdown-content">
            <div class="dropdown-item">
              <p>testing</p>
            </div>
          </div>
        </div>
      </div>
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
    cursor: pointer;
  }
  .media-left{
    margin:0px 5px;
    cursor:crosshair
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