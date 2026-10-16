import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Header,
  HeaderTitle,
  Loading,
  LoadingContainer,
  OptionsList,
} from '../TravelOptions/styles';
import styles from './styles';
import { TripTypeOptionsPanelProps } from './types';

const TripTypeOptionsPanel = ({
  title,
  isLoading,
  options,
  renderOptionItem,
  onPressInfo,
}: TripTypeOptionsPanelProps) => {
  return (
    <>
      <Header>
        <View style={styles.headerContent}>
          <HeaderTitle>{title}</HeaderTitle>
          <TouchableOpacity style={styles.infoButton} onPress={onPressInfo}>
            <MaterialCommunityIcons
              style={styles.infoIcon}
              name="information-variant"
              size={15}
            />
          </TouchableOpacity>
        </View>
      </Header>

      {isLoading ? (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      ) : (
        <OptionsList
          data={options}
          renderItem={renderOptionItem}
          keyExtractor={(item: { idPrice?: number | string }, index: number) =>
            item?.idPrice ? `${item.idPrice}` : `undefined-${index}`
          }
        />
      )}
    </>
  );
};

export default TripTypeOptionsPanel;
