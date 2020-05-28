import React from 'react';
import {View, Modal, TouchableWithoutFeedback} from 'react-native';

import {styles} from './overlay.modal.styles';

export function OverlayModal(props) {
  const {children, visible, position, onBackdropPress} = props;
  let overlayPosition = 'center';
  if (position === 'bottom') {
    overlayPosition = 'flex-end';
  }
  return (
    <Modal
      statusBarTranslucent={false}
      animationType="slide"
      transparent={true}
      visible={visible}>
      <View
        style={[
          styles.overlayContainer,
          {justifyContent: `${overlayPosition}`},
        ]}>
        <TouchableWithoutFeedback onPress={onBackdropPress}>
          <View style={styles.modelBackdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.overlayContent}>{children}</View>
      </View>
    </Modal>
  );
}
