import colors from './colors';
import fonts from './fonts';
import metrics from './metrics';
import {StyleSheet} from 'react-native'


var styles = StyleSheet.create({
    container: {
      margin: metrics.padding ,
    },
    titulo:{
        color:colors.dark,
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitulo:{
        color:colors.regular,
        fontSize: 14,
    },
    texto:{
        fontWeight: 'bold',
        fontSize: fonts.smallerB,
    }

    
    
  });


export { colors, fonts, metrics,styles };
