import React, {FC, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AppStack from './appstack';

const MainNav: FC = () => {
  const checkUser = () => {
    auth().onAuthStateChanged(_user => {
      if (_user) {
        console.log(_user);
      }
    });
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <NavigationContainer>
      {<AppStack />}
    </NavigationContainer>
  );
};

export default MainNav;
