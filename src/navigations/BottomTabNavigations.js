import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ImageListScreen } from '../screen/ImageListScreen';
import { FavoriteImageListScreen } from "../screen/FavoriteImageListScreen";
import { TabIcon } from "../components/TabIcon";
import { TabRouter } from "@react-navigation/native";

const Tabs = createBottomTabNavigator();

export const BottomTabNavigations = (props) => {
  return (
    <Tabs.Navigator 
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          const getIconName = () => {
            if (TabRouter.name === 'ImageList')
              return 'home';

            if (route.name === 'FavoriteImage')
              return 'star'
          }

          const iconName = getIconName();

          return (
            <TabIcon iconName={iconName} iconColor={focused ? 'tomato' : 'gray'} />
          )
        }
      })}>
      <Tabs.Screen name="ImageList" component={ImageListScreen}></Tabs.Screen>
      <Tabs.Screen name="FavoriteImageList" component={FavoriteImageListScreen}></Tabs.Screen>
    </Tabs.Navigator>
  )
}