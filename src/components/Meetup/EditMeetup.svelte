<script>
  import { createEventDispatcher } from "svelte";
  import meetup from "../../meetup-store.js";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";
  import { isEmpty, isValidEmail } from "../../healper/validation.js";
  
   export let id = null;
  
 
  let title = "";
  let subtitle = "";
  let address = "";
  let email = "";
  let description = "";
  let imageUrl = "";

  const dispatch = createEventDispatcher();
    if(id){
    const unsub = meetup.subscribe(items=>{
      const selectMeetup =items.find(i=> i.id === id);
      title = selectMeetup.title;
      subtitle = selectMeetup.subtitle;
      address = selectMeetup.address;
      email = selectMeetup.contactEmail;
      description =  selectMeetup.description;
      imageUrl =  selectMeetup.imageUrl;
    });
    unsub();
   }
  $: titleValid = !isEmpty(title);
  $: subtitleValid = !isEmpty(subtitle);
  $: addressValid = !isEmpty(address);
  $: descriptionValid = !isEmpty(description);
  $: imageUrlValid = !isEmpty(imageUrl);
  $: emailValid = isValidEmail(email);
  $: formIsValid =
    titleValid &&
    subtitleValid &&
    addressValid &&
    descriptionValid &&
    imageUrlValid &&
    emailValid;
  function submitForm() {
    const newMeetUp = {
      description: description,
      title: title,
      imageUrl: imageUrl,
      subtitle: subtitle,
      contactEmail: email,
      address: address
    };
   // meetup.addMeetup(newMeetUp);
    if(id){
       fetch(`https://august-balancer-265810.firebaseio.com/meetups/${id}.json`, {
        method: "PATCH",
        body: JSON.stringify(newMeetUp),
        headers: { "Content-Type": "application/json" }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("An error occurred, please try again!");
          }
          meetup.updateMeetup(id,newMeetUp);
        })
        .catch(err => {
          console.log(err);
        });
    
    }else{
     //meetup.addMeetup(newMeetUp);
  fetch("https://august-balancer-265810.firebaseio.com/meetups.json", {
        method: "POST",
        body: JSON.stringify({ ...newMeetUp, isFav: false }),
        headers: { "Content-Type": "application/json" }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("An error occurred, please try again!");
          }
          return res.json();
        })
        .then(data => {
          meetup.addMeetup({
            ...newMeetUp,
            isFavorite: false,
            id: data.name
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
    dispatch("save");
  }

  function cancel() {
    dispatch("cancel");
  }
  function deleteItem(){
    

    fetch(`https://august-balancer-265810.firebaseio.com/meetups/${id}.json`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("An error occurred, please try again!");
        }
         meetup.removeMeetup(id);
      })
      .catch(err => console.log(err));
    dispatch("save");
 
  }
</script>

<style>
  form {
    width: 30rem;
    max-width: 90%;
    margin: auto;
  }
</style>

<Modal title="Meetup Data" on:cancel>
  <form on:submit|preventDefault={submitForm}>
    <TextInput
      id="title"
      label="Title"
      valid={titleValid}
      validityMessage="Please enter a valid title."
      value={title}
      on:input={event => (title = event.target.value)} />
    <TextInput
      id="subtitle"
      label="Subtitle"
      valid={subtitleValid}
      validityMessage="Please enter a valid subtitle."
      value={subtitle}
      on:input={event => (subtitle = event.target.value)} />
    <TextInput
      id="address"
      label="Address"
      type="text"
      valid={addressValid}
      validityMessage="Please enter a valid address."
      value={address}
      on:input={event => (address = event.target.value)} />
    <TextInput
      id="imageUrl"
      label="Image URL"
      valid={imageUrlValid}
      validityMessage="Please enter a valid image url."
      type="text"
      value={imageUrl}
      on:input={event => (imageUrl = event.target.value)} />
    <TextInput
      id="email"
      label="E-Mail"
      type="email"
      valid={emailValid}
      validityMessage="Please enter a valid email address."
      value={email}
      on:input={event => (email = event.target.value)} />
    <TextInput
      id="description"
      label="Description"
      controlType="textarea"
      valid={descriptionValid}
      validityMessage="Please enter a valid description."
      value={description}
      on:input={event => (description = event.target.value)} />

  </form>
  <div slot="footer">
    <Button type="button" mode="outline" on:click={cancel}>Cancel</Button>
    <Button type="button" on:click={submitForm} disabled={!formIsValid}>
      Save
    </Button>
    {#if id}
     <Button type="button" on:click={deleteItem}>
      Delete
    </Button>
    {/if}
  </div>
</Modal>
