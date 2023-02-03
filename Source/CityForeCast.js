import React from 'react';
import { Text, TouchableOpacity, View, ImageBackground, StyleSheet } from 'react-native';
import axios from 'axios'


export default class CityForeCast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityName: this.props.navigation.state.params.city,
      wheatherInfo: [],


    };
  }
  componentDidMount() {
    this.fetchWheatherData();
  }



  fetchWheatherData = async () => {
    console.log(this.props)
    console.log(this.state.cityName)
    try {
      const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + this.state.cityName + '&units=metric&APPID=3516d81933d1abf37446eb220427936d'
      await axios.get(url)
        .then((response) => {
          this.setState({ wheatherInfo: response.data })
          console.log(response.data)
        })

    }

    catch (e) {
      alert("Invalid City Name", e)
    }
  };
  render() {
    return (
      <ImageBackground source={require("../assets/bg.jpg")} style={styles.image}>
        <View style={styles.container}>
          <View>
            <View style={{ flexDirection: "row", justifyContent: "left", paddingRight: 80 }}><Text style={styles.printText}> Current City  : </Text><Text style={styles.printTextVal}> {this.state.wheatherInfo.name ? this.state.wheatherInfo.name : null}</Text></View>
            <View style={{ flexDirection: "row", justifyContent: "left", paddingRight: 80 }}><Text style={styles.printText}> Tempreture : </Text><Text style={styles.printTextVal}>{this.state.wheatherInfo.main ? this.state.wheatherInfo.main.temp.toFixed() : null}°C</Text></View>
            <View style={{ flexDirection: "row", justifyContent: "left", paddingRight: 80 }}><Text style={styles.printText}> Humidity : </Text><Text style={styles.printTextVal}>{this.state.wheatherInfo.main ? this.state.wheatherInfo.main.humidity.toFixed() : null}%</Text></View>
            <View style={{ flexDirection: "row", justifyContent: "left", paddingRight: 80 }}><Text style={styles.printText}>Max Tempreture : </Text><Text style={styles.printTextVal}>{this.state.wheatherInfo.main ? this.state.wheatherInfo.main.temp_max.toFixed() : null}°C</Text></View>
            <View style={{ flexDirection: "row", justifyContent: "left", paddingRight: 80 }}><Text style={styles.printText}> Min Tempreture : </Text><Text style={styles.printTextVal}>{this.state.wheatherInfo.main ? this.state.wheatherInfo.main.temp_min.toFixed() : null}°C</Text></View>
          </View>

          <View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('Home')
              }>
              <Text style={styles.printTextVal}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1.0,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  image: {
    flex: 1.5,
    resizeMode: "cover"
  },


  printText: {
    marginTop: 15,
    color: "white",
    fontWeight: "bold"
  },
  printTextVal: {
    marginTop: 15,
    color: "maroon",
    fontWeight: "bold",
    fontSize: 15
  }
})