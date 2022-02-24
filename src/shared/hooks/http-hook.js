import { useState, useCallback, useRef, useEffect } from 'react';


export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response =  await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });

        const responseData = await response.json();
        console.log(responseData.places);
        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        console.log(err);
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};

// import { useState, useCallback, useRef, useEffect } from "react";
//
// export const useHttpClient = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState();
//
//   const activeHttpRequest = useRef([]);
//
//   const sendRequest = useCallback( (url, method="GET", body=null, headers={}) => {
//       setIsLoading(true);
//       const httpAbortCntrll = new AbortController();
//       activeHttpRequest.current.push(httpAbortCntrll);
//       try {
//         const response =  fetch(url, {
//           method,
//           body,
//           headers,
//           signal: httpAbortCntrll.signal
//         });
//
//         const responseData =  response.json();
//
//         activeHttpRequest.current = activeHttpRequest.current.filter(reqCtrl => reqCtrl !== httpAbortCntrll);
//
//         if (!response.ok) {
//           throw new Error(responseData.message);
//         }
//
//         setIsLoading(false);
//         return responseData;
//       } catch(err){
//         setError(err.message);
//         setIsLoading(false);
//         throw err;
//       }
//     }, []);
//     const clearError = () => {
//       setError(null);
//     }
//
//
//     useEffect(() => {
//       return () => {
//         activeHttpRequest.current.forEach(abortCntrl => abortCntrl.abort());
//
//       };
//     }, []);
//
//   return { isLoading, error, sendRequest, clearError};
//
//
// };
