import React from "react";

import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem.js";
import Button from "../../shared/components/FormElements/Button";
import "./PlaceList.css";

const PlaceList = props => {
  if(props.items.length === 0){
    return (
      <div className="place-list center">
        <Card>
          <h2>No places Found, may be create one? </h2>
          <Button to="/places/new">Share Please. </Button>
        </Card>
      </div>
    );
  }

  return <ul className="place-list">
    {props.items.map(place =>
      (<PlaceItem key={place.id} id={place.id}
      image={place.image} title={place.title} description={place.description}
      address={place.address} creatorid={place.creator}
      coordinates={place.location} onDelete={props.onDeletePlace}/>))}
  </ul>
};

export default PlaceList;
