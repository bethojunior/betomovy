import AntDesign from '@expo/vector-icons/AntDesign';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { translate } from '~/client/locales';
import {
  Dot,
  Info,
  JourneyCard,
  Row,
  TimelineLine,
  TitleResume,
  WaypointDot,
  WaypointBadge,
  WaypointBadgeText,
  WaypointChevron,
  WaypointItem,
  WaypointItemAddress,
  WaypointLabel,
  WaypointsDropdown,
  WaypointsScroll,
  WaypointToggleRow,
} from './styles';
import { Pressable, View, Text } from 'react-native';
import { TripWayPointsProps } from '../../context/Trip/types';

interface JourneyResumeCardProps {
  tripAccepted: {
    origin?: { address?: string };
    destination?: { name?: string };
    tripWayPoints?: TripWayPointsProps[];
  };
}

export const JourneyResumeCard = ({ tripAccepted }: JourneyResumeCardProps) => {
  const [originExpanded, setOriginExpanded] = useState(false);
  const [destinationExpanded, setDestinationExpanded] = useState(false);
  const [waypointsOpen, setWaypointsOpen] = useState(false);

  const waypoints = Array.isArray(tripAccepted?.tripWayPoints)
    ? tripAccepted.tripWayPoints
    : [];
  const hasWaypoints = waypoints.length > 0;
  const waypointLabel = translate('finishTrip.text_waypoint');

  return (
    <JourneyCard>
      <Row>
        <View style={{ alignItems: 'center' }}>
          <Dot color="#3b82f6" />
          <TimelineLine />
        </View>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <TitleResume>{translate('finishTrip.text_origin')}</TitleResume>
          <Pressable onPress={() => setOriginExpanded(v => !v)}>
            <Info numberOfLines={originExpanded ? undefined : 1}>
              {tripAccepted?.origin?.address}
            </Info>
            <Text style={{ fontSize: 12, color: '#3b82f6', marginTop: 2 }}>
              {originExpanded ? 'Ver menos' : 'Ver endereço completo'}
            </Text>
          </Pressable>
        </View>
      </Row>

      {hasWaypoints && (
        <Row>
          <View style={{ alignItems: 'center', width: 16 }}>
            <WaypointDot />
            <TimelineLine />
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <WaypointToggleRow
              onPress={() => setWaypointsOpen(v => !v)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={
                waypointsOpen
                  ? 'Recolher paradas do trajeto'
                  : 'Expandir paradas do trajeto'
              }
            >
              <WaypointBadge>
                <AntDesign name="plus" size={10} color="#475569" />
                <WaypointBadgeText>
                  +{waypoints.length} parada{waypoints.length > 1 ? 's' : ''} no trajeto
                </WaypointBadgeText>
              </WaypointBadge>
              <WaypointChevron open={waypointsOpen}>
                <Ionicons
                  name={waypointsOpen ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color="#64748b"
                />
              </WaypointChevron>
            </WaypointToggleRow>

            {waypointsOpen && (
              <WaypointsDropdown>
                <WaypointsScroll
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                >
                  {waypoints.map((wp, i) => (
                    <WaypointItem key={wp.id ?? i} isLast={i === waypoints.length - 1}>
                      <View style={{ flex: 1 }}>
                        <WaypointLabel>
                          {waypointLabel} {i + 1}
                        </WaypointLabel>
                        <WaypointItemAddress numberOfLines={2}>
                          {wp.address || translate('finishTrip.address_not_available')}
                        </WaypointItemAddress>
                      </View>
                    </WaypointItem>
                  ))}
                </WaypointsScroll>
              </WaypointsDropdown>
            )}
          </View>
        </Row>
      )}

      <Row>
        <Dot color="#ef4444" />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <TitleResume>{translate('finishTrip.text_destination')}</TitleResume>
          <Pressable onPress={() => setDestinationExpanded(v => !v)}>
            <Info numberOfLines={destinationExpanded ? undefined : 1}>
              {tripAccepted?.destination?.name}
            </Info>
            <Text style={{ fontSize: 12, color: '#3b82f6', marginTop: 2 }}>
              {destinationExpanded ? 'Ver menos' : 'Ver endereço completo'}
            </Text>
          </Pressable>
        </View>
      </Row>
    </JourneyCard>
  );
};
