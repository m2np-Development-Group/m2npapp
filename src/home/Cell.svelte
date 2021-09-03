<script>
import AvatarBox from "../components/AvatarBox.svelte";
import {getDateDiff} from "../utils/util";
import {userStore, globalPopOver} from "../stores"
import Username from "../components/Username.svelte"

let isUserMenuShowing=false;
export let cellData;
export let isUnread;
export let onCellClick=()=>{};

let imgDom;
</script>

{#if isUserMenuShowing}

<div>
  <button class="button is-small">Small</button>

  <p>testing1</p>
</div>

{/if}
<article class="media cell" class:isUnread={isUnread}>
  <div style='' class='nor'>{cellData.nor}</div>
  <figure class="media-left">
      
        <div class="dropdown-trigger" on:click={
          ()=>{
            var topPos = imgDom.getBoundingClientRect().top + window.scrollY;
            var leftPos = imgDom.getBoundingClientRect().left + window.scrollX;

            $globalPopOver={
              isShow:true, top:topPos, left:leftPos, 
              title:$userStore.username[cellData.user_id],
              content:$userStore.username[cellData.user_id]
            }
          }
        }>
          <img
          bind:this={imgDom}
          src={$userStore.avatar[cellData.user_id]??"https://bulma.io/images/placeholders/128x128.png"}
          class="avatars"
          alt="avatar"
          width="32"
          aria-haspopup="true" 
          aria-controls="dropdown-menu7"
          />
        </div>

  </figure>
  <div class="media-content">
    <div class="content" on:click={onCellClick}>
      
        <strong title="@{$userStore.username[cellData.user_id]}">{$userStore.displayname[cellData.user_id]}</strong>
        <small>{getDateDiff(cellData.created_at)}</small>
        
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