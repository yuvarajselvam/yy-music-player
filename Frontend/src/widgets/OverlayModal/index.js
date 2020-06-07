import React from 'react';
import PropTypes from 'prop-types';
import {View, Modal, TouchableWithoutFeedback} from 'react-native';

import {styles} from './overlay.modal.styles';

OverlayModal.propTypes = {
  visible: PropTypes.bool,
  fullScreen: PropTypes.bool,
  position: PropTypes.string,
  onBackdropPress: PropTypes.func,
  backHandler: PropTypes.func,
  children: PropTypes.any,
};

export function OverlayModal(props) {
  const {
    children,
    visible,
    fullScreen,
    position,
    onBackdropPress,
    backHandler,
  } = props;
  let overlayPosition = 'center';
  if (position === 'bottom') {
    overlayPosition = 'flex-end';
  }
  return (
    <Modal
      onRequestClose={backHandler}
      statusBarTranslucent={false}
      animationType="slide"
      transparent={true}
      visible={visible}>
      <View
        style={[
          styles.overlayContainer,
          {justifyContent: `${overlayPosition}`},
          fullScreen ? {padding: 0} : null,
        ]}>
        <TouchableWithoutFeedback onPress={onBackdropPress}>
          <View style={styles.modelBackdrop} />
        </TouchableWithoutFeedback>
        <View style={[styles.overlayContent, fullScreen ? {flex: 1} : null]}>
          {children}
        </View>
      </View>
    </Modal>
  );
}
