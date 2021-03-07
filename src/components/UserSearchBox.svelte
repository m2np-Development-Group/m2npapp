<script>
  import AutoComplete from "./SimpleAutocomplete.svelte";
  import API from "../api/Api";
import { navigate } from "svelte-routing";

  let fetch = async (event) => {
    return await API.get("/search?username=" + event).then((res) => {
      return res;
    });
  };
  let selected;

  export let value;
    function keyDownHandler(e) {
    if (e.key === 'Enter'){
//console.log(selected);
    }
  }
</script>

<svelte:window on:keydown={keyDownHandler}/>

<AutoComplete
  noResultsText=""
  showClear
  hideArrow
  placeholder="搜尋..."
  searchFunction={fetch}
  labelFieldName="username"
  valueFieldName="id"
  bind:text={value}
  bind:selectedItem={selected}
  onChange={(e)=>{
    if(e?.username){
      navigate(`/user/${e?.username}`)}
    }
  } />
