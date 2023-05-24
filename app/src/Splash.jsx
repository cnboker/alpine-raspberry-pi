import React, { useEffect } from "react";
import { getConfigInfo } from "./QRConfigrator/actions";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

export default () => {
  const message = "System is intailizing,please wait";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const qrReducer = useSelector(state => state.qrReducer);

  useEffect(() => {
    console.log('qrReducer.configInfo', qrReducer.configInfo)
    //初始化返回，等待getConfigInfo结果
    if (qrReducer.configInfo === undefined) return;
    //getConfiginfo结果为null, 说明需要先扫码配置
    if (!qrReducer.configInfo.deviceId) {
      navigate("/qrconfig");
    } else {
      navigate("/play");
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
