import React, { useEffect } from "react";
import { getConfigInfo } from "./QRConfigrator/actions";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

export default () => {
  const message = "System is intailizing,please wait";
  const navigate  = useNavigate();
  const dispatch = useDispatch();
  const qrReducer = useSelector((c) => c.qrReducer);

  useEffect(() => {
    const { token } = qrReducer.configInfo;
    if (token) {
      navigate("/play");
    } else {
      navigate("/qrconfig");
    }
  }, [qrReducer]);

  useEffect(() => {
    dispatch(getConfigInfo());
  }, []);

  return (
    <div className="centercontainer">
      <div className="centercontent">
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      </div>
    </div>
  );
};
