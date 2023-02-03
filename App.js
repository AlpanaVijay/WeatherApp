import React from "react"
import { Text } from "react-native"
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Home from "./Source/Home"



// const AppSwitchNavigator = createSwitchNavigator({
//   Home: Home,
//   CityForeCast: CityForeCast
// });

// const AppNavigator = createAppContainer(AppSwitchNavigator);

export default function App() {
  return (<Home/>)
}
