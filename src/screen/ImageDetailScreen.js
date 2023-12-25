import { View, useWindowDimensions } from 'react-native';
import { Typography } from '../components/Typography';
import { Header } from '../components/header/Header';
import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RemoteImage } from '../components/RemoteImage';
import { Button } from '../components/Button';
import { Icon } from '../components/Icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export const ImageDetailScreen = (props) => {
  const navigation = useNavigation();
  const route = useRoute();

  const onPressBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const onPressDownload = useCallback(async () => {
    const downloadResumable = FileSystem.createDownloadResumable(
      route.params.url,
      `${FileSystem.documentDirectory}${new Date().getMilliseconds()}.jpg`
    )

    try {
      const { uri } = await downloadResumable.downloadAsync();
      console.log('Finished download to ', uri);

      const permissionResponse = await MediaLibrary.getPermissionsAsync(true);
      console.log('permissionResponse', permissionResponse);

      if(permissionResponse.status === 'denied') {
        // 아예 못쓰는 상태
        return;
      } else if (permissionResponse.status = 'undetermined') {
        const requestResult = await MediaLibrary.requestPermissionsAsync();
        console.log('requestResult >> ', requestResult);

        if (requestResult.status === 'denied') {
          return;
        }
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = MediaLibrary.createAlbumAsync('MyFirstAlbum', asset, false);

      console.log(album);
      
    } catch(ex) {

    }

  }, []);

  const { width } = useWindowDimensions();

  return (
    <View style={{ flex:1 }}>
      <Header>
        <Header.Group>
          <Header.Icon iconName={'arrow-back'} onPress={onPressBack}/>
          <Header.Title title='IMAGE DETAIL'/>
        </Header.Group>
      </Header>
      <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
        <RemoteImage url={route.params.url} width={width} height={width * 1.5} />
      </View>

      <Button onPress={onPressDownload}>
        <View style={{paddingBottom:24, backgroundColor:'black'}}>
          <View style={{ height:52, flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
            <Typography color={'white'}>
              DOWNLOAD
            </Typography>
            <Icon name='download' size={24} color='white'/>
          </View>
        </View>
      </Button>

    </View>
  )
}