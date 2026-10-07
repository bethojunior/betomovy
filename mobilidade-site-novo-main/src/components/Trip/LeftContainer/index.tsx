import { useEffect } from "react";
import { useTripStore } from "../../../store/tripStore";
import { DriverData } from "../../DriverData";
import { DriverTypeList } from "../DriverTypeList";
import { Search } from "../Search";
import { SearchTripLoading } from "../SearchTripLoading";
import { useStorage } from "../../../utils/Storage";
import { totem } from "../../../utils/Totem";
import { useSliceAnimationStore } from "../../../store/sliceAnimationStore";

export const LeftContainer = () => {
  const { trip, position, setTrip, setPosition } = useTripStore();
  const { sliceValue } = useSliceAnimationStore();
  const { getItem } = useStorage();

  useEffect(() => {
    const trip = getItem("trip");
    const tripAccepted = getItem("tripAccepted");
    if (trip && trip.length > 0) {
      setTrip(JSON.parse(trip));
    }
    if (tripAccepted && tripAccepted.length > 0) {
      setPosition([0, 0]);
    }
  }, []);

  return (
    <>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: !sliceValue ? "" : "none",
          transition: "1s ease all",
        }}
      >
        {Object.keys(trip).length > 0 ? (
          position.length === 0 ? (
            <SearchTripLoading />
          ) : !totem ? (
            <DriverData />
          ) : (
            <SearchTripLoading />
          )
        ) : (
          <Search />
        )}
      </div>
      <div
        style={{
          display: sliceValue ? "" : "none",
          transition: "1s ease all",
          width: "100%",
        }}
      >
        <DriverTypeList />
      </div>
      {/* <div className="search-container">
        {Object.keys(trip).length > 0 ? (
          position.length === 0 ? (
            <SearchTripLoading />
          ) : !totem ? (
            <DriverData />
          ) : (
            <SearchTripLoading />
          )
        ) : (
          <Search />
        )}
      </div>
      <DriverTypeList /> */}
    </>
  );
};
