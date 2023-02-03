import React from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ImageBackground, FlatList, Alert, Image } from 'react-native';
import axios from 'axios'
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      wheatherInfo: [],
      cityName: "",
      currentLocation: "",
      locationService: false,
      foreCast: false,
      forecastData: [],
      forecastTemp: [],
      forecastTempMinMax: [],
      getfavouriteCity : "",
      param: "",
      foreCastFlag: false
    };
  }
  componentDidMount() {

    this.GetCurrentLocation();

  }

  GetCurrentLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission not granted',
        'Allow the app to use location service.',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
    else {
      let { coords } = await Location.getCurrentPositionAsync();
      this.setState({ currentLocation: coords })
      this.fetchWheatherData();
      // console.log(this.state.currentLocation)
      // console.log(this.state.currentLocation.latitude)
      // console.log(this.state.currentLocation.longitude)
    }
  };

fetchKey =async() =>{ 
  var fqKey='';
  var lat = await this.state.currentLocation.latitude
  var lon = await this.state.currentLocation.longitude
  var favCity = this.state.getfavouriteCity
  var enteredCity = this.state.cityName
  // console.log(this.state.currentLocation)
  // console.log(lat, lon)
  console.log('favcity', favCity)

  switch(this.state.param) {
 
    case 'favCity':
      fqKey = 'q='+favCity;
      break;
    
    case 'enteredCity':
      fqKey = 'q='+enteredCity;
      break;

    default:
      fqKey = 'lat=' + lat + '&lon=' + lon ;
  
    }
  
  // if (favCity){
  //   fqKey = 'q='+favCity  
  // }
  // else{
  //   fqKey = 'lat=' + lat + '&lon=' + lon 
  // }
  console.log('Query key', fqKey)

  return fqKey;
}

  fetchWheatherData = async () => {

    var qKey = await this.fetchKey()
    console.log('Query key in Weather Data', qKey)

    try {
      var url = 'http://api.openweathermap.org/data/2.5/weather?'+qKey+ '&units=metric&appid=3516d81933d1abf37446eb220427936d'
      axios.get(url)
        .then((response) => {
          this.setState({ wheatherInfo: response.data })
          console.log("url response", response.data)
        })
    }
    catch (e) {
      console.log("Error", e)
    }

    var lat = this.state.currentLocation.latitude
    var lon = this.state.currentLocation.longitude
    //  console.log(lat, lon)
    try {
      var url = 'http://api.openweathermap.org/data/2.5/forecast?' +qKey+'&units=metric&appid=3516d81933d1abf37446eb220427936d'
      axios.get(url)
        .then((response) => {
          this.setState({ forecastData: response.data })
          console.log('With Date', this.state.forecastData)
        })
    }
    catch (e) {
      console.log("Error", e)
    }
  
  };

  fetchForeCast = async () => {
    this.setState({forecastTemp: []})
    console.log("Forcast data", this.state.forecastData)
    var dataLength = Object.keys(this.state.forecastData.list).length;
    console.log("Forcast data Length", dataLength)
    var startpt = 0
    var startDate = this.state.forecastData.list[0].dt_txt
    startpt = ((24 - Number(startDate.slice(11, 13))) / 3) % 8
    console.log("start date", startDate.slice(11, 13), startpt)

    for (let j = startpt; j < dataLength; j = j + 8) {
      this.state.forecastTemp.push([this.state.forecastData.list[j].dt_txt])
      for (let i = j; i < j + 8; i++) {
        // console.log("Temp data", this.state.forecastData.list[i].main.temp, this.state.forecastData.city.name)
        if (i < dataLength) {
          this.state.forecastTemp.push(this.state.forecastData.list[i].main.temp_max)
          this.state.forecastTemp.push(this.state.forecastData.list[i].main.temp_min)
        }
        else { break }
      }
    }

    this.state.forecastTempMinMax = [[this.state.forecastTemp.slice(0, 1), Math.max(...this.state.forecastTemp.slice(1, 17)), Math.min(...this.state.forecastTemp.slice(1, 17))],
    [this.state.forecastTemp.slice(17, 18), Math.max(...this.state.forecastTemp.slice(18, 34)), Math.min(...this.state.forecastTemp.slice(18, 34))],
    [this.state.forecastTemp.slice(34, 35), Math.max(...this.state.forecastTemp.slice(35, 51)), Math.min(...this.state.forecastTemp.slice(35, 51))],
    [this.state.forecastTemp.slice(51, 52), Math.max(...this.state.forecastTemp.slice(52, 68)), Math.min(...this.state.forecastTemp.slice(52, 68))],
    [this.state.forecastTemp.slice(68, 69), Math.max(...this.state.forecastTemp.slice(69, 84)), Math.min(...this.state.forecastTemp.slice(69, 84))]]

    // for (let i = startpt; i < dataLength; i = i + 8) {
    //   console.log("Temp data", this.state.forecastData.list[i].main.temp, this.state.forecastData.city.name)
    //   // this.forecastTemp.push(this.state.forecastData.list[i].main.temp)
    //   // this.setState({forecastTemp: [...this.state.forecastTemp,this.state.forecastData.list[i].main.temp]})
    //   this.state.forecastTemp.push([this.state.forecastData.list[i].main.temp, this.state.forecastData.list[i].dt_txt])
    // }
    console.log(this.state.forecastTemp)
    console.log(this.state.forecastTempMinMax)
    
  }


  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item: data, index }) => {
    return (
      <View>
        <Text style={{ marginTop: 15, color: "green", fontWeight: "bold", textAlign: 'right' }}>On {String(data[0]).slice(0, 10)} Temp  : {data[1]} °C / {data[2]} °C </Text>

      </View>
    );
  };

  makeCityFavourite = async () => {
    try {

      const favouriteCity = this.state.wheatherInfo.name
      const favouriteCityJson = JSON.stringify(favouriteCity);
      await AsyncStorage.setItem('CityName', favouriteCityJson);
      console.log('data stored succefully in local storage',favouriteCityJson);
    } catch (e) {
      console.log(e);
    }

  }
  getFavouriteCityTemp = async () => {
    const data = localStorage.getItem('CityName');
    console.log("Favorite City fetched from Local as",data);
    console.log('data: ', JSON.parse(data));
    var dataarray = JSON.parse(data);
    this.setState({ getfavouriteCity: dataarray });
    console.log(typeof this.state.getfavouriteCity);
  };
  render() {

    return (
      <ImageBackground source={require("../assets/bg.jpg")} style={styles.image}>
        <View >
          <View style={styles.uppercontainer}>
            <TextInput
              placeholder="Enter the city"
              value={this.cityName}
              onChange={(text) => this.setState({ cityName: text.target.value })}
              style={styles.textInput}
            />
            <TouchableOpacity
              onPress={() => {
                this.state.cityName ?
                (this.fetchWheatherData(), this.setState({param: 'enteredCity'}), this.setState({forecastTempMinMax: []})): alert("Enter City Name")
              }}>
              <Image source={require("../assets/search.png")} style={{ width: 50, height: 50 }} />

            </TouchableOpacity>

          </View>
          <View style={styles.lowercontainer} >
            <View>
              <View style={{ flexDirection: "row", justifyContent: "left", paddingRight: 80 }}><Text style={styles.printText}> Current City  : </Text><Text style={styles.printTextVal}> {this.state.wheatherInfo.name ? this.state.wheatherInfo.name : null}</Text>
              <TouchableOpacity onPress={() => {this.makeCityFavourite(); this.getFavouriteCityTemp()}}>
                 <Text style={{ marginLeft: 10, marginTop: 18, color: "green", fontWeight: "bold", fontSize: 10, textAlign: 'center' }}>Make City Favourite</Text>
             </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "left", paddingRight: 80 }}><Text style={styles.printText}> Tempreture : </Text><Text style={styles.printTextVal}>{this.state.wheatherInfo.main ? this.state.wheatherInfo.main.temp.toFixed() : null}°C</Text></View>
              <View style={{ flexDirection: "row", justifyContent: "left", paddingRight: 80 }}><Text style={styles.printText}> Humidity : </Text><Text style={styles.printTextVal}>{this.state.wheatherInfo.main ? this.state.wheatherInfo.main.humidity.toFixed() : null}%</Text></View>
              <View style={{ flexDirection: "row", justifyContent: "left", paddingRight: 80 }}><Text style={styles.printText}>Max Tempreture : </Text><Text style={styles.printTextVal}>{this.state.wheatherInfo.main ? this.state.wheatherInfo.main.temp_max.toFixed() : null}°C</Text></View>
              <View style={{ flexDirection: "row", justifyContent: "left", paddingRight: 80 }}><Text style={styles.printText}> Min Tempreture : </Text><Text style={styles.printTextVal}>{this.state.wheatherInfo.main ? this.state.wheatherInfo.main.temp_min.toFixed() : null}°C</Text></View>
            </View>

            <View>
            <Text style={{ marginLeft: 25, marginTop: 10,  color: "purple", fontWeight: "bold", fontSize: 15, textAlign: 'right' }}> Favourite City</Text>
            <TouchableOpacity onPress={()=>{this.fetchWheatherData(); this.setState({param: 'favCity'});this.setState({forecastTempMinMax: []})}}>
                  <Text style={{ marginLeft: 25, marginTop: 10,  color: "maroon", fontWeight: "bold", fontSize: 15, textAlign: 'center' }}> {this.state.getfavouriteCity}</Text>
                </TouchableOpacity>

            </View>

            <View>
              <TouchableOpacity onPress={() => { this.fetchForeCast(); this.setState({ foreCast: true }); this.setState({foreCastFlag:true})}}>
                <Text style={{ marginLeft: 25, marginTop: 5, color: "purple", fontWeight: "bold", fontSize: 20, textAlign: 'right' }}> Next 5 Days Weather forecast</Text>
              </TouchableOpacity>

              <FlatList
                data={this.state.forecastTempMinMax}
                keyExtractor={this.keyExtractor}
                renderItem={this.state.foreCast && this.state.foreCastFlag ? this.renderItem : ""}
              />
            </View>

          </View>
              {/* <View>
                <TouchableOpacity onPress={()=>{var favCityName = this.getFavouriteCityTemp(); console.log("The favoruite city fetched is ",favCityName)}}>
                  <Text> Check Tempreture for favouriteCity</Text>
                </TouchableOpacity>
              </View> */}

        </View>
      </ImageBackground>
    );
  }
}


const styles = StyleSheet.create({
  uppercontainer: {
    flex: 1.0,
    flexDirection: "row",
    paddingLeft: "2%",
    justifyContent: "center"
  },
  lowercontainer: {
    marginTop: 15,
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "center"
  },
  image: {
    flex: 1.5,
    resizeMode: "cover"
  },
  textInput: {
    borderColor: "white",
    borderWidth: 2,
    color: "white",
    width: "50%"

  },
  searchText: {
    color: "white",
    fontWeight: "bold"
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