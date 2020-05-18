<script context="module">
  export function preload(page) {
    return this.fetch(
      "https://august-balancer-265810.firebaseio.com/meetups.json"
    )
      .then(res => {
        if (!res.ok) {
          throw new Error("Fetching meetups failed, please try again later!");
        }
        return res.json();
      })
      .then(data => {
        const loadedMeetups = [];
        for (const key in data) {
          loadedMeetups.push({
            ...data[key],
            id: key
          });
        }
        return { fetchMeetUp: loadedMeetups.reverse() };
        // setTimeout(() => {
        //   isLoading = false;
        //   meetups.setMeetups(loadedMeetups.reverse());
        // }, 1000);
      })
      .catch(err => {
        error = err;
        isLoading = false;
        console.log(err);
        this.error(500, "Could not fetch meetups!");
      });
  }
</script>

<script>
  import MeetUp from "../components/Meetup/MeetupItems.svelte";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import MeetupFilter from "../components/Meetup/MeetupFilter.svelte";
  import Button from "../components/UI/Button.svelte";
  import LoadingSpinner from "../components/UI/LoadinSpinner.svelte";
  import Editmeetup from "../components/Meetup/EditMeetup.svelte";
  import meetup from "../meetup-store.js";
  export let fetchMeetUp;
  let loadMeetups = [];
  let editMode;
  let editId;
  let isLoading;

  const dispatch = createEventDispatcher();
  function addTocart() {
    dispatch("add-to-cart", { id: 1 });
  }
  let favsOnly = false;
  let unsubscribe;
  $: filteredMeetups = favsOnly
    ? fetchMeetUp.filter(m => m.isFav)
    : fetchMeetUp;

  onMount(() => {
    //isLoading = true
     meetup.setMeetups(fetchMeetUp);
    unsubscribe = meetup.subscribe(items => {
      fetchMeetUp = items;
    });
   
  });
  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
  function setFilter(event) {
    favsOnly = event.detail === 1;
  }

  function saveMeetup(event) {
    editMode = null;
  }

  function startEdit(event) {
    editMode = "edit";
    editId = event.detail;
  }
  function cancelEdit() {
    editMode = null;
    editId = null;
  }

  function startAdd() {
    editMode = "edit";
  }
  function clearError() {
    error = null;
  }
</script>

<style>
  #meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  @media (min-width: 768px) {
    #meetups {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  #meetup-controls {
    margin: 1rem;
    display: flex;
    justify-content: space-between;
  }

  #no-meetups {
    margin: 1rem;
  }
</style>


<svelte:head>
  <title>Sample project</title>
</svelte:head>
<!-- <div class="meetup-controls">

    <Button  on:click={() => (editMode = 'edit')} >Add New Meetup</Button>
</div> -->

{#if editMode === 'edit'}
  <Editmeetup id={editId} on:save={saveMeetup} on:cancel={cancelEdit} />
{/if}
{#if isLoading}
  <LoadingSpinner />
{:else}
  <section id="meetup-controls">
    <MeetupFilter on:select={setFilter} />
    <Button on:click={startAdd}>New Meetup</Button>
  </section>
  {#if filteredMeetups.length === 0}
    <p id="no-meetups">No meetups found, you can start adding some.</p>
  {/if}
  <section id="meetups">
    {#each filteredMeetups as item (item.id)}
      <div translate:scale animate:flip={{ duration: 100 }}>
        <MeetUp
          id={item.id}
          title={item.title}
          subtitle={item.subtitle}
          description={item.description}
          imageUrl={item.imageUrl}
          address={item.address}
          contactEmail={item.contactEmail}
          isFav={item.isFav}
          on:edit={startEdit} />
      </div>
    {/each}
  </section>
{/if}
