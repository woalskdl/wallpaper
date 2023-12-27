import { ActivityIndicator, View, useWindowDimensions } from 'react-native';
import { Typography } from '../components/Typography';
import { Header } from '../components/header/Header';
import { useCallback, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RemoteImage } from '../components/RemoteImage';
import { Button } from '../components/Button';
import { Icon } from '../components/Icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useDispatch, useSelector } from 'react-redux';
import { onClickFavorite } from '../actions/favorite';

export const ImageDetailScreen = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [downloading, setDownloading] = useState(false);

  const dispatch = useDispatch();

  const onPressFavorite = useCallback(() => {
    console.log('onPressFavorite');
    dispatch(onClickFavorite(route.params.url));
  }, []);

  const onPressBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const onPressDownload = useCallback(async () => {
    setDownloading(true);

    const downloadResumable = FileSystem.createDownloadResumable(
      route.params.url,
      `${FileSystem.documentDirectory}${new Date().getMilliseconds()}.jpg`
    )

    try {
      const { uri } = await downloadResumable.downloadAsync();

      const permissionResponse = await MediaLibrary.getPermissionsAsync(true);

      if(permissionResponse.status === 'denied') {
        // 아예 못쓰는 상태
        setDownloading(false);
        return;
      } else if (permissionResponse.status = 'undetermined') {
        const requestResult = await MediaLibrary.requestPermissionsAsync();

        if (requestResult.status === 'denied') {
          setDownloading(false);
          return;
        }
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = MediaLibrary.createAlbumAsync('MyFirstAlbum', asset, false);  // TODO : 다운로드 버튼 누를때마다 같은 이름 폴더 계속 생성중

    } catch(ex) {

    }

    setDownloading(false);
    
  }, []);

  const { width } = useWindowDimensions();

  const isFavorite = useSelector((state) => {
    return state.favorite.favoriteList.filter((item) => item === route.params.url).length > 0;
  })

  return (
    <View style={{ flex:1 }}>
      <Header>
        <Header.Group>
          <Header.Icon iconName={'arrow-back'} onPress={onPressBack}/>
          <Header.Title title='IMAGE DETAIL'/>
        </Header.Group>

        <Header.Icon iconName={isFavorite ? 'heart' : 'heart-outline'} onPress={onPressFavorite}/>

      </Header>
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <RemoteImage url={route.params.url} width={width} height={width * 1.5} />
      </View>

      <Button onPress={onPressDownload}>
        <View style={{paddingBottom:24, backgroundColor:'black'}}>
          {downloading ? (
            <View style={{ height:52, flexDirection:'row', alignItems:'center', justifyContent:'center' }}>
              <ActivityIndicator/>
            </View>
          ) : (
            <View style={{ height:52, flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
              <Typography color={'white'}>
                DOWNLOAD
              </Typography>
              <Icon name='download' size={24} color='white'/>
            </View>
          )}
        </View>
      </Button>

    </View>
  )
}