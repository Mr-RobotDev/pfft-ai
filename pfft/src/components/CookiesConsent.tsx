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
import { MdOutlinePrivacyTip } from "react-icons/md"; // Privacy icon
import { FiSettings } from "react-icons/fi"; // Settings icon

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

type CookieSettings = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

export default function CustomCookiesConsent() {
  const [open, setOpen] = useState(false);
  const [showStrip, setShowStrip] = useState(false);
  const [cookiesSettings, setCookiesSettings] = useState<CookieSettings>({
    essential: Cookies.get("essential") === "true" || true,
    analytics: Cookies.get("analytics") === "true" || true,
    marketing: Cookies.get("marketing") === "true" || true,
  });

  useEffect(() => {
    const consentGiven = Cookies.get("consentGiven");
    if (!consentGiven) {
      setShowStrip(true);
    }
  }, []);

  const handleClose = () => {
    setShowStrip(false);
    setOpen(false);
  };

  const handleSetCookies = (cookies: CookieSettings) => {
    Cookies.set("consentGiven", "true", { expires: 365 });
    Cookies.set("essential", cookies.essential.toString(), { expires: 365 });
    Cookies.set("analytics", cookies.analytics.toString(), { expires: 365 });
    Cookies.set("marketing", cookies.marketing.toString(), { expires: 365 });
    handleClose();
  };

  const handleAcceptAll = () => {
    handleSetCookies({
      essential: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleRejectAll = () => {
    handleSetCookies({
      essential: false,
      analytics: false,
      marketing: false,
    });
  };

  const handleCustomize = () => {
    handleSetCookies(cookiesSettings);
  };

  const handleChange = (event: any) => {
    setCookiesSettings({
      ...cookiesSettings,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <React.Fragment>
      {showStrip && !open && (
        <Box
          position="fixed"
          bottom="45px"
          left="0"
          width="100%"
          bgcolor="background.paper"
          p={3}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          zIndex={999999}
          boxShadow="0 2px 8px rgba(0,0,0,0.1)"
          style={{ borderRadius: "8px" }}
        >
          <Box display="flex" alignItems="center" marginBottom="8px">
            <MdOutlinePrivacyTip
              size="24"
              style={{ marginRight: "8px", color: "#ff8b4b" }}
            />
            <Typography
              variant="h5"
              style={{ fontWeight: "bolder" }}
              className="font-courierPrime"
            >
              Your Privacy Matters
            </Typography>
          </Box>
          <Typography
            style={{
              fontSize: "1rem",
              color: "#666",
              maxWidth: "80%",
              textAlign: "center",
              marginBottom: "16px",
            }}
            className="font-courierPrime"
          >
            We use cookies to enhance your experience, analyze our traffic, and
            for security and marketing. By visiting our website you agree to our
            use of cookies.{" "}
            <PrivacyLink href="/privacy-policy">Privacy Policy</PrivacyLink>.
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            maxWidth="400px"
          >
            <Button
              onClick={handleRejectAll}
              variant="outlined"
              style={{
                borderColor: "#ff8b4b",
                color: "#ff8b4b",
                fontWeight: "bold",
              }}
              className="font-courierPrime"
            >
              Reject All
            </Button>
            <Button
              onClick={handleAcceptAll}
              variant="contained"
              style={{
                backgroundColor: "#ff8b4b",
                color: "white",
                fontWeight: "bold",
              }}
              className="font-courierPrime"
            >
              Accept All
            </Button>
            <Button
              onClick={() => setOpen(true)}
              variant="outlined"
              style={{
                borderColor: "#ff8b4b",
                color: "#ff8b4b",
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
              }}
              className="font-courierPrime"
            >
              <FiSettings style={{ marginRight: "4px" }} /> Customize
            </Button>
          </Box>
        </Box>
      )}
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
                onClick={handleCustomize}
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
