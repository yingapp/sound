import React from 'react';
import Add from './Add';
import Refresh from './Refresh';
import Profile from './Profile';
import SoundList from './SoundList';

console.log(111)
export default function Staff() {
  return (
    <>
      <SoundList />
      <Refresh />
      <Add />
      <Profile />
    </>
  )
}