import "./qrCodeList.css";
import { DataGrid } from '@mui/x-data-grid';
import { useState, useContext, useEffect, useCallback } from "react";
import { QrCodeContext } from '../../context/qrCodeContext/QrCodeContext';
import { getQrcodes } from "../../context/qrCodeContext/apiCalls";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

export default function QrCodeList() {
  const { qrcodes, dispatch } = useContext(QrCodeContext);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);

  const fetchQrCodes = useCallback(async () => {
    setLoading(true);
    await getQrcodes(dispatch);
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    fetchQrCodes();  
    const ws = new WebSocket('ws://localhost:8800');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      const updatedQrcodes = JSON.parse(event.data);
      dispatch({ type: "GET_QRCODES_SUCCESS", payload: updatedQrcodes });
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      ws.close();
    };
  }, [dispatch, fetchQrCodes]);

  const handleTabChange = (event, newValue) => {
    setRoleFilter(newValue);
  };

  const getColumns = () => {
    const baseColumns = [
      { field: "id", headerName: "ID", width: 300 },
      {
        field: "studentName",
        headerName: "Student User Name",
        width: 200,
        renderCell: (params) => (
          <div className="userListUser">
            {params.row.studentName}
          </div>
        )
      },
      { field: "canteenName", headerName: "Canteen User Name", width: 200 },
      { field: "canteenType", headerName: "Canteen Type", width: 230 },
      {
        field: "count",
        headerName: "Coupons Used",
        width: 150
      },
      {
        field: "scannedAt",
        headerName: "Date and Time",
        width: 200,
        renderCell: (params) => {
          const date = new Date(params.row.scannedAt);
          const formattedDate = date.toLocaleDateString('en-GB');
          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true // 12-hour format with AM/PM
          });
          return `${formattedDate}, ${formattedTime}`;
        }
      },
    ];

    return baseColumns;
  };

  const columns = getColumns();

  const filteredQrCodes = qrcodes.filter(qrcode => {
    const matchesRole = roleFilter === 'all'
      ? true
      : roleFilter === 'canteena'
        ? qrcode.canteenType === 'canteena'
        : qrcode.canteenType === roleFilter;

    const matchesSearch =
      (String(qrcode.studentName).toLowerCase().includes(searchQuery.toLowerCase())) ||
      (qrcode.id.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (qrcode.canteenName.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesDateRange = selectedDateRange[0] && selectedDateRange[1]
      ? new Date(qrcode.scannedAt) >= new Date(selectedDateRange[0]) &&
        new Date(qrcode.scannedAt) <= new Date(selectedDateRange[1])
      : true;

    return matchesRole && matchesSearch && matchesDateRange;
  });

  const totalCouponsUsed = filteredQrCodes.reduce((sum, qrcode) => sum + (qrcode.count || 0), 0);

  return (
    <div className="userList">
      <Box className="header">
        <Tabs value={roleFilter} onChange={handleTabChange} aria-label="user role filter">
          <Tab label="All" value="all" />
          <Tab label="Canteen A (Kalderama)" value="canteena" />
          <Tab label="Canteen B (Hilton)" value="canteenb" />
        </Tabs>
        
        <Box className="container">
        <Box className="totalCouponsUsed">
          <strong>Total Coupons Used: {totalCouponsUsed}</strong>
        </Box>
        <Box className="dateRangePicker">
          <DateRangePicker
            value={selectedDateRange}
            onChange={(range) => setSelectedDateRange(range)}
            placeholder="Select the Date Range"
            placement="autoVertical"
            format="yyyy-MM-dd"
            onClean={() => setSelectedDateRange([null, null])} // Reset the date range
          />
        </Box>
        <Box className="searchBox">
          <TextField
            variant="outlined"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchInput"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

        </Box>
        </Box>
      </Box>

      {loading ? (
        <Box className="loadingBox">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DataGrid
            rows={filteredQrCodes}
            disableSelectionOnClick
            columns={columns}
            pageSize={10} // Limit to 10 records per page
            pageSizeOptions={[10, 25, 50, 100]} // Additional page size options
            pagination // Enable pagination
            checkboxSelection
            getRowId={(r) => r.id}
          />
        </>
      )}
    </div>
  );
}
