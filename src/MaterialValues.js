
const baselineGrid = 8;

export const metrics = {
  baselineGrid,
  screenEdgeMarginHorizontal: baselineGrid * 2,
  gutterHorizontal: baselineGrid * 2,
  gutterVertical: baselineGrid * 2,
  toolbarHeight: baselineGrid * 7,
  fabSize: baselineGrid * 7,
  fabIconSize: baselineGrid * 3,
  fabSizeMini: baselineGrid * 5,
  elevation: {
    appBar: 4,
    fabResting: 6,
    fabPressed: 12,
    dialog: 24,
  },
};

// const fontFamilies = {
//   normal: { fontFamily: 'normal', },
//   notoserif: { fontFamily: 'notoserif', },
//   sansSerif: { fontFamily: 'sans-serif', },
//   sansSerifLight: { fontFamily: 'sans-serif-light', },
//   sansSerifThin: { fontFamily: 'sans-serif-thin', },
//   sansSerifCondensed: { fontFamily: 'sans-serif-condensed', },
//   sansSerifMedium: { fontFamily: 'sans-serif-medium', },
//   serif: { fontFamily: 'serif', },
//   Roboto: { fontFamily: 'Roboto', },
//   monospace: { fontFamily: 'monospace', },
// };

// const fontFamilies = {
//   normal: { fontFamily: 'normal', },
//   notoserif: { fontFamily: 'normal', },
//   sansSerif: { fontFamily: 'normal', },
//   sansSerifLight: { fontFamily: 'normal', },
//   sansSerifThin: { fontFamily: 'normal', },
//   sansSerifCondensed: { fontFamily: 'normal', },
//   sansSerifMedium: { fontFamily: 'normal', },
//   serif: { fontFamily: 'normal', },
//   Roboto: { fontFamily: 'normal', },
//   monospace: { fontFamily: 'normal', },
// };

export const fonts = {
  // English and English-alike only.
  
  sizes: {
    display4: { fontSize: 112 },
    display3: { fontSize: 56, },
    display2: { fontSize: 45, lineHeight: 48 },
    display1: { fontSize: 34, lineHeight: 40 },
    headline: { fontSize: 24, lineHeight: 32 },
    title: { fontSize: 20, lineHeight: 24 },
    subheading: { fontSize: 16, lineHeight: 24 },
    body2: { fontSize: 14, lineHeight: 24 },
    body1: { fontSize: 14, lineHeight: 20 },
    caption: { fontSize: 12 },
    button: { fontSize: 14 },
  },
  align:{
    center: {
      textAlign: 'center',
    },
    right: {
      textAlign: 'right',
    },
    left: {
      textAlign: 'left',
    }
  },
  // families: fontFamilies,
};
export const colors = {
  red: '#B71C1C',
  purple: '#4A148C',
  blue: '#2196F3',
  green: '#4CAF50',

} 

export const themeColors = {
  color1: 'rgb(9, 77, 158)',
  color2: 'rgb(34, 120, 207)',
  color3: '',
}
 
export const priceFont = {
  fontWeight: 'bold',
}

export const positions = {
  alignItemCenter: {
    alignItems: 'center'
  },
  alignItemStart: {
    alignItems: 'flex-start',
  },
  alignItemEnd: {
    alignItems: 'flex-end',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentBetween: {
    justifyContent: 'space-between',
  },
  justifyContentAround: {
    justifyContent: 'space-around',
  },

}