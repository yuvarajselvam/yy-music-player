import React from 'react';
import PropTypes from 'prop-types';
import {ListItem, Icon, Avatar} from 'react-native-elements';
import {Colors} from 'react-native-paper';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {styles} from './list.styles';

ListItemsComponent.propTypes = {
  options: PropTypes.array,
  single: PropTypes.bool,
  titleText: PropTypes.string,
  titleKeys: PropTypes.array,
  subtitleElement: PropTypes.func,
  subtitleText: PropTypes.string,
  subtitleKeys: PropTypes.array,
  leftElement: PropTypes.func,
  rightElement: PropTypes.func,
  leftAvatarKey: PropTypes.string,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  rightIconName: PropTypes.string,
  onRightIconPress: PropTypes.func,
  listSelectedStyle: PropTypes.any,
  disabledKey: PropTypes.string,
  disabledValue: PropTypes.string,
  emptyTitle: PropTypes.string,
  emptySubtitle: PropTypes.string,
};

function ListItemsComponent(props) {
  const {
    options,
    single,
    titleText,
    titleKeys,
    subtitleElement,
    subtitleText,
    subtitleKeys,
    leftAvatarKey,
    leftElement,
    rightElement,
    onPress,
    onLongPress,
    rightIconName,
    onRightIconPress,
    listSelectedStyle,
    disabledKey,
    disabledValue,
    emptyTitle,
    emptySubtitle,
  } = props;

  return options && options.length > 0 ? (
    options.map((item, index) => {
      let titleList = titleKeys.map(titleKey => {
        return item[titleKey];
      });
      let title = titleList.join(', ');
      let subtitle;
      if (subtitleKeys) {
        let subtitleList = subtitleKeys.map(subtitleKey => {
          return item[subtitleKey];
        });
        subtitle = subtitleList.join('   ');
      }
      return (
        <ListItem
          title={title}
          // This is not an efficient way for subtitle element
          subtitle={
            subtitle
              ? subtitle
              : subtitleElement && subtitleElement.bind(this, item)
          }
          key={index}
          leftElement={leftElement && leftElement.bind(this, item)}
          rightElement={rightElement && rightElement.bind(this, item)}
          rightIcon={
            rightIconName && !item.isSelect ? (
              <Icon
                color={Colors.grey200}
                size={wp(6)}
                name={rightIconName}
                onPress={onRightIconPress && onRightIconPress.bind(this, item)}
              />
            ) : (
              item.isSelect && (
                <Icon color={Colors.grey200} size={wp(6)} name="check" />
              )
            )
          }
          leftAvatar={
            leftAvatarKey && (
              <Avatar source={{uri: item[leftAvatarKey]}} size="medium" />
            )
          }
          onPress={onPress && onPress.bind(this, item)}
          onLongPress={onLongPress && onLongPress.bind(this, item)}
          containerStyle={styles.listContainer}
          titleStyle={styles.title}
          subtitleStyle={styles.subtitle}
          titleProps={{numberOfLines: 1}}
          disabled={disabledKey && item[disabledKey] === disabledValue}
          disabledStyle={{opacity: 0.4}}
        />
      );
    })
  ) : single ? (
    <ListItem
      title={titleText}
      subtitle={subtitleText}
      titleStyle={styles.title}
      subtitleStyle={styles.subtitle}
      onPress={onPress}
      rightIcon={
        rightIconName && (
          <Icon
            color={Colors.grey200}
            size={wp(6)}
            name={rightIconName}
            onPress={onRightIconPress}
          />
        )
      }
      containerStyle={[styles.listContainer]}
    />
  ) : (
    <ListItem
      title={emptyTitle}
      subtitle={emptySubtitle}
      containerStyle={[styles.listContainer]}
      titleStyle={styles.title}
      subtitleStyle={styles.subtitle}
    />
  );
}

// const ListItems = React.memo(ListItemsComponent);
// export ListItems;

export default React.memo(ListItemsComponent);
