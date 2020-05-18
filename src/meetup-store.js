import { writable } from "svelte/store";

const meetup = writable([
  
]);

const customMeetupStore = {
  subscribe: meetup.subscribe,
  setMeetups: (meetupArray) => {
    meetup.set(meetupArray);
  },
  addMeetup: (meetUpdata) => {
    const newMeetup = {
      ...meetUpdata    
    };
    meetup.update((items) => {
      return [newMeetup, ...items];
    });
  },
  toggleFavorite: (id) => {
    meetup.update((items) => {
      const updatedMeetup = { ...items.find((m) => m.id === id) };
      updatedMeetup.isFav = !updatedMeetup.isFav;
      const meetupIndex = items.findIndex((m) => m.id === id);
      const updatedMeetups = [...items];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },
  updateMeetup:(id,updateMeetup)=>{
    meetup.update((items)=>{ 
        const meetUpIndex = items.findIndex(i=>i.id === id);
        const update = {...items[meetUpIndex], ...updateMeetup}; 
        const updateMeetups = [...items];
        updateMeetups[meetUpIndex] = update;
        return updateMeetups;
    })
  },
  removeMeetup:(id)=>{
    meetup.update(items=>{
        return items.filter(i=> i.id !== id)
      })
  }
};
export default customMeetupStore;
