# react-use-api

A simple react hook which return the state of your api call

## How to use

```
import { useApi } from "react-use-api";
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
