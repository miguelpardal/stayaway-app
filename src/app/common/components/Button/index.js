/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { PureComponent as Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button as NativeButton } from 'react-native-elements';
import PropTypes from 'prop-types';

import { ThemeConsumer } from '@app/contexts/Theme';

import { themes as commonThemes, sizes, fontSizes, fontWeights, lineHeights } from '@app/common/theme';

const MAIN = 'main';
const ALTERNATIVE = 'alternative';

const LIGHT = commonThemes.names.light;
const DARK = commonThemes.names.dark;

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: sizes.size10,
    justifyContent: 'center',
    padding: sizes.size14,
    minHeight: lineHeights.normal + (sizes.size8  * 2),
  },
  disabledStyle: {
    opacity: 0.4,
  },
});

const common = {
  buttonStyle: styles.buttonStyle,
  disabledStyle: styles.disabledStyle,
};

const themes = (colors, theme) => {
  if (theme === MAIN) {
    return {
      ...common,
      type: 'solid',
      theme: {
        colors: {
          primary: colors.buttonMainBackgroundColor,
          disabled: colors.buttonMainBackgroundColor,
        },
      },
      titleStyle: { color: colors.buttonMainTextColor, fontSize: fontSizes.normal, lineHeight: lineHeights.normal, fontWeight: fontWeights.bold, paddingTop: 0, paddingBottom: 0},
      disabledTitleStyle: { color: colors.buttonMainTextColor, fontSize: fontSizes.normal, lineHeight: lineHeights.normal, paddingTop: 0, paddingBottom: 0},
      loadingProps: { color: colors.buttonMainTextColor, size: 'small' },
    };
  }

  return {
    ...common,
    type: 'clear',
    titleStyle: { color: colors.buttonAltTextColor, fontSize: fontSizes.small, lineHeight: lineHeights.small, fontWeight: fontWeights.normal, paddingTop: 0, paddingBottom: 0},
    disabledTitleStyle: { color: colors.buttonAltTextColor, fontSize: fontSizes.small, lineHeight: lineHeights.small, paddingTop: 0, paddingBottom: 0},
    loadingProps: { color: colors.buttonAltTextColor, size: 'large' },
  };
};


export default class Button extends Component {
  onPress = () => {
    const { loading, onPress } = this.props;

    if (!loading) {
      onPress();
    }
  }

  render() {
    const { alternative, type, titleStyle, loading, disabled, ...otherProps } = this.props;

    return (
      <ThemeConsumer>
        {({colors}) => {
          const theme = themes(colors, alternative ? ALTERNATIVE : MAIN);

          return (
            <NativeButton
              {...theme}
              useForeground
              titleStyle={{...theme.titleStyle, ...titleStyle}}
              disabled={disabled}
              loading={loading}
              accessibilityRole='button'
              accessibilityState={{
                disabled,
                busy: loading,
              }}
              {...otherProps}
              onPress={this.onPress}
            />
          );
        }}
      </ThemeConsumer>
    );
  }
}

Button.defaultProps = {
  type: '',
  alternative: false,
  loading: false,
  disabled: false,
  titleStyle: {},
  onPress: () => {},
};

Button.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf([LIGHT, DARK, '']),
  alternative: PropTypes.bool,
  onPress: PropTypes.func,
  titleStyle: PropTypes.shape({
    color: PropTypes.string,
  }),
};
