<script>
  import { onMount, getContext } from "svelte";
  import { link } from "svelte-navigator";
  import Postbox from "./components/Postbox.svelte";
  import { exists, getDateDiff, myMarked } from "./utils/util";
  import { Warning } from "./components/Notification";
  import API from "./utils/Api";
  import InfiniteScroll from "./components/InfiniteScroll.svelte";
  // import { parse } from "QS";
  import Popover from "svelte-popover";
  import Cell from "./components/Cell.svelte";
  import Username from "./components/Username.svelte";
  import { myInfoStore, filluserStore, docClicked } from "./stores.js";
  import ArticleDetail from "./components/ArticleDetail.svelte";
  import Settings from "./Settings.svelte";
  import Search from "./components/Search.svelte";

  import tooltip from "svelte-tooltip-action";
  import { Button, Modal, ModalCard } from "svelma";

  let profile = {};

  let coinSound = new Audio("/assets/coin.mp3");
  let flipCoinSound = new Audio("/assets/flipcoin.mp3");

  let showingArticle = {};
  let newBatch = [];
  let timeline = [];
  let maxTS;
  let minTS;
  let replies;

  export let username = null;
  $: if (username) {
    timeline=[];
    fetchData();
    fetchProfile();
  }
  function fetchProfile() {
    if (username == null) {
      profile = $myInfoStore;
      return;
    }
    console.log(username);
    API.get("/get_profile", {
      username: username,
    }).then((res) => {
      if (res.msg != "ok") {
        if (res.msg == "user not found") {
          coverMessage = "查無此人";
        }
      } else {
        profile = res.data;
      }
    });
  }

  //"fresh" =new
  //"prepend" =load new
  //"append" = load old
  function fetchData(mode = "fresh") {
    API.get(
      username == null ? "/get_inbox" : "/get_outbox",
      mode == "append"
        ? { less_than_ts: minTS, username: username }
        : mode == "prepend"
        ? { more_than_ts: maxTS, username: username }
        : { username: username }
    ).then((res) => {
      filluserStore(res.users);
      if (Array.isArray(res.posts) && res.posts.length > 0) {
        newBatch = res.posts;
        timeline =
          mode == "append"
            ? [...timeline, ...newBatch]
            : mode == "prepend"
            ? [...newBatch, ...timeline]
            : newBatch;

        maxTS = timeline[0].created_at;
        minTS = timeline[timeline.length - 1].created_at;
        if ($docClicked) {
          if (mode == "append") {
            coinSound.play();
          } else {
            flipCoinSound.play();
          }
        }
      }
    });
  }

  // Get the data from the api, after the page is mounted.
  onMount(async () => {
    fetchData("fresh");
    fetchProfile();
  });

  // setInterval(function () {
  //   var ni = timeline[8];
  //   ni.id = ni.id + 1000;
  //   timeline = [ni, ...timeline];
  // }, 30000);
  function refreshReplies(post_id) {
    API.get("/get_replies", { post_id: post_id }).then((res) => {
      replies = res;
    });
  }
  let userSearchText = "";
  const unfollow = (user) => {
    API.post("/unfollow", { user_id: user.id }).then((res) => {
      if (res.msg == "ok") {
        $myInfoStore.followings = $myInfoStore.followings.filter(
          (x) => x.id != user.id
        );

        profile.followers = profile.followers.filter((x) => x.id != user.id);
      } else {
        Warning(res.msg);
      }
    });
  };
  const follow = (user) => {
    API.post("/follow", { user_id: user.id }).then((res) => {
      if (res.msg == "ok") {
        let smallUser = {
          display_name: user.display_name,
          id: user.id,
          username: user.username,
        };
        $myInfoStore.followings = [...$myInfoStore.followings, smallUser];
        profile.followers = [...profile.followers, smallUser];
        console.log($myInfoStore.followings);
      } else {
        Warning(res.msg);
      }
    });
  };
  let notifications = [];
  let showSettings = false;
  let cellsSection;
  let coverMessage = "";
  let showSearch = false;

  let isUserMenuShowing = false;
  let rightSearchTerm="";
  //css vars
</script>

<style>
  :root {
    --frame-height: calc(100vh - 43px);
  }
  .userMenu a{color:gray}
  .left_nav {
    display: flex;
    padding: 0.3em;
    height: 50px;
    margin-bottom: 1.2em;
    position: fixed;
    top: 0px;
    z-index: 3;
    left: 2px;
    font-size: 18px;
  }
  .left_nav i{
    cursor:pointer;
  }
  .prepend-buttons{
    z-index:3;
    position:fixed;bottom:9px;
    right:calc(42vw + 23px);
  }
  .left_bar {
    border: 1px solid #ccc;
    position: fixed;
    width: 16vw;
    height: var(--frame-height);
    overflow-y: auto;
    background-color: #FEFEFE;
    left: 3px;
    bottom: 3px;
    z-index: 0;
    padding: 0.3em;
  }
  .postbox {
    border: 1px solid #ccc;
    position: fixed;
    width: calc(42vw - 10px);
    right: 3px;
    bottom: 3px;
    z-index: 1;
    padding: 0.3em;
  }
  .rightSearch {
    padding:0 .4em;
    height: 30px;
    border: 1px solid #ccc;
    top: 6px;
    left: calc(16vw + 10px);
    position: fixed;
    width: calc(42vw - 10px);
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .rightColumn {
    height: var(--frame-height);
    border: 1px solid #ccc;
    bottom: 3px;
    left: calc(16vw + 10px);
    position: fixed;
    width: calc(42vw - 10px);
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .marked {
    word-break: break-all;
  }

  :global(.reply_count.red) {
    background: red;
    color: aliceblue;
    margin-top: 2px;
    padding: 0 3px;
  }

  :global(nav i) {
    color: dimgray;
    display: inline-block;
    padding: 5px 5px;
    height: 20px;
    vertical-align: top;
  }

  .cells {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    height: fit-content;
  }

  :global(body) {
    overflow: hidden;
  }
  :global(.marked th) {
    border-bottom: 1px solid;
    text-align: left;
    font-weight: 700;
  }
  .post_content {
    padding-left: 0.3em;
    font-size: 13px;
  }
  :global(.post_content table) {
    border-spacing: 0;
  }
  :global(.post_content table td) {
    padding-right: 1em;
    /* border-bottom: #fbbc2a67 1px solid; */
  }
  .dropdown-item{
    cursor: pointer;
  }
</style>

<main>
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

  <Modal bind:active={showSettings}>
    <div style="background:white;padding:1em;border-radius:1em">
      <Settings active={showSettings} />
    </div>
  </Modal>
  <Modal bind:active={showSearch}>
    <div style="background:white;padding:1em;border-radius:1em">
      <Search />
    </div>
  </Modal>
  <nav class="left_nav">

    <div class="dropdown userMenu" class:is-active={isUserMenuShowing} on:click={()=>{isUserMenuShowing=!isUserMenuShowing}}>
      <div class="dropdown-trigger">
        <button class="" aria-haspopup="true" aria-controls="dropdown-menu2">
          <i class="fas fa-user"></i>
          <span>Me</span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div class="dropdown-menu" id="dropdown-menu2" role="menu">
        <div class="dropdown-content">
          <div class="dropdown-item">
              

              <div style="display:flex">
                <div style="padding:2px">
                  {#if $myInfoStore?.user?.avatar}
                    <img width="40" src={$myInfoStore?.user?.avatar} alt="avatar" />
                  {/if}
                </div>
                <div>
                  {$myInfoStore?.user?.display_name}<br />test
                </div>
              </div>

          </div>
          <hr class="dropdown-divider">
          <div class="dropdown-item"           
          on:click={() => {
            showSettings = !showSettings;
          }}>
            <i
            class="fa fa-cog"
            aria-hidden="true"

            alt='設定'
            />
            設定
          </div>
          <hr class="dropdown-divider">
          <div class="dropdown-item">
          <a href="/logout" use:link><i class="fa fa-sign-out-alt" aria-hidden="true" /> Sign Out</a>
        </div>
        </div>
      </div>
    </div>


    <a href="/" use:link><i class="fa fa-home" aria-hidden="false" /></a>
    

    <Popover
      overlayColor="rgba(0,0,0,0)"
      arrow={true}
      placement="bottom-start"
      on:open={() => {
        API.get("/notifications").then((res) => {
          notifications = res;
        });
      }}
      arrowColor="#fff">
      <i
        class="fa fa-bell"
        slot="target"
        aria-hidden="true"
 />
 <!-- use:tooltip={{
  text: "通知",
  style: "left: 0; bottom: -40px;",
}} -->
      <div slot="content">
        <div class="popover_content">
          {#if notifications.length > 0}
            {#each notifications as v}
              <a href={v.url} use:link>{v.message}</a>
            {/each}
          {:else}
            🤗沒有通知很棒棒
          {/if}
        </div>
      </div>
    </Popover>
    <div>
      <i
        class="fa fa-search"
        aria-hidden="true"
        on:click={() => {
          showSearch = !showSearch;
        }}
        />
      <!-- <Hoverable let:hovering={isSearchBoxShowing}>
        {#if isSearchBoxShowing || userSearchText != ""}
          <UserSearchBox bind:value={userSearchText} />
        {:else}
          <i class="fa fa-search" aria-hidden="true" />
        {/if}
      </Hoverable> -->
    </div>
  </nav>
  <div class="left_bar">
    {#if profile.user}
      <div style="display:flex">
        <div style="padding:2px">
          {#if profile?.user?.avatar}
            <img width="40" src={profile?.user?.avatar} alt="avatar" />
          {/if}
        </div>
        <div>
          {profile?.user?.display_name}<br />
          <!-- {JSON.stringify($myInfoStore?.followers)} -->
          {#if $myInfoStore?.followers
            ?.map((x) => x.id)
            .includes(profile.user.id)}
            正在跟隨你。
          {/if}

          {#if $myInfoStore?.followings
            ?.map((x) => x.id)
            .includes(profile.user.id)}
            <Button
              size="is-small"
              iconRight="arrow-right"
              on:click={() => {
                unfollow(profile.user);
              }}>Unfollow</Button>
          {:else}
            <Button
              size="is-small"
              iconLeft="arrow-right"
              on:click={() => {
                follow(profile.user);
              }}>Follow</Button>
          {/if}
        </div>
      </div>

      正在跟蹤:<br />
      {#if profile.followings.length > 0}
        {#each profile.followings as v}
          <Username userId={v.id} /><br />
        {/each} 
      {:else}
        沒有
      {/if}
      <br />
      跟隨者: <br />
      {#if profile.followers.length > 0}
        {#each profile.followers as v}
          <Username userId={v.id} /><br />
        {/each}
      {:else}
        沒有
      {/if}

      <div class="marked">
        {@html myMarked(profile?.user?.description)}
      </div>

      <br />
      <br />
      最後登入: <strong>{getDateDiff(profile.user?.last_login)}</strong><br />
      Po文: <strong>{profile.user?.article_count}</strong>則<br />
    {/if}
  </div>

  <div class="postbox">
    {#if exists(showingArticle.id)}
      <Button
        style="position: absolute;right: .3em; z-index:4;"
        size="is-small"
        on:click={() => {
          showingArticle = {};
        }}
        iconRight="times"
        rounded>關閉</Button>
      <ArticleDetail
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
        }}
        article={showingArticle}
        replies={replies} />
    {/if}

    <div style="width:100%;">
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
            refreshReplies(showingArticle.id);
          } else {
            fetchData("prepend");
          }
        }} />
    </div>
  </div>
  <div class='prepend-buttons'>
    <Button
      size="is-small"
      on:click={() => {
        const element = cellsSection;
        element.scrollTop = 0;

        fetchData("prepend");
      }}
      rounded
      iconRight="arrow-up">Prepend</Button>
    <Button
      size="is-small"
      on:click={() => {
        const element = cellsSection;
        element.scrollTop = element.scrollHeight;

        fetchData("append");
      }}
      rounded
      iconRight="arrow-down">Append</Button>
  </div>
  <div class="rightSearch">
    <input type="text" style='width:100%;border:0;' bind:value={rightSearchTerm} on:keypress={  (e) => {
      // console.log(e.srcElement.checkValidity())
      if (e.key === "Enter"){
        //API do search
        API.get("/search", { my_timeline : "test", query:rightSearchTerm, time_from:1,time_to:1713912948 }).then((res) => {
          timeline=res
      });
    }}} />
  </div>
  <div class="rightColumn" bind:this={cellsSection}>
    <section class="cells">
      <article class="media cell"></article>
      {#each timeline as v}
        <Cell
          isRead={Math.random()>0.5}
          onCellClick={() => {
            showingArticle = v;
            refreshReplies(v.id);
          }}
          cellData={v} />
      {/each}
    </section>

    <InfiniteScroll
      hasMore={newBatch.length > 0}
      threshold={500}
      on:loadMore={() => {
        fetchData("append");
      }} />
  </div>
</main>
