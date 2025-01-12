import React, {useEffect, useState} from 'react';

// Core
import {
  NativeModules,
  Platform,
  NativeEventEmitter,
  StatusBar,
  View,
} from 'react-native';

// External libs
import {getStatusBarHeight} from 'react-native-status-bar-height';

// Utils
import {getThemeColors} from '../utils';

// Redux
import {useSelector} from 'react-redux';

/**
 * @description Component in charge of status bar managment doing the right calculations
 */
function TvMazeStatusbar() {
  const [statusbarHeight, setStatusbarHeight] = useState(getStatusBarHeight());
  const {themeColorType} = useSelector(state => state.themes);
  const colors = getThemeColors(themeColorType);

  /**
   * @description effect needed for ios to detect changes in status bar due to shared hotspot or others
   */
  useEffect(() => {
    const {StatusBarManager} = NativeModules;
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight(({height}) => setStatusbarHeight(height));
      const statusbarEmiter = new NativeEventEmitter(StatusBarManager);
      const listener = statusbarEmiter.addListener(
        'statusBarFrameWillChange',
        statusBarData =>
          this.setState({statusBarHeight: statusBarData.frame.height}),
      );
      return () => listener.remove();
    }
  }, []);

  return (
    <View style={{height: statusbarHeight}}>
      <StatusBar
        barStyle={themeColorType === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={colors.backgroundAlt}
        translucent
      />
    </View>
  );
}

export default TvMazeStatusbar;
