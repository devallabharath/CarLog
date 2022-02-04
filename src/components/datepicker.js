import React from "react";
import PropTypes from "prop-types";
import {Text,View,Appearance,Dimensions, Platform,TouchableHighlight,StyleSheet} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "./modal";


const isIphoneX = () => {
  const { height, width } = Dimensions.get("window");

  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 780 ||
      width === 780 ||
      height === 812 ||
      width === 812 ||
      height === 844 ||
      width === 844 ||
      height === 896 ||
      width === 896 ||
      height === 926 ||
      width === 926)
  );
};
export default class DateTimePickerModal extends React.PureComponent {
  static propTypes = {
    cancelButtonTestID: PropTypes.string,
    confirmButtonTestID: PropTypes.string,
    cancelTextIOS: PropTypes.string,
    confirmTextIOS: PropTypes.string,
    customCancelButtonIOS: PropTypes.elementType,
    customConfirmButtonIOS: PropTypes.elementType,
    customHeaderIOS: PropTypes.elementType,
    customPickerIOS: PropTypes.elementType,
    date: PropTypes.instanceOf(Date),
    modalPropsIOS: PropTypes.any,
    modalStyleIOS: PropTypes.any,
    isDarkModeEnabled: PropTypes.bool,
    isVisible: PropTypes.bool,
    pickerContainerStyleIOS: PropTypes.any,
    pickerStyleIOS: PropTypes.any,
    backdropStyleIOS: PropTypes.any,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onHide: PropTypes.func,
    maximumDate: PropTypes.instanceOf(Date),
    minimumDate: PropTypes.instanceOf(Date),
  };

  static defaultProps = {
    cancelTextIOS: "Cancel",
    confirmTextIOS: "Confirm",
    modalPropsIOS: {},
    date: new Date(),
    isDarkModeEnabled: undefined,
    isVisible: false,
    pickerContainerStyleIOS: {},
    pickerStyleIOS: {},
    backdropStyleIOS: {},
  };

  state = {
    currentDate: this.props.date,
    isPickerVisible: this.props.isVisible,
  };

  didPressConfirm = false;

  static getDerivedStateFromProps(props, state) {
    if (props.isVisible && !state.isPickerVisible) {
      return { currentDate: props.date, isPickerVisible: true };
    }
    return null;
  }

  handleCancel = () => {
    this.didPressConfirm = false;
    this.props.onCancel();
  };

  handleConfirm = () => {
    this.didPressConfirm = true;
    this.props.onConfirm(this.state.currentDate);
  };

  handleHide = () => {
    const { onHide } = this.props;
    if (onHide) {
      onHide(this.didPressConfirm, this.state.currentDate);
    }
    this.setState({ isPickerVisible: false });
  };

  handleChange = (event, date) => {
    if (this.props.onChange) {
      this.props.onChange(date);
    }
    this.setState({ currentDate: date });
  };

  render() {
    const {
      cancelButtonTestID,
      confirmButtonTestID,
      cancelTextIOS,
      confirmTextIOS,
      customCancelButtonIOS,
      customConfirmButtonIOS,
      customHeaderIOS,
      customPickerIOS,
      date,
      display,
      isDarkModeEnabled,
      isVisible,
      modalStyleIOS,
      modalPropsIOS,
      pickerContainerStyleIOS,
      pickerStyleIOS,
      onCancel,
      onConfirm,
      onChange,
      onHide,
      backdropStyleIOS,
      ...otherProps
    } = this.props;
    const isAppearanceModuleAvailable = !!(
      Appearance && Appearance.getColorScheme
    );
    const _isDarkModeEnabled =
      isDarkModeEnabled === undefined && isAppearanceModuleAvailable
        ? Appearance.getColorScheme() === "dark"
        : isDarkModeEnabled || false;

    const ConfirmButtonComponent = customConfirmButtonIOS || ConfirmButton;
    const CancelButtonComponent = customCancelButtonIOS || CancelButton;
    const PickerComponent = customPickerIOS || DateTimePicker;
    const HeaderComponent = customHeaderIOS;

    const themedContainerStyle = _isDarkModeEnabled
      ? pickerStyles.containerDark
      : pickerStyles.containerLight;

    return (
      <Modal
        isVisible={isVisible}
        contentStyle={[pickerStyles.modal, modalStyleIOS]}
        onBackdropPress={this.handleCancel}
        onHide={this.handleHide}
        backdropStyle={backdropStyleIOS}
        {...modalPropsIOS}
      >
        <View
          style={[
            pickerStyles.container,
            themedContainerStyle,
            pickerContainerStyleIOS,
          ]}
        >
          {HeaderComponent && <HeaderComponent />}
          {!HeaderComponent && display === "inline" && (
            <View style={pickerStyles.headerFiller} />
          )}
          <View
            style={[
              display === "inline"
                ? pickerStyles.pickerInline
                : pickerStyles.pickerSpinner,
              pickerStyleIOS,
            ]}
          >
            <PickerComponent
              display={display || "spinner"}
              {...otherProps}
              value={this.state.currentDate}
              onChange={this.handleChange}
            />
          </View>
        </View>
        <View style={pickerStyles.bottom}>
          <CancelButtonComponent
            cancelButtonTestID={cancelButtonTestID}
            isDarkModeEnabled={_isDarkModeEnabled}
            onPress={this.handleCancel}
            label={cancelTextIOS}
            />
          <ConfirmButtonComponent
            confirmButtonTestID={confirmButtonTestID}
            isDarkModeEnabled={_isDarkModeEnabled}
            onPress={this.handleConfirm}
            label={confirmTextIOS}
            />
        </View>
      </Modal>
    );
  }
}

const pickerStyles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 10,
  },
  container: {
    borderRadius: 13,
    marginBottom: 8,
    overflow: "hidden",
  },
  pickerSpinner: {
    marginBottom: 8,
  },
  pickerInline: {
    paddingHorizontal: 12,
    paddingTop: 14,
  },
  containerLight: {
    backgroundColor: "white",
  },
  containerDark: {
    backgroundColor: "#1E1E1E",
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

export const ConfirmButton = ({
  isDarkModeEnabled,
  confirmButtonTestID,
  onPress,
  label,
  style = confirmButtonStyles,
}) => {
  const themedButtonStyle = isDarkModeEnabled
    ? confirmButtonStyles.buttonDark
    : confirmButtonStyles.buttonLight;

  const underlayColor = isDarkModeEnabled
    ? "#444444"
    : "#ebebeb";
  return (
    <TouchableHighlight
      testID={confirmButtonTestID}
      style={[themedButtonStyle, style.button]}
      underlayColor={underlayColor}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={style.text}>{label}</Text>
    </TouchableHighlight>
  );
};

export const confirmButtonStyles = StyleSheet.create({
  button: {
    borderRadius: 13,
    height: 57,
    width: '49%',
    marginBottom: isIphoneX() ? 20 : 0,
    justifyContent: "center",
  },
  buttonLight: {
    backgroundColor: "white",
  },
  buttonDark: {
    backgroundColor: "#1E1E1E",
  },
  text: {
    padding: 10,
    textAlign: "center",
    color: "#007ff9",
    fontSize: 20,
    fontWeight: "600",
    backgroundColor: "transparent",
  },
});

export const CancelButton = ({
  cancelButtonTestID,
  isDarkModeEnabled,
  onPress,
  label,
  style = cancelButtonStyles,
}) => {
  const themedButtonStyle = isDarkModeEnabled
    ? cancelButtonStyles.buttonDark
    : cancelButtonStyles.buttonLight;
  const underlayColor = isDarkModeEnabled
    ? "#444444"
    : "#ebebeb";
  return (
    <TouchableHighlight
      testID={cancelButtonTestID}
      style={[style.button, themedButtonStyle]}
      underlayColor={underlayColor}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={style.text}>{label}</Text>
    </TouchableHighlight>
  );
};

export const cancelButtonStyles = StyleSheet.create({
  button: {
    borderRadius: 13,
    height: 57,
    width: '49%',
    marginBottom: isIphoneX() ? 20 : 0,
    justifyContent: "center",
  },
  buttonLight: {
    backgroundColor: 'white',
  },
  buttonDark: {
    backgroundColor: "#1E1E1E",
  },
  text: {
    padding: 10,
    color: '#f55',
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    backgroundColor: "transparent",
  },
});