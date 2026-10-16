import { FC, Fragment, useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { AddressPoint, AddressTimelineProps } from './types';
import {
  Card,
  DotDestination,
  DotOrigin,
  DotWaypoint,
  MarkerColumn,
  PointBlock,
  PointLabel,
  PointPrimaryText,
  PointRow,
  PointSecondaryText,
  StopsToggle,
  StopsToggleText,
  TimelineLine,
} from './styles';

const renderPointText = (point: AddressPoint) => (
  <>
    <PointLabel>{point.label}</PointLabel>
    <PointPrimaryText>{point.primaryText}</PointPrimaryText>
    {point.secondaryText && <PointSecondaryText>{point.secondaryText}</PointSecondaryText>}
  </>
);

export const AddressTimeline: FC<AddressTimelineProps> = ({
  origin,
  waypoints = [],
  destination,
  stopsToggleLabel,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const hasWaypoints = waypoints.length > 0;

  return (
    <Card>
      <TimelineLine />

      <PointRow>
        <MarkerColumn>
          <DotOrigin />
        </MarkerColumn>
        <PointBlock>{renderPointText(origin)}</PointBlock>
      </PointRow>

      {hasWaypoints && (
        <PointRow>
          <MarkerColumn />
          <StopsToggle activeOpacity={0.7} onPress={() => setExpanded(!expanded)}>
            <StopsToggleText>{stopsToggleLabel}</StopsToggleText>
            <FontAwesome5
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={RFValue(10)}
              color={theme.colors.primary}
            />
          </StopsToggle>
        </PointRow>
      )}

      {hasWaypoints && expanded && waypoints.map((waypoint, index) => (
        <Fragment key={index}>
          <PointRow>
            <MarkerColumn>
              <DotWaypoint />
            </MarkerColumn>
            <PointBlock>{renderPointText(waypoint)}</PointBlock>
          </PointRow>
        </Fragment>
      ))}

      <PointRow isLast>
        <MarkerColumn>
          <DotDestination />
        </MarkerColumn>
        <PointBlock>{renderPointText(destination)}</PointBlock>
      </PointRow>
    </Card>
  );
};
