import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './NewPlace.css';

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`,
          "GET",
          null,
          {}
          );
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true
            },
            description: {
              value: responseData.place.description,
              isValid: true
            }
          },
          true
        );

      } catch (err) {

      }
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

// The issue could be with the response you are receiving from back-end.
//If it was working fine on the server then the problem could be with the respon
// se headers. Check the Access-Control-Allow-Origin in the response headers.
// Usually react's fetch API will throw fail to fetch even after receiving response
// when the response headers' Access-Control-Allow-Origin and the origin of request
//  won't match

  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      await history.push('/' + auth.userId + '/places');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;


// import React, { useEffect, useState, useContext } from 'react';
// import { useParams, useHistory } from 'react-router-dom';
//
// import Input from '../../shared/components/FormElements/Input';
// import Button from '../../shared/components/FormElements/Button';
// import Card from '../../shared/components/UIElements/Card';
// import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
// import ErrorModal from '../../shared/components/UIElements/ErrorModal';
// import {
//   VALIDATOR_REQUIRE,
//   VALIDATOR_MINLENGTH
// } from '../../shared/util/validators';
// import { useForm } from '../../shared/hooks/form-hook';
// import { useHttpClient } from '../../shared/hooks/http-hook';
// import { AuthContext } from '../../shared/context/auth-context';
// import './NewPlace.css';
//
// const UpdatePlace = () => {
//   const auth = useContext(AuthContext);
//   const { isLoading, error, sendRequest, clearError } = useHttpClient();
//   const [loadedPlace, setLoadedPlace] = useState();
//   const placeId = useParams().placeId;
//   const history = useHistory();
//
//   const [formState, inputHandler, setFormData] = useForm(
//     {
//       title: {
//         value: '',
//         isValid: true
//       },
//       description: {
//         value: '',
//         isValid: true
//       }
//     },
//     false
//   );
//
//   useEffect(() => {
//     const fetchPlace = async () => {
//       try {
//         const responseData = await sendRequest(
//           `http://localhost:5000/api/places/${placeId}`
//         );
//         setLoadedPlace(responseData.place);
//         setFormData(
//           {
//             title: {
//               value: responseData.place.title,
//               isValid: true
//             },
//             description: {
//               value: responseData.place.description,
//               isValid: true
//             }
//           },
//           true
//         );
//
//       } catch (err) {
//         console.log(err);
//
//       }
//     };
//     fetchPlace();
//   }, [sendRequest, placeId, setFormData]);
//
//   const placeUpdateSubmitHandler = async event => {
//     event.preventDefault();
//     try {
//       await sendRequest(
//         `http://localhost:5000/api/places/${placeId}`,
//         "PATCH",
//         JSON.stringify({
//           title: formState.inputs.title.value,
//           description: formState.inputs.description.value
//         }),
//         {
//           'Content-Type': 'application/json'
//         }
//       );
//       history.push('/' + auth.userId + '/places');
//     } catch (err) {
//       console.log(err);
//
//     }
//   };
//
//   if (isLoading) {
//     return (
//       <div className="center">
//         <LoadingSpinner />
//       </div>
//     );
//   }
//
//   if (!loadedPlace && error) {
//     return (
//       <div className="center">
//         <Card>
//           <h2>Could not find place!</h2>
//         </Card>
//       </div>
//     );
//   }
//
//   return (
//     <React.Fragment>
//       <ErrorModal error={error} onClear={clearError} />
//       {!isLoading && loadedPlace && (
//         <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
//           <Input
//             id="title"
//             element="input"
//             type="text"
//             label="Title"
//             validators={[VALIDATOR_REQUIRE()]}
//             errorText="Please enter a valid title."
//             onInput={inputHandler}
//             initialValue={loadedPlace.title}
//             initialValid={true}
//           />
//           <Input
//             id="description"
//             element="textarea"
//             label="Description"
//             validators={[VALIDATOR_MINLENGTH(5)]}
//             errorText="Please enter a valid description (min. 5 characters)."
//             onInput={inputHandler}
//             initialValue={loadedPlace.description}
//             initialValid={true}
//           />
//           <Button type="submit" disabled={!formState.isValid}>
//             UPDATE PLACE
//           </Button>
//         </form>
//       )}
//     </React.Fragment>
//   );
// };
//
// export default UpdatePlace;
