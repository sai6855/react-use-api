# use-api-react

A simple react hook which returns the state of your api call

## How to use

```
import { useApi } from "use-api-react";
import React from "react";

const Example = () => {
  const [{ isLoading, isSuccess, data, error, status }, callToApi] = useApi();

  const fetchUsersData = () => {
    try {
      const data = fetch("some api");

      return data;

      ***Return the data if you want that data to be returned by useApi hook***
    } catch (error) {

     ***Throw the error if you are interacting with your api in trycatch block***

     throw error;
    }
  };

  if(isLoading) return <h1>Loading</h1>
  if(error) return <h1>error occured</h1>

  return (
    <button
      onClick={() =>
        callToApi({ payload: apiPayload, apiFunc: fetchUsersData })
      }
    >
      Hey, make a call to api
    </button>
  );
};

export default Example;


```

## How to use with redux or other state management libraries which has wrapper function around your api calls

Function which useApi returns accepts a parameter wrapperFunc, if you are using redux and needs to dispatch your api thunk function, you can add dispatch function to wrapperFunc key.

**If apiFunc doesn't return a promise, very likely your app will break. So apiFunc should always be a function which returns a promise

```

const dispatch = useDispatch()
 const [{ isLoading, isSuccess, data, error, status }, callToApi] = useApi();

  <button
      onClick={() =>
        callToApi({ payload: apiPayload, apiFunc: fetchUsersData, wrapperFunc: dispatch })
      }
    >
      Hey, make a call to api
    </button>

```

## props

| Accepted props | Description                                                            |
| -------------- | ---------------------------------------------------------------------- |
| payload        | payload that need to be passed to apiFunc                              |
| apiFunc        | function that interacts with api                                       |
| onSuccess      | call back function which will be invoked after api call is successfull |
| onfailure      | call back function which will be invoked after api call fails          |
| wrapperFunc    | wrapper function which will be wrapped around your api call            |

| Returned props | Description                              |
| -------------- | ---------------------------------------- |
| isLoading      | Can return true, false                    |
| isSuccess      | Can return null, true, false               |
| status         | Can return "idle", "pending", "success", "rejected" |
| data           | data returned by api, will return null if api does not return anything |
| error          | error thrown by api, will return null if api does not return anything |
