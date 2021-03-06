<script>
  import AutoComplete from "./SimpleAutocomplete.svelte";
  import API from "../api/Api";

  let fetch = async (event) => {
    return await API.get("/search?username=" + event).then((res) => {
      return res;
    });
  };
  let selected;

  export let value;
  $: {
console.log(value);
console.log(selected);
    }
    function keyDownHandler(e) {
    if (e.key === 'Enter'){
      console.log(value);
console.log(selected);
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
  onChange={(e)=>console.log(e)} />
