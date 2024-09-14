import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../Assets/imgs/logo.svg";
import "../Assets/css/Camera_list.css";

const Camera_list = () => {
  const [Data, setData] = useState(null);

  const token = "4ApVMIn5sTxeW7GQ5VWeWiy";
  const FetchData = async () => {
    try {
      const response = await axios.get(
        "https://api-app-staging.wobot.ai/app/v1/fetch/cameras",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data);

      console.log(Data && Data);
    } catch (err) {
      console.log("fetching error", err);
    }
  };

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <div className="wrapper mt-5">
      <div className="mx-4">
        <div className="logo d-flex justify-content-center ">
          <img src={logo} className="logo" alt="" />
        </div>
        <div className="d-flex justify-content-between">
          <h3 className="text-dark">Cameras</h3>
          <input type="text" />
        </div>
        <h6>Manage Your Camera here</h6>
      </div>

      <div className="row  mx-4 bg-white  table-list">
        <div className="col-2">
          <select class="form-select Location">
            <option selected>Loaction</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>
        <div className="col-2">
          <select class="form-select Location">
            <option selected>Status</option>
            <option value="1">Active</option>
            <option value="2">Inactive</option>
          </select>
        </div>
      </div>

      <div className="row  mx-4 bg-white  table-list">
        <div className="col">
          <input type="checkbox" className="me-3" />
          NAME
        </div>
        <div className="col text-center">HEALTH</div>
        <div className="col">LOCATION</div>
        <div className="col">RECORDER</div>
        <div className="col">TASKS</div>
        <div className="col">STATUS</div>
        <div className="col">ACTIONS</div>
        <div className="col">DELETE</div>
      </div>
      {Data &&
        Data.slice(0, 10).map((cur, i) => (
          <div className="row  mx-4 bg-white  table-list" key={cur.id}>
            <div className="col">
              <input type="checkbox" className="me-3" />
              {cur.name}
            </div>
            <div className="col text-center">
              {cur.health.cloud} {cur.health.device}
            </div>
            <div className="col">{cur.location}</div>
            <div className="col">{cur.recorder}</div>
            <div className="col">{cur.tasks}Tasks</div>
            <div className="col">{cur.status}</div>
            <div className="col">actions</div>
            <div className="col">Delete</div>
          </div>
        ))}
    </div>
  );
};

export default Camera_list;
