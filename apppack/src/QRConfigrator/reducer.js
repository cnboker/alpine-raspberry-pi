import {
  RECEIVE_CONFIG,
  RECEIVE_INSTANCE,
  RECEIVE_QR,
  RECEIVE_TOKEN,
} from "./actions";
import merge from "lodash/merge";

var defaultState = {
  QR: {},
  token: {},
  configInfo: undefined,
  instance: {},
};

export const qrReducer = (state = defaultState, action) => {
 
  let newState = merge({}, state);
  switch (action.type) {
    case RECEIVE_QR:
      newState.QR = action.payload;
      return newState;
    case RECEIVE_TOKEN:
      newState.token = action.payload;
      return newState;
    case RECEIVE_CONFIG:
      console.log("RECEIVE_CONFIG", newState)
      newState.configInfo = action.payload;
      return newState;
    case RECEIVE_INSTANCE:
      newState.instance = action.payload;
      return newState;
    default:
      return state;
  }
};
