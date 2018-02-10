import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './index.style';

const { width: viewportWidth } = Dimensions.get('window');

export const sliderWidthSingle = viewportWidth;
// export const itemWidth = slideWidth + itemHorizontalMargin -30;
export const itemWidthSingle = viewportWidth;

const entryBorderRadius = 8;

export default StyleSheet.create({
    slideInnerContainer: {
        width: itemWidthSingle,
        height: itemWidthSingle - 30,
    },
    imageContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
    },
    imageContainerEven: {
        backgroundColor: colors.black
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'stretch',
        flex: 1
    },
    // image's border radius is buggy on ios; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor: colors.black
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 10 - entryBorderRadius,
        paddingBottom: 10,
        paddingHorizontal: 8,
        backgroundColor: '#DDDDDD',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius,
        // borderLeft: 0.5,
        // borderColor: '#DDDDDD'
    },
    textContainerEven: {
        backgroundColor: colors.black
    },
    title: {
        color: colors.black,
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: colors.gray,
        fontSize: 12,
        fontWeight: 'bold'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    }
});
