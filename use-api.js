import { useEffect, useState, useRef, useCallback } from "react";

const IDLE = "idle";
const PENDING = "pending";
const SUCCESS = "success";
const REJECTED = "rejected";
const FUNCTION = "function";

const useApi = () => {
  const [localApiState, setLocalApiState] = useState({
    isLoading: false,
    error: "",
    startCommunication: false,
    asyncFunction: null,
    apiPayload: null,
    successFunction: null,
    failureFunction: null,
    isSuccess: null,
    status: IDLE,
    data: null,
    wrapper: null,
  });
  const ref = useRef(true);

  const fire = ({
    apiFunc,
    payload,
    onSuccess = () => {},
    onFailure = () => {},
    wrapperFunc,
    ...rest
  }) => {
    if (wrapperFunc !== undefined && typeof wrapperFunc !== FUNCTION)
      throw new Error("wrapperFunc must be a function and return a promise");

    if (Object.keys(rest).length > 0)
      throw new Error(`${JSON.stringify(rest, null, 2)} is not allowed`);

    if (!apiFunc || typeof apiFunc !== FUNCTION)
      throw new Error("apiFunc must be a function");

    if (onSuccess && typeof onSuccess !== FUNCTION)
      throw new Error("onSuccess must be a function");

    if (onFailure && typeof onFailure !== FUNCTION)
      throw new Error("onFailure must be a function");

    setLocalApiState((prevState) => ({
      ...prevState,
      asyncFunction: apiFunc,
      startCommunication: true,
      apiPayload: payload,
      successFunction: onSuccess,
      failureFunction: onFailure,
      isLoading: true,
      status: PENDING,
      wrapper: wrapperFunc,
    }));
  };

  const then = useCallback(
    (res) => {
      if (ref.current) {
        localApiState.successFunction(res || null);
        setLocalApiState((prevState) => ({
          ...prevState,
          isLoading: false,
          error: "",
          isSuccess: true,
          status: SUCCESS,
          data: res || null,
          startCommunication: false,
        }));
      }
    },
    [localApiState]
  );

  const catchError = useCallback(
    (err) => {
      if (ref.current) {
        localApiState.failureFunction(err || null);
        setLocalApiState((prevState) => ({
          ...prevState,
          isLoading: false,
          error: err || null,
          isSuccess: false,
          status: REJECTED,
          data: null,
          startCommunication: false,
        }));
      }
    },
    [localApiState]
  );

  useEffect(() => {
    return () => (ref.current = false);
  }, []);

  useEffect(() => {
    if (localApiState.startCommunication) {
      if (!localApiState.wrapper) {
        localApiState
          .asyncFunction(localApiState.apiPayload)
          .then((res) => then(res))
          .catch((err) => catchError(err));
      } else {
        localApiState
          .wrapper(localApiState.asyncFunction(localApiState.apiPayload))
          .then((res) => then(res))
          .catch((err) => catchError(err));
      }
    }
  }, [localApiState, then, catchError]);

  return [
    {
      isLoading: localApiState.isLoading,
      error: localApiState.error,
      status: localApiState.status,
      isSuccess: localApiState.isSuccess,
      data: localApiState.data,
    },
    fire,
  ];
};

export default useApi;
