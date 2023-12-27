import { FlatList, View } from "react-native"
import { Typography } from "../components/Typography"
import { useSelector } from "react-redux"
import { Header } from "../components/header/Header";
import { PhotoListItem } from "../components/PhotoListItem";

export const FavoriteImageListScreen = (props) => {
  const imageList = useSelector((state) => state.favorite.favoriteList);

  return (
    <View style={{ flex:1 }}>
      <Header>
        <Header.Title title='FAVORITE'/>
      </Header>
      <FlatList
        style={{ flex:1 }}
        data={imageList}
        renderItem={({item}) => {
          return (
            <PhotoListItem url={item}/>
          )
        }}
      />
    </View>
  )
}