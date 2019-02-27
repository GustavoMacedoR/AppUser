import React from 'react';
import { createStackNavigator,createAppContainer} from "react-navigation";
import { StyleProvider } from "native-base";
import {eventos,cadastro,treinos,login,cadastroUser,conta,cadastroGrupo,cadastroGrupos} from "./pages";
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';


const Stack = createStackNavigator(
  {
    eventos: {screen:eventos},
    treinos:{screen:treinos},
    cadastro: {screen:cadastro},
    login:{screen:login},
    cadastroUser:{screen:cadastroUser},
    conta:{screen:conta},
    cadastroGrupo:{screen:cadastroGrupo},
    cadastroGrupos:{screen:cadastroGrupos}

  },
  {
    headerMode:'none',
    mode:'modal',
  },
);

  const AppContainer = createAppContainer(Stack);

  export default class App extends React.Component {
    render() {
      return (
        <StyleProvider style={getTheme(material)}>
          <AppContainer />
        </StyleProvider>        
        );
    }
  }


// import React from "react";
// import { View, Text } from "react-native";
// import { createStackNavigator, createAppContainer } from "react-navigation";

// class HomeScreen extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//         <Text>Home Screen</Text>
//       </View>
//     );
//   }
// }

// const AppNavigator = createStackNavigator({
//   Home: {
//     screen: HomeScreen
//   }
// });

// export default createAppContainer(AppNavigator);

