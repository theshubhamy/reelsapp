import {
  View,
  FlatList,
  ViewToken,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import CustomView from '../../components/global/CustomView';
import {useRoute} from '@react-navigation/native';
import {useAppDispatch} from '../../redux/reduxHook';
import {screenHeight} from '../../utils/Scaling';
import {debounce} from 'lodash';
import {fetchFeedReel} from '../../redux/actions/reelAction';
import {Image} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {Colors} from '../../constants/Colors';
import Loader from '../../assets/images/loader.jpg';
import {goBack} from '../../utils/NavigationUtil';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import VideoItem from '../../components/reel/VideoItem';
import {reelData} from '../../reelData';
interface RouteProp {
  data: any[];
}

const FeedReelScrollScreen: FC = () => {
  const route = useRoute();

  const routeParams = route?.params as RouteProp;

  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(0);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const onViewableItemsChanged = useRef(
    debounce(({viewableItems}: {viewableItems: Array<ViewToken>}) => {
      if (viewableItems.length > 0) {
        setCurrentVisibleIndex(viewableItems[0].index || 0);
      }
    }, 100),
  ).current;

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: screenHeight,
      offset: screenHeight * index,
      index,
    }),
    [],
  );

  useEffect(() => {
    if (routeParams?.data) {
      setData(routeParams?.data);
      setOffset(routeParams?.data?.length);
    }
  }, [routeParams?.data]);

  const renderVideoList = useCallback(
    ({item, index}: {item: any; index: number}) => {
      return (
        <VideoItem
          key={index}
          isVisible={index === currentVisibleIndex}
          item={item}
          preload={Math.abs(currentVisibleIndex + 3) >= index}
        />
      );
    },
    [currentVisibleIndex],
  );

  const keyExtractor = useCallback((item: any) => item._id.toString(), []);

  const memoizedValue = useMemo(() => renderVideoList, [renderVideoList]);

  return (
    <CustomView>
      <FlatList
        data={reelData || []}
        keyExtractor={keyExtractor}
        renderItem={memoizedValue}
        windowSize={2}
        onEndReached={async () => {
          console.log('fetching');
        }}
        pagingEnabled
        viewabilityConfig={viewabilityConfig}
        disableIntervalMomentum={true}
        removeClippedSubviews
        maxToRenderPerBatch={2}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={1}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          loading ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={Colors.white} />
            </View>
          ) : null
        }
        decelerationRate={'normal'}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      />
      <Image source={Loader} style={styles.thumbnail} />

      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => goBack()}>
          <Icon name="arrow-back" color="white" size={RFValue(20)} />
        </TouchableOpacity>
      </View>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 10,
    zIndex: 99,
  },
  footer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    position: 'absolute',
    zIndex: -2,
    aspectRatio: 9 / 16,
    height: screenHeight,
    width: '100%',
    alignSelf: 'center',
    right: 0,
    left: 0,
    resizeMode: 'stretch',
    top: 0,
    bottom: 0,
  },
});

export default FeedReelScrollScreen;
