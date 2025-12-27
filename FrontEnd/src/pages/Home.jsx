import React from 'react'
import UserNavBar from '../components/UserNavBar'
import NearbySearchBar from '../components/NearbySearchBar'
import Allproducts from '../components/Allproducts'

const Home = () => {
  return (
    <div>
        <UserNavBar />
        <NearbySearchBar />
        <Allproducts />
    </div>
  )
}

export default Home