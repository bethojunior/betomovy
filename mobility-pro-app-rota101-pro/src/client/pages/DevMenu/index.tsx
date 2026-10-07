
import { RealtimeSection } from '~/components/DevMenu/RealtimeSection';
import { Container } from './styles';
import { NotificationsSection } from '~/components/DevMenu/NotificationsSection';
import { LocationSection } from '~/components/DevMenu/LocationSection';
// import { FlashlightSection } from '~/components/DevMenu/FlashlightSection';


export const DevMenu = () => (
  <Container contentContainerStyle={{ paddingTop: 8, paddingBottom: 40 }}>
    <RealtimeSection />
    <NotificationsSection />
    <LocationSection />
    {/* <FlashlightSection /> */}
  </Container>
);
