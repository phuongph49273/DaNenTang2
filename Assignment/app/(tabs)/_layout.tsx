import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource;
          if (route.name === 'main') {
            iconSource = focused
              ? require('../../assets/images/home_active.png')
              : require('../../assets/images/home.png');
          } else if (route.name === 'Search') {
            iconSource = focused
              ? require('../../assets/images/search_active.png')
              : require('../../assets/images/search.png');
          } else if (route.name === 'notifications') {
            iconSource = focused
              ? require('../../assets/images/bell_active.png')
              : require('../../assets/images/bell.png');
          } else if (route.name === 'profile') {
            iconSource = focused
              ? require('../../assets/images/profile_active.png')
              : require('../../assets/images/profile.png');
          }
          return <Image source={iconSource} style={{ width: 24, height: 24 }} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          height: 60,
          paddingBottom: 50,
          paddingTop: 16,
          backgroundColor: '#F9F9F9',
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: "15%",
          marginRight: "8%",
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name="main"
        options={{ headerShown: false, title: '' }}
      />
      <Tabs.Screen
        name="Search"
        options={{ headerShown: false, title: '' }}
      />
      <Tabs.Screen
        name="notifications"
        options={{ headerShown: false, title: '' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ headerShown: false, title: '' }}
      />
      <Tabs.Screen
        name="ProductDetail"
        options={{
          title: 'Chi tiết sản phẩm',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="EditProfile"
        options={{
          title: 'Chỉnh sửa thông tin',
          headerShown: false,
        }}
      />
      
    </Tabs>
  );
}