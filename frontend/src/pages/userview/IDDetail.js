import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ApiCall } from "../../hooks";
import { useAuth } from "../../providers";
import { useSnackbar } from "../../providers/SnackProvider";
import { Card, CardContent, Typography, Grid, Box, Avatar } from "@mui/material";
import moment from "moment";

export const IDDetail = () => {
  const location = useLocation();
  const { id_no } = location.state || {};
  const [IDDetails, setIDDetails] = useState({});
  const userAuth = useAuth();
  const showSnackbar = useSnackbar();
  const { access, setAccess, refresh, setRefresh } = userAuth;

  useEffect(() => {
    ApiCall(
      `/api/id_detail/?id_no=${id_no}`,
      "get",
      access,
      refresh,
      setAccess,
      setRefresh,
      {},
      {},
      false,
      showSnackbar
    )
      .then((response) => {
        if (response && response.status && response.status === 200) {
          setIDDetails(response.data);
          console.log(response.data)
        } else {
          throw new Error(response);
        }
      })
      .catch(() => {
        showSnackbar("Something went wrong!");
      });
  }, [id_no]);

  const {
    id_name,
    sn,
    date_of_birth,
    gender,
    district_of_birth,
    date_of_issue,
    front_image,
    back_image,
    id_status,
  } = IDDetails;
  
  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom align="center">
        ID Details
      </Typography>
      <Card sx={{ maxWidth: 800, margin: "auto" }}>
        <CardContent>
          <Grid container spacing={4}>
            {/* ID Holder Name */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Name: {id_name || "N/A"}
              </Typography>
            </Grid>

            {/* Serial Number and ID Number */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="textSecondary">
                Serial Number: {sn || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="textSecondary">
                ID Number: {id_no || "N/A"}
              </Typography>
            </Grid>

            {/* Date of Birth and Gender */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="textSecondary">
                Date of Birth: {date_of_birth ? moment(date_of_birth).format("MMMM Do YYYY") : "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="textSecondary">
                Gender: {gender || "N/A"}
              </Typography>
            </Grid>

            {/* District of Birth and Date of Issue */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="textSecondary">
                District of Birth: {district_of_birth || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" color="textSecondary">
                Date of Issue: {date_of_issue ? moment(date_of_issue).format("MMMM Do YYYY") : "N/A"}
              </Typography>
            </Grid>

            {/* Status */}
            <Grid item xs={12}>
              <Typography variant="body1" color="textSecondary">
                Status: {id_status || "N/A"}
              </Typography>
            </Grid>

            {/* Images */}
            <Grid item xs={12} sm={6}>
              <Box textAlign="center">
                <Typography variant="body1">Front Image</Typography>
                {front_image ? (
                  <Avatar
                    variant="rounded"
                    alt="Front ID Image"
                    src={front_image}
                    sx={{ width: 120, height: 160, margin: "auto" }}
                  />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No Front Image Available
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box textAlign="center">
                <Typography variant="body1">Back Image</Typography>
                {back_image ? (
                  <Avatar
                    variant="rounded"
                    alt="Back ID Image"
                    src={back_image}
                    sx={{ width: 120, height: 160, margin: "auto" }}
                  />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No Back Image Available
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
