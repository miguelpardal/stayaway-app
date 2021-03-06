/**
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

import React, { useMemo } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Moment from 'moment';
import PropTypes from 'prop-types';

import { useTheme } from '@app/contexts/Theme';

import { INFECTION_STATUS } from '@app/services/tracing';

import TopComponent from '@app/common/components/TopComponent';
import Layout from '@app/common/components/Layout';
import Icon from '@app/common/components/Icon';
import ButtonWrapper from '@app/common/components/ButtonWrapper';
import Text from '@app/common/components/FormattedText';

import { getThemedImage } from '@app/common/assets/images';

import { sizes, iconSizes } from '@app/common/theme';

import i18n from '@app/services/i18n';

const styles = (colors, insets) => StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: sizes.size8,
    left: -sizes.size8,
    padding: sizes.size8,
    alignSelf: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  layoutContainer: {
    flex: 1,
    backgroundColor: colors.transparent,
    zIndex: 10,
  },
  itemsContainer: {
    marginBottom: sizes.size48,
  },
  title: {
    paddingVertical: sizes.size16,
    marginBottom: sizes.size48,
  },
  description: {
    marginBottom: sizes.size48,
  },
  stat: {
    flexDirection: 'row',
    marginBottom: sizes.size8,
  },
  legendContainer: {
    marginTop: sizes.size16,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imagesContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 0,
  },
  sponsors: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: sizes.size24 + insets.bottom,
    left: sizes.size24,
    zIndex: 0,
  },
  republicaPortuguesaImage: {
    marginRight: sizes.size24,
  },
  dgsImage: {
  },
  splashImage: {
    alignSelf: 'flex-end',
  },
});

export default function Debug (props) {
  const {
    signUp,
    status,
    onClose,
  } = props;

  const insets = useSafeAreaInsets();
  const { name, colors } = useTheme();
  const memoizedStyle = useMemo(() => styles(colors, insets), [name, insets]);

  let infectionStatusName = i18n.translate('screens.debug.infection_status.healthy');

  if (status.infectionStatus === INFECTION_STATUS.EXPOSED ) {
    infectionStatusName = i18n.translate('screens.debug.infection_status.exposed');
  }

  if (status.infectionStatus === INFECTION_STATUS.INFECTED ) {
    infectionStatusName = i18n.translate('screens.debug.infection_status.infected');
  }

  const exposedDays =
    status?.exposureDays
    .map(day => Moment(day.exposedDate).format('L'))
    .join(',');

  const errors = status?.errors.join(',');

  return (
    <TopComponent>
      <Layout style={memoizedStyle.layoutContainer}>
        <View style={memoizedStyle.header}>
          <ButtonWrapper
            onPress={onClose}
            style={memoizedStyle.closeButton}
            accessibilityLabel={i18n.translate('screens.debug.actions.back.accessibility.label')}
            accessibilityHint={i18n.translate('screens.debug.actions.back.accessibility.hint')}
          >
            <Icon name='arrow' width={iconSizes.size24} height={iconSizes.size24} />
          </ButtonWrapper>
          <Text size='xlarge' weight='bold' style={memoizedStyle.title}>{i18n.translate('screens.debug.title')}</Text>
        </View>
        <View style={memoizedStyle.content}>
          <View style={memoizedStyle.stat}>
            <Text weight='bold'>{`${i18n.translate('screens.debug.sign_up')}: `}</Text>
            <Text>{Moment(signUp).format('L')}</Text>
          </View>
          <View style={memoizedStyle.stat}>
            <Text weight='bold'>{`${i18n.translate('screens.debug.last_sync')}: `}</Text>
            <Text>{Moment(status.lastSyncDate).format('L')}</Text>
          </View>
          <View style={memoizedStyle.stat}>
            <Text weight='bold'>{`${i18n.translate('screens.debug.infection_status.label')}: `}</Text>
            <Text>{infectionStatusName}</Text>
          </View>
          <View style={memoizedStyle.stat}>
            <Text weight='bold'>{`${i18n.translate('screens.debug.exposure_days')}: `}</Text>
            <Text>{exposedDays}</Text>
          </View>
          <View style={memoizedStyle.stat}>
            <Text weight='bold'>{`${i18n.translate('screens.debug.errors')}: `}</Text>
            <Text>{errors}</Text>
          </View>
        </View>
      </Layout>
      <View style={memoizedStyle.imagesContainer}>
        <View style={memoizedStyle.sponsors}>
          <Image source={getThemedImage('republica_portuguesa', name)} style={memoizedStyle.republicaPortuguesaImage} />
          <Image source={getThemedImage('logo_dgs', name)} style={memoizedStyle.dgsImage} />
        </View>
        <Image source={getThemedImage('splash', name)} style={memoizedStyle.splashImage} />
      </View>
    </TopComponent>
  );
}

Debug.defaultProps = {
  signUp: Moment(),
  onClose: () => {},
};

Debug.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  signUp: PropTypes.object,
  status: PropTypes.shape({
    lastSyncDate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    infectionStatus: PropTypes.number,
    exposureDays: PropTypes.array,
    errors: PropTypes.array,
  }).isRequired,
  onClose: PropTypes.func,
};
