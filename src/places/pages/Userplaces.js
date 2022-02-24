import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList.js";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";


const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
        setLoadedPlaces(responseData.places);

      } catch (err) {}
    };
    fetchPlaces();
  },[sendRequest, userId]);

  const onPlaceDeleteHandler = (deletedPlaceId) => {
    setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedPlaceId));
  };

  // const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId)
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <div className="center"><LoadingSpinner /> </div>}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={onPlaceDeleteHandler} />}
    </React.Fragment>
  );
};

// const DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description: "One of the most Famous sky scrapers in the world!",
//     imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/250px-Empire_State_Building_%28aerial_view%29.jpg",
//     address: "20 W 34th St,New York, NY 10001",
//     location: {
//       lat: 40.7484485,
//       lng: -73.9878584
//     },
//     creator: "u1"
//   },
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description: "One of the most Famous sky scrapers in the world!",
//     imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/250px-Empire_State_Building_%28aerial_view%29.jpg",
//     address: "20 W 34th St,New York, NY 10001",
//     location: {
//       lat: 40.7484485,
//       lng: -73.9878584
//     },
//     creator: "u2"
//   },
// ];
export default UserPlaces;
