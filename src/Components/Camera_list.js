import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../Assets/imgs/logo.svg";
import "../Assets/css/Camera_list.css";
import { IoIosSearch } from "react-icons/io";
import { RiCloudLine } from "react-icons/ri";
import { BsHddStack } from "react-icons/bs";
import { AiOutlineStop } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { BsWifi } from "react-icons/bs";

const Camera_list = () => {
  // State for camera data, location, filters, search, and pagination
  const [Data, setData] = useState([]);
  const [Location, setLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [SelectedStatus, setSelectedStatus] = useState("");
  const [searchData, setSearchData] = useState("");
  const [page, setPage] = useState(1); // Page for pagination
  const [pageSize, setPageSize] = useState(10); // Items per page

  // Authorization token for API request
  const token = "4ApVMIn5sTxeW7GQ5VWeWiy";

  // Function to fetch camera data from the API
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
      const cameras = response.data.data;
      setData(cameras);

      // Extract unique locations from the fetched camera data
      const locationValues = [...new Set(cameras.map((cur) => cur?.location))];
      setLocation(locationValues);
    } catch (err) {
      console.log("fetching error", err);
    }
  };

  useEffect(() => {
    FetchData();
  }, [Data]);

  // Filter the camera data based on selected location, status, and search term
  const FilteredData = Data.filter((cur) => {
    const LocationMatch = selectedLocation
      ? cur.location === selectedLocation
      : true;

    const StatusMatch = SelectedStatus ? cur.status === SelectedStatus : true;

    const MatchSearch = searchData
      ? cur.name.toLowerCase().includes(searchData.toLocaleLowerCase()) ||
        cur.location
          .toLocaleLowerCase()
          .includes(searchData.toLocaleLowerCase()) ||
        cur.status.toLocaleLowerCase().includes(searchData.toLocaleLowerCase())
      : true;

    return LocationMatch && StatusMatch && MatchSearch;
  });

  // Calculate total items and total pages for pagination
  const totalItems = FilteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Handlers functions for pagination buttons
  const handlePrevious = () => setPage(page > 1 ? page - 1 : 1);
  const handleNext = () => setPage(page < totalPages ? page + 1 : totalPages);
  const handleFirst = () => setPage(1);
  const handleLast = () => setPage(totalPages);

  // Calculate the range of items displayed on the current page
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="wrapper mt-5">
      <div className="mx-4">
        {/* Logo */}
        <div className="logo d-flex justify-content-center ">
          <img src={logo} className="logo" alt="" />
        </div>
        <div className="d-flex justify-content-between">
          <h3 className="text-dark">Cameras</h3>
          {/* search bar */}
          <div className="search rounded-3 mb-4">
            <input
              type="text"
              className="ms-3 search-field"
              placeholder="Search"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
            />
            <IoIosSearch style={{ color: "grey" }} size={20} className="ms-2" />
          </div>
        </div>
        <h6>Manage Your Camera here</h6>
      </div>

      {/* Dropdown filters for location and status */}
      <div className="row mx-4 bg-white table-list">
        <div className="col-2">
          <select
            className="form-select Location"
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">
              <CiLocationOn />
              Location
            </option>
            {Location.map((cur, i) => (
              <option value={cur} key={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>
        <div className="col-2">
          <select
            className="form-select Location"
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">
              <BsWifi />
              Status
            </option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table headers */}
      <div className="row mx-4 bg-white table-list">
        <div className="col">
          <input type="checkbox" className="me-3" />
          NAME
        </div>
        <div className="col text-center ms-3">HEALTH</div>
        <div className="col ms-3 text-center">LOCATION</div>
        <div className="col ms-3 text-center">RECORDER</div>
        <div className="col ms-3 text-center">TASKS</div>
        <div className="col text-center">STATUS</div>
        <div className="col-1">ACTIONS</div>
      </div>

      {/* Display filtered data with pagination */}
      {FilteredData.slice(startItem - 1, endItem).map((cur) => (
        <div className="row mx-4 bg-white table-list" key={cur.id}>
          <div className="col">
            <input type="checkbox" className="me-3" />
            {cur.name}
          </div>
          <div className="col justify-content-center d-flex gap-2 ms-3">
            <RiCloudLine className="mt-1" />
            {cur.health.cloud}
            <BsHddStack className="mt-1" />
            {cur.health.device}
          </div>
          <div className="col ms-3 text-center">{cur.location}</div>
          <div className="col ms-3 text-center">{cur.recorder}</div>
          <div className="col ms-3 text-center">{cur.tasks} Tasks</div>
          <div className="col text-center">
            <span className="px-2">{cur.status}</span>
          </div>
          <div className="col-1">
            <AiOutlineStop className="ms-4" />
          </div>
        </div>
      ))}

      {/* Pagination controls */}
      <div className="row mx-4 bg-white table-list">
        {totalItems > 0 && (
          <div className="pagination d-flex gap-3 d-flex justify-content-end align-items-center">
            <div>
              {/* Dropdown to change the number of items per page */}
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="cursor"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div>
              {startItem}-{endItem} of {totalItems}
            </div>
            <div className="d-flex gap-3 cursor">
              <span className="icon-style" onClick={handleFirst}>
                &laquo;
              </span>
              <span className="icon-style" onClick={handlePrevious}>
                &lsaquo;
              </span>
              <span className="icon-style" onClick={handleNext}>
                &rsaquo;
              </span>
              <span className="icon-style" onClick={handleLast}>
                &raquo;
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Camera_list;
