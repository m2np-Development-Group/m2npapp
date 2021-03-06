<script>
  import AutoComplete from "simple-svelte-autocomplete";
  import API from "../api/Api";

  let fetch = async (event) => {
    return await API.get("/search?username=" + event).then((res) => {
      return res;
    });
  };
  export let selectedValue;
</script>

<AutoComplete
  noResultsText=""
  showClear
  hideArrow
  placeholder="搜尋..."
  searchFunction={fetch}
  labelFieldName="username"
  valueFieldName="id"
  bind:selectedItem={selectedValue} />
