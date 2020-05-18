<script>
  import MeetUp from "./MeetupItems.svelte";
   import {scale} from 'svelte/transition';
  import {flip} from 'svelte/animate';
  import {createEventDispatcher} from 'svelte'
  import MeetupFilter from "./MeetupFilter.svelte";
  import Button from "../UI/Button.svelte";
 

  export let meetups;
  const dispatch = createEventDispatcher();
  function addTocart(){
      dispatch('add-to-cart',{id:1})
  }
  let favsOnly = false;

  $: filteredMeetups = favsOnly ? meetups.filter(m => m.isFav) : meetups;
  function setFilter(event) {
    favsOnly = event.detail === 1;
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
  </style>
  <section id="meetup-controls">
  <MeetupFilter on:select={setFilter} />
  <!-- <Button on:click={() => dispatch('add')}>New Meetup</Button> -->
</section>
<section id="meetups">
  {#each filteredMeetups  as item (item.id)}
  <div translate:scale animate:flip ={{duration:100}}>
      <MeetUp
      id={item.id}
      title={item.title}
      subtitle={item.subtitle}
      description={item.description}
      imageUrl={item.imageUrl}
      address={item.address}
      contactEmail={item.contactEmail}
      isFav  =  {item.isFav}
      on:showdetails
      on:edit
      />
  </div>



  {/each}
</section>