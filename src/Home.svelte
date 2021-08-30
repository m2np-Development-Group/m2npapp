<script>
  import { link } from "svelte-navigator";
  import Postbox from "./components/Postbox.svelte";
  import { exists } from "./utils/util";
  import API from "./utils/Api";
  import LeftBar from "./home/LeftBar.svelte"
  import ArticleSelector from "./home/ArticleSelector.svelte"

  import {
    myInfoStore,
    filluserStore,
    docClicked,
    myUnreadIds,
    wallpaper,
    playerSrc,
    globalPopOver

  } from "./stores.js";
  import {getUrlExtension, matchYoutubeUrl} from "./utils/util"
  import ArticleDetail from "./components/ArticleDetail.svelte";
  import Settings from "./Settings.svelte";
  import Search from "./components/Search.svelte";

  import { Button, Modal } from "svelma";

  export let username = null;

  let coinSound = new Audio("/assets/coin.mp3");
  let flipCoinSound = new Audio("/assets/flipcoin.mp3");
  let showingArticle = {};
  let newBatch = [];
  let timeline = [];
  let maxTS = { inbox: null, outbox: null, public: null, search: null };
  let minTS = { inbox: null, outbox: null, public: null, search: null };
  let replies;
  let currentChannel = "outbox";
  let isMyself = false;
  let profile = {};
  let notifications = [];
  let isSettingsShowing = false;
  let cellsSection;
  let coverMessage = "";
  let showSearch = false;
  let isShowFilterBox=true;
  let isUserMenuShowing = false;
  let isNotificationMenuShowing = false;
  
  // Get the data from the api, after the page is mounted.
  // onMount(async () => {mount()});
  function mount(){
    timeline = [];

    if (isMyself) {
      columnSelected = [true, false, false];
      currentChannel = "inbox";
    } else {
      columnSelected = [false, true, false];
      currentChannel = "outbox";
    }
    fetchProfile();
    fetchData("fresh");
  }
  $: if(username){
    if(username != null && username != ""){
      isMyself = username == $myInfoStore?.user?.username;
      mount()
    }
  }


  function fetchProfile() {
    if (isMyself) {
      profile = $myInfoStore;
      $wallpaper=profile.user.wallpaper
      filluserStore([profile.user]);
      return;
    }
    API.get("/get_profile", {
      username: username,
    }).then((res) => {
      if (res.msg != "ok") {
        if (res.msg == "user not found") {
          coverMessage = "查無此人";
        }
      } else {
        profile = res.data;
        filluserStore(res.data.users);
      }
      $wallpaper=profile.user.wallpaper
    });
  }

  function markAllAsRead(){
    API.post("/mark_all_as_read", { postId: postId }).then((res) => {
      if (res.msg != "ok") {
        return;
      }
      $myUnreadIds = [];
    });
  }
  function fetchUnreadIds() {
    API.get("/get_unread").then((res) => {
      if (res.msg != "ok") {
        return;
      }
      $myUnreadIds = res.data;
    });
  }
  //"fresh" =new
  //"prepend" =load new
  //"append" = load old
  function fetchData(mode = "fresh") {
    let pUser = username;

    //set url
    let channel = currentChannel;
    let url = "/get_" + channel;

    //set params
    rightSearchTerm = rightSearchTerm.trim()
    let params = { username: pUser, filter: rightSearchTerm==""?null:rightSearchTerm };
    if (mode === "append") {
      params.less_than_ts = minTS[channel];
    } else if (mode === "prepend") {
      params.more_than_ts = maxTS[channel];
    }

    API.get(url, params).then((res) => {
      fetchUnreadIds();
      filluserStore(res.users);
      if (
        Array.isArray(res.posts) &&
        (res.posts.length > 0 || mode == "fresh")
      ) {
        newBatch = res.posts;
        timeline =
          mode == "append"
            ? [...timeline, ...newBatch]
            : mode == "prepend"
            ? [...newBatch, ...timeline]
            : newBatch;

        maxTS[channel] = timeline[0]?.created_at;
        minTS[channel] = timeline[timeline.length - 1]?.created_at;

        if ($docClicked) {
          //sounds
          if (mode == "append") {
            coinSound.play();
          } else {
            flipCoinSound.play();
          }
        }
      }
    });
  }



  setInterval(function () {
    fetchUnreadIds()
  }, 30000);
  function refreshReplies(post_id) {
    replies=undefined;
    API.get("/get_replies", { post_id: post_id }).then((res) => {
      replies = res;
    });
  }
  function markAsRead(postId) {
        API.post("/mark_as_read", { postId: postId }).then((res) => {
        if (res.msg != "ok") {
            return;
        }
        $myUnreadIds = $myUnreadIds.filter((m) => m != postId);
        });
    }


  const hideAllPopup = () => {
    isNotificationMenuShowing = false;
    isUserMenuShowing = false;
  };

  let rightSearchTerm = "";

  let columnSelected = [true, false, false];

  const changeToTab = (id) => {
    isShowFilterBox = id!='updated';

    if (currentChannel == id) {
      return false;
    }
    currentChannel = id;
    rightSearchTerm=""
    fetchData("fresh");
    return true;
  };
</script>

<main>
{#if $globalPopOver.isShow}

<article class="message is-dark"
style='position:fixed;top:{$globalPopOver.top}px;left:{$globalPopOver.left}px ; background:white; z-index:5'
>
  <div class="message-header">
    <p>{$globalPopOver.title}</p>
    <button class="delete" aria-label="delete" on:click={
      ()=>{$globalPopOver={}}
    }></button>
  </div>
  <div class="message-body">
    {$globalPopOver.content}
  </div>
</article>


<div >

</div>
{/if}




  <div class="modal" class:is-active={coverMessage != ""}>
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title" />
        <!-- <button class="delete" aria-label="close" on:click={()=>{coverMessage=""}}></button> -->
      </header>
      <section class="modal-card-body">
        {coverMessage}
      </section>
      <footer class="modal-card-foot">
        <!-- <button class="button is-success" on:click={()=>{coverMessage=""}}>OK</button> -->
      </footer>
    </div>
  </div>

  <Settings bind:active={isSettingsShowing} />



  <Modal bind:active={showSearch}>
    <div style="background:white;padding:1em;border-radius:1em">
      <Search />
    </div>
  </Modal>
  <nav class="small_nav left">
    <a href="/" use:link><i class="fa fa-home" aria-hidden="false" style="filter: drop-shadow(2px 4px 6px white);" /></a>
  </nav>

  <nav class="small_nav" style="background:#EEE">
    <div class="dropdown is-right userMenu" class:is-active={isUserMenuShowing}>
      <div
        style="padding-right:1em;display: inline-block;"
        class="dropdown-trigger"
        on:click={() => {
          isUserMenuShowing = !isUserMenuShowing;
        }}>
        <div
          style="cursor:pointer"
          aria-haspopup="true"
          aria-controls="dropdown-menu2">
          {#if $myInfoStore?.user?.avatar}
            <img
              src={$myInfoStore?.user?.avatar}
              alt="avatar"
              style="border-radius:3px;width:20px" />
          {/if}
          <span>{$myInfoStore?.user?.display_name}</span>
        </div>
      </div>
      <div class="dropdown-menu" id="dropdown-menu2" role="menu">
        <div class="dropdown-content">
          <div
            class="dropdown-item"
            on:click={() => {
              isSettingsShowing = true;
            }}>
            <i class="fa fa-cog" aria-hidden="true" alt="設定" />
            設定
          </div>
          <hr class="dropdown-divider" />
          <div class="dropdown-item">
            <a href="/logout" use:link
              ><i class="fa fa-sign-out-alt" aria-hidden="true" /> Sign Out</a>
          </div>
        </div>
      </div>
    </div>

    <div
      class="dropdown is-right userMenu"
      class:is-active={isNotificationMenuShowing}>
      <i
        class="fa fa-bell dropdown-trigger"
        aria-hidden="true"
        on:click={() => {
          isNotificationMenuShowing = !isNotificationMenuShowing;
        }}
        on:open={() => {
          API.get("/notifications").then((res) => {
            notifications = res;
          });
        }} />
      <div class="dropdown-menu" id="dropdown-menu3" role="menu">
        <div class="dropdown-content">
          <div class="dropdown-item">
            {#if notifications.length > 0}
              {#each notifications as v}
                <a href={v.url} use:link>{v.message}</a>
              {/each}
            {:else}
              🤗沒有通知很棒棒
            {/if}
          </div>
        </div>
      </div>
    </div>

    <div>
      <i
        class="fa fa-search"
        aria-hidden="true"
        on:click={() => {
          showSearch = !showSearch;
        }} />
    </div>
  </nav>


  <div class="columns is-mobile is-variable is-1" style='position:fixed; top:40px;left:3px;bottom:3px;right:3px;margin:0'>
    <div class="column is-2 is-hidden-mobile">
      <LeftBar 
      style='background:white; overflow-y: scroll; padding:3px;height:100%'
      bind:profile={profile} />
    </div>
    <div class="column is-4" bind:this={cellsSection} style='position:relative'>

      {#if $playerSrc != ""}
  
      <div style="width: 100%;
      height: 300px;
      top: 0em;
      left: 0;
      z-index: 10;
      background:#white;overflow:hidden;
      border-radius:.5em .5em 0 0;background:white">

        <Button
          style="position: absolute;right: .5em; top:.5em; z-index:4;"
          size="is-small"
          on:click={() => {
            $playerSrc=""
          }}
          iconRight="times"
          rounded>關閉Player</Button>
          <Button
          style="position: absolute;right: .5em; top:3.5em; z-index:4;"
          size="is-small"
          iconPack="fas"
          on:click={() => {
            window.open($playerSrc, '_blank').focus();
          }}
          iconRight="external-link-alt"
          rounded>開新</Button>
          {#if matchYoutubeUrl($playerSrc)}
            <iframe
            style="width:100%;height:100%"
            src="{$playerSrc}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen />
          {:else}
          <img src={$playerSrc} alt='image' style="max-width:100%;height:100%" />
          {/if}
        </div>
      {/if}

      <ArticleSelector
      style='background:white; overflow-y: scroll; height:calc(100% - {$playerSrc != ""?300:0}px); overflow-x:hidden'
      bind:timeline={timeline}
      hasMore={newBatch.length > 0}
      loadMore={()=>fetchData("append")}
      onCellClick={(v) => {
        showingArticle = v;
        refreshReplies(v.id);
        markAsRead(v.id);
      }}
      />
      <div style="position:absolute; bottom:1em;right:2em">
        <Button
          size="is-small"
          on:click={() => {
            cellsSection.scrollTop = 0; //scroll top
            fetchData("prepend")
          }}
          rounded
          iconRight="arrow-up">Prepend</Button>
        <Button
          size="is-small"
          on:click={() => {
            cellsSection.scrollTop = cellsSection.scrollHeight; //scroll bottom
            fetchData("append")
          }}
          rounded
          iconRight="arrow-down">Append</Button>
      </div>
    </div>
    <div class="column">

      <div class='' style='position:relative;height:100%;'>
        {#if exists(showingArticle.id)}
          <Button
            style="position: absolute;right: .5em; top:.5em; z-index:4;"
            size="is-small"
            on:click={() => {
              showingArticle = {};
            }}
            iconRight="times"
            rounded>關閉</Button>
          <ArticleDetail
            style="background:white; border:#ccc solid 1px; padding:3px"
            onArticleContentChanged={(content) => {
              timeline = timeline.map((v) => {
                if (v.id == showingArticle.id) {
                  v.content = content;
                }
                return v;
              });
            }}
            onDelete={() => {
              timeline = timeline.filter((v) => v.id != showingArticle.id);
              showingArticle = {};
              if (profile.user.id == $myInfoStore.user.id) {
                profile.user.article_count--;
              }
            }}
            article={showingArticle}
            replies={replies} />
        {/if}




        <div style="
        width: 100%;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        padding: 3px;
        background: white;
        
        ">
          <Postbox
            onSubmit={(txt) => {
              if (exists(showingArticle.id)) {
                return API.post("/post_reply", {
                  post_id: showingArticle.id,
                  content: txt,
                });
              } else {
                return API.post("/post_post", { content: txt });
              }
            }}
            placeholder={exists(showingArticle.id) ? "回覆Po" : "發新Po"}
            finishHandler={(content) => {
              if (exists(showingArticle.id)) {
                //reply
                refreshReplies(showingArticle.id);
              } else {
                //create
                if (currentChannel != "inbox") {
                  fetchData("prepend");
                }

                if (profile.user.id == $myInfoStore.user.id) {
                  profile.user.article_count++;
                }
              }
            }} />
        </div>

      </div>
    </div>
  </div>

  <div class="rightSearch app-box">
    <div class="columnSwitcher" style="">
      {#if isMyself}
        <span
          on:click={() => {
            changeToTab("inbox")
          }}
          class:active={currentChannel == "inbox"}>
          <i class="fas fa-inbox" /> 進口
        </span>
      {/if}
      <span
        on:click={() => {
          changeToTab("outbox")
        }}
        class:active={currentChannel == "outbox"}>
        <i class="fas fa-newspaper" /> 出口
      </span>
      <span
        on:click={() => {
          changeToTab("public")
        }}
        class:active={currentChannel == "public"}
        ><i class="fas fa-water" /> 海洋
      </span>
      {#if $myUnreadIds.length > 0 || currentChannel == "updated"}
      <span
        on:click={() => {
          changeToTab("updated")
        }}
        class:active={currentChannel == "updated"}
        ><i class="fas fa-comment-dots"></i> 未讀
      </span>
      {/if}
    </div>
    {#if isShowFilterBox}
    <div
      class="control has-icons-left"
      style="width: 200px;
      right: 0;
      float: right;
      margin-top: 3px;clear:none">
      
      <input
        class="input is-small"
        type="text"
        placeholder=""
        bind:value={rightSearchTerm}
        on:keypress={(e) => {
          if (e.key === "Enter") {
            fetchData("fresh")
          }
        }}
        autocomplete="off" />
      <span class="icon is-small is-left">
        <i class="fas fa-search" />
      </span>
    </div>
    {:else}
    <div class="columnSwitcher" style="float:right">
      <span
        on:click={() => {
          markAllAsRead();
        }}
        ><i class="fas fa-check"></i> 全部標記為已讀
      </span>
    </div>
    {/if}
    <div style="clear:both" />
  </div>
<!-- 
  <div class="rightColumn app-box" >

  </div> -->
</main>

<style>
  :root {
    --frame-height: calc(100vh - 43px);
    --box-background: #fefefe;
  }

  .columnSwitcher {
    float: left;
    font-size: 15px;
    color: gray;
    margin: 5px 2px;
  }
  .columnSwitcher span {
    color: gray;
    cursor: pointer;
    font-weight: normal;
  }
  .columnSwitcher .active {
    color: rgb(87, 109, 233);
  }
  .userMenu a {
    color: gray;
    font-size: 15px;
  }
  .small_nav {
    display: flex;
    padding: 0.3em;
    margin-bottom: 1.2em;
    position: fixed;
    top: 0px;
    z-index: 3;
    right: 0px;
    font-size: 15px;
  }
  .small_nav.left {
    right: unset;
    left: 0px;
    top: 0px;
    font-size: 18px;
    padding: 8px 0 0 6px;
  }
  .small_nav i {
    cursor: pointer;
  }

  .app-box{
    border: 1px solid #ccc;
    background-color: var(--box-background);
    opacity:0.97;
  }

  .rightSearch {
    padding: 0 4px;
    height: 32px;
    top: 6px;
    left: calc(16vw + 10px);
    position: fixed;
    width: calc(42vw - 10px);
    overflow: hidden;
    justify-content: flex-start;
    z-index: 3;
  }


  nav i {
    color: dimgray;
    display: inline-block;
    padding: 5px 5px;
    height: 20px;
    vertical-align: top;
  }

  /*
  //old layout
  .cells {
    width: 100%;
    overflow-x: hidden;
    flex-wrap: wrap;
    justify-content: flex-start;
    height: fit-content;
  }
  .left-bar {
    position: fixed;
    width: 16vw;
    height: var(--frame-height);
    overflow-y: auto;
    left: 3px;
    bottom: 3px;
    z-index: 0;
    padding: 0.3em;
  }
  .postbox {
    position: fixed;
    width: calc(49vw - 9px);
    right: 3px;
    bottom: 3px;
    z-index: 1;
    padding: 0.3em;
  }

  .rightColumn {
    height: var(--frame-height);
    bottom: 3px;
    left: calc(16vw + 10px);
    position: fixed;
    width: calc(35vw - 9px);
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  } */


  .dropdown-item {
    cursor: pointer;
  }
  .dropdown-trigger * {
    vertical-align: middle;
    text-align: center;
    color: inherit;
  }
  .column{padding-top:3px;padding-bottom:3px;}
</style>
