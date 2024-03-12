import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Link,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Cookies from "js-cookie";

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ConsentBox = styled(Fade)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
  borderRadius: "10px",
  outline: "none",
}));

const ConsentWrapper = styled(Box)({
  maxWidth: "500px",
  textAlign: "center",
});

const PrivacyLink = styled(Link)({
  color: "#ff8b4b",
  fontWeight: "bold",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
});

export default function CustomCookiesConsent() {
  const [open, setOpen] = useState(false);
  const [cookiesSettings, setCookiesSettings] = useState({
    essential: true,
    analytics: Cookies.get("analytics") === "true" || true,
    marketing: Cookies.get("marketing") === "true" || true,
  });

  useEffect(() => {
    const consentGiven = Cookies.get("consentGiven");
    if (!consentGiven) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    Cookies.set("consentGiven", "true", { expires: 365 });
    Cookies.set("essential", "true", { expires: 365 });
    Cookies.set("analytics", cookiesSettings.analytics.toString(), {
      expires: 365,
    });
    Cookies.set("marketing", cookiesSettings.marketing.toString(), {
      expires: 365,
    });
    console.log("Cookies settings:", cookiesSettings);
    setOpen(false);
  };

  const handleAcceptAll = () => {
    setCookiesSettings({
      essential: true,
      analytics: true,
      marketing: true,
    });
    handleClose();
  };

  const handleChange = (event: any) => {
    setCookiesSettings({
      ...cookiesSettings,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <React.Fragment>
      <StyledModal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        slots={{
          backdrop: Backdrop,
        }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        disableEscapeKeyDown={true}
      >
        <ConsentBox in={open}>
          <ConsentWrapper zIndex={1000}>
            <Typography
              id="transition-modal-title"
              variant="h5"
              component="h1"
              className="font-courierPrime"
            >
              Cookies Consent
            </Typography>
            <Typography
              id="transition-modal-description"
              sx={{ mt: 2 }}
              className="font-courierPrime"
            >
              We use cookies to enhance your experience. By continuing to visit
              this site you agree to our use of cookies.
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cookiesSettings.essential}
                    name="essential"
                    disabled
                    style={{ color: "#ff8b4b" }}
                  />
                }
                label={
                  <Typography
                    className="font-courierPrime"
                    fontWeight={"bold"}
                    fontSize={"14px"}
                  >
                    Essential Cookies
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cookiesSettings.analytics}
                    onChange={handleChange}
                    name="analytics"
                    style={{ color: "#ff8b4b" }}
                  />
                }
                label={
                  <Typography
                    className="font-courierPrime"
                    fontWeight={"bold"}
                    fontSize={"14px"}
                  >
                    Analytics Cookies
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cookiesSettings.marketing}
                    onChange={handleChange}
                    name="marketing"
                    style={{ color: "#ff8b4b" }}
                  />
                }
                label={
                  <Typography
                    className="font-courierPrime"
                    fontWeight={"bold"}
                    fontSize={"14px"}
                  >
                    Marketing Cookies
                  </Typography>
                }
              />
            </FormGroup>
            <Typography
              variant="body2"
              sx={{ mt: 2 }}
              className="font-courierPrime"
            >
              For more details, please visit our{" "}
              <PrivacyLink href="/privacy-policy">Privacy Policy</PrivacyLink>.
            </Typography>
            <Box mt={4} display={"flex"} justifyContent="center" gap={2}>
              <Button
                onClick={handleAcceptAll}
                variant="contained"
                style={{ backgroundColor: "#ff8b4b", color: "#FFFFFF" }}
                className="font-courierPrime"
              >
                Accept All
              </Button>
              <Button
                onClick={handleClose}
                variant="outlined"
                style={{ borderColor: "#ff8b4b", color: "#ff8b4b" }}
                className="font-courierPrime"
              >
                Save Preferences
              </Button>
            </Box>
          </ConsentWrapper>
        </ConsentBox>
      </StyledModal>
    </React.Fragment>
  );
}
