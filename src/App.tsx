import { useState } from "react";
import "./app.css";
import "./assets/scss/main.scss";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  styled,
  Switch,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";

import MuiAlert, { AlertProps } from "@mui/material/Alert";

// pricing icons
import ArcadeIcon from "./assets/images/icon-arcade.svg";
import AdvancedIcon from "./assets/images/icon-advanced.svg";
import ProIcon from "./assets/images/icon-pro.svg";
import ThankYouIcon from "./assets/images/icon-thank-you.svg";

import * as React from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const steps = [
  {
    num: 1,
    title: "Your Info",
    form_title: "Personal info",
    form_subtitle: "Please provide your name, email address, and phone number.",
  },
  {
    num: 2,
    title: "Select Plan",
    form_title: "Select your plan",
    form_subtitle: "You have the option of monthly or yearly billing.",
  },
  {
    num: 3,
    title: "Add-ons",
    form_title: "Pick add-ons",
    form_subtitle: "Add-ons help enhance your gaming experience.",
  },
  {
    num: 4,
    title: "Summary",
    form_title: "Finishing up",
    form_subtitle: "Double-check everything looks OK before confirming.",
  },
];

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#02295a",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: "#02295a",
    boxSizing: "border-box",
  },
}));

// function for number only
const numberOnly = (event: React.KeyboardEvent<HTMLInputElement>) => {
  const val = event.key;
  const ctrl = event.ctrlKey;
  const shift = event.shiftKey;
  const target = event.target as HTMLInputElement;
  const keyExceptions = ["Backspace", "ArrowLeft", "ArrowRight"];
  if (
    val.match(/\d/g) === null &&
    keyExceptions.includes(val) === false &&
    ctrl === false &&
    shift === false
  ) {
    event.preventDefault();
  } else if (ctrl && val === "a") {
    if (target) {
      target.setSelectionRange(0, target.value.length);
    }
  } else if (shift && val !== "ArrowLeft" && val !== "ArrowRight") {
    event.preventDefault();
  }
};

interface AddOns {
  title: string;
  price: number | undefined;
}

interface FormDetails {
  name: string;
  emailAddress: string;
  phoneNumber: string;
  billingTypeTime: string;
  billingType: string;
  billingTypePrice: number | undefined;
  addOns: AddOns[];
  total: number | undefined;
}

type Color = "success" | "error" | "info" | "warning";

interface Toast {
  open: boolean;
  message: string;
  severity: Color;
}

const pricingList = [
  {
    type: "Arcade",
    monthly: 9,
    yearly: 90,
    icon: ArcadeIcon,
  },
  {
    type: "Advanced",
    monthly: 12,
    yearly: 120,
    icon: AdvancedIcon,
  },
  {
    type: "Pro",
    monthly: 15,
    yearly: 150,
    icon: ProIcon,
  },
];

const addons = [
  {
    selected: false,
    title: "Online service",
    subtitle: "Access to multiplayer games",
    monthly: 1,
    yearly: 10,
  },
  {
    selected: false,
    title: "Larger storage",
    subtitle: "Extra 1TB of cloud save",
    monthly: 2,
    yearly: 20,
  },
  {
    selected: false,
    title: "Customizable profile",
    subtitle: "Custom theme on your profile",
    monthly: 2,
    yearly: 20,
  },
];

function App() {
  const [step, setStep] = useState(1);

  const [completedForm, setCompletedForm] = useState<FormDetails>({
    name: "",
    emailAddress: "",
    phoneNumber: "",
    billingTypeTime: "monthly",
    billingType: "arcade",
    billingTypePrice: 0,
    addOns: [],
    total: 0,
  });
  const [displayThankyouSection, setDisplayThankyouSection] = useState(false);
  const [toast, setToast] = useState<Toast>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleEditPersonalInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompletedForm({ ...completedForm, [name]: value });
  };

  const handleRemoveErrorFieldStyle = (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    const { name } = e.target;
    const field = document.querySelectorAll(`[name=${name}]`);
    field.forEach((fieldElem) => {
      fieldElem?.closest(".text-field")?.classList.remove("error");
    });
  };

  const handleChangeBillingType = (
    type: string,
    monthly: number,
    yearly: number
  ) => {
    const price =
      completedForm.billingTypeTime === "monthly" ? monthly : yearly;
    let total = price;
    // check if user already selected add ons
    const arr: number[] = [];
    completedForm.addOns.forEach((n: AddOns) => {
      arr.push(n.price!);
    });

    if (completedForm.addOns.length !== 0) {
      const addOnsPrice = arr.reduce((num, total) => {
        return total + num;
      });

      total = price + addOnsPrice;
    }

    setCompletedForm({
      ...completedForm,
      billingType: type,
      billingTypePrice: price,
      total,
    });
  };

  const handleChangeBillingTypeTime = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = e.target;
    const billingType = pricingList.find(
      (n) => n.type.toLowerCase() === completedForm.billingType.toLowerCase()
    );
    const addOnsList = completedForm.addOns;
    const billingPrice = checked ? billingType?.yearly : billingType?.monthly;
    let total = billingPrice;

    if (addOnsList.length !== 0) {
      addOnsList.forEach((item: AddOns) => {
        const addOnDetail = addons.find((n) => n.title === item.title);
        item.price = checked ? addOnDetail?.yearly : addOnDetail?.monthly;
      });
      const addOnTotal = addOnsList
        .map((n) => {
          return n.price;
        })
        .reduce((num, total) => {
          return total! + num!;
        });
      total = billingPrice! + addOnTotal!;
    }

    setCompletedForm({
      ...completedForm,
      billingTypeTime: checked ? "yearly" : "monthly",
      billingTypePrice: billingPrice,
      addOns: addOnsList,
      total,
    });
  };

  const handleAddAddOns = (monthly: number, yearly: number, title: string) => {
    const list = completedForm.addOns;
    const selectedAddOn = list.findIndex((n) => n.title === title);
    if (selectedAddOn !== -1) {
      list.splice(selectedAddOn, 1);
    } else {
      list.push({
        title,
        price: completedForm.billingTypeTime === "monthly" ? monthly : yearly,
      });
    }

    let total = 0;
    // check if user already selected add ons
    if (completedForm.addOns.length !== 0) {
      const addOnsListTotalPrice = list
        .map((n) => {
          return n.price;
        })
        .reduce((num, total) => {
          return total! + num!;
        });
      total = completedForm.billingTypePrice! + addOnsListTotalPrice!;
    }

    setCompletedForm({
      ...completedForm,
      addOns: list,
      total,
    });
  };

  const handleGetCurrentStepForm = (step: number) => {
    switch (step) {
      case 1:
        return (
          <Box className="form-items">
            <Box className="form-item">
              <Typography variant="subtitle1" className="item-label">
                Name
              </Typography>
              <TextField
                name="name"
                placeholder="e.g. Stephen King"
                fullWidth
                className="text-field"
                onChange={handleEditPersonalInfo}
                onFocus={handleRemoveErrorFieldStyle}
                value={completedForm.name}
              />
            </Box>
            <Box className="form-item">
              <Typography variant="subtitle1" className="item-label">
                Email Address
              </Typography>
              <TextField
                name="emailAddress"
                placeholder="e.g. stephenking@lorem.com"
                fullWidth
                className="text-field"
                type="email"
                onChange={handleEditPersonalInfo}
                onFocus={handleRemoveErrorFieldStyle}
                value={completedForm.emailAddress}
              />
            </Box>
            <Box className="form-item">
              <Typography variant="subtitle1" className="item-label">
                Phone Number
              </Typography>
              <TextField
                name="phoneNumber"
                placeholder="e.g. + 1 234 567 890"
                fullWidth
                className="text-field"
                onKeyDown={numberOnly}
                onChange={handleEditPersonalInfo}
                onFocus={handleRemoveErrorFieldStyle}
                value={completedForm.phoneNumber}
              />
            </Box>
          </Box>
        );
      case 2:
        return (
          <>
            <Box className="pricing-section">
              {pricingList.map((item, key) => (
                <Box
                  className={`pricing-item ${
                    completedForm.billingType === item.type.toLowerCase()
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleChangeBillingType(
                      item.type.toLowerCase(),
                      item.monthly,
                      item.yearly
                    )
                  }
                  key={key}
                >
                  <img src={item.icon} alt="" />
                  <Box className="type-per-month">
                    <Typography variant="subtitle1" className="type">
                      {item.type}
                    </Typography>
                    <Typography variant="subtitle2" className="price">
                      {completedForm.billingTypeTime === "yearly"
                        ? `$${item.yearly}/yr`
                        : `$${item.monthly}/mo`}
                    </Typography>
                    {completedForm.billingTypeTime === "yearly" && (
                      <Typography variant="subtitle2" className="promo">
                        2 months free
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
            <Box className="billing-type">
              <Typography variant="subtitle1">Monthly</Typography>
              <AntSwitch
                checked={completedForm.billingTypeTime === "yearly"}
                onChange={handleChangeBillingTypeTime}
              />
              <Typography variant="subtitle1">Yearly</Typography>
            </Box>
          </>
        );
      case 3:
        return (
          <>
            <Box className="add-ons-section">
              {addons.map((item, key) => (
                <Box
                  className={`add-on-item ${
                    completedForm.addOns.find((n) => n.title === item.title)
                      ? "selected"
                      : ""
                  }`}
                  key={key}
                  onClick={() => {
                    handleAddAddOns(item.monthly, item.yearly, item.title);
                  }}
                >
                  <Box className="add-on-desc-checkbox">
                    <Checkbox
                      className="add-on-check"
                      checked={Boolean(
                        completedForm.addOns.find((n) => n.title === item.title)
                      )}
                    />
                    <Box className="add-on-description">
                      <Typography variant="subtitle1" className="title">
                        {item.title}
                      </Typography>
                      <Typography variant="subtitle2" className="subtitle">
                        {item.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="subtitle2" className="price">
                    {completedForm.billingTypeTime === "yearly"
                      ? `+$${item.yearly}/yr`
                      : `+$${item.monthly}/mo`}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        );
      case 4:
        return (
          <>
            <Box className="summary-section">
              <Box className="selected-type">
                <Box className="type-cont">
                  <Typography variant="h6" className="type">
                    {`${completedForm.billingType} (${completedForm.billingTypeTime})`}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className="change-type"
                    onClick={() => setStep(2)}
                  >
                    Change
                  </Typography>
                </Box>
                <Typography variant="h6" className="type-price">
                  {`$${completedForm.billingTypePrice}/${
                    completedForm.billingTypeTime === "monthly" ? "mo" : "yr"
                  }`}
                </Typography>
              </Box>
              <Divider className="divider" />
              <Box className="add-ons-selected">
                {completedForm.addOns.map((item: AddOns, key: number) => (
                  <Box className="add-on-item-selected" key={key}>
                    <Typography variant="subtitle1" className="add-on-name">
                      {item.title}
                    </Typography>
                    <Typography variant="subtitle1" className="add-on-price">
                      {`$${item.price}/${
                        completedForm.billingTypeTime === "monthly"
                          ? "mo"
                          : "yr"
                      }`}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box className="total">
                <Typography variant="subtitle1" className="total-name">
                  {`Total (per ${
                    completedForm.billingTypeTime === "monthly"
                      ? "month"
                      : "year"
                  })`}
                </Typography>
                <Typography variant="subtitle1" className="total-price">
                  {`+$${completedForm.total}/${
                    completedForm.billingTypeTime === "monthly" ? "mo" : "yr"
                  }`}
                </Typography>
              </Box>
            </Box>
          </>
        );
      default:
        break;
    }
  };

  const handleGetTitleSubtitle = (step: number) => {
    const { form_title, form_subtitle } = steps.find((n) => n.num === step) || {
      form_title: "",
      form_subtitle: "",
    };
    return { form_title, form_subtitle };
  };

  const handleSubmitForm = () => {
    if (step < steps.length) {
      // next step
      // perform a validation first before going to the next step
      let nextStepForm = true;
      switch (step) {
        case 1:
          {
            const requiredField = ["name", "emailAddress", "phoneNumber"];
            // check if no values first
            requiredField.forEach((item: string) => {
              const val = completedForm[item as keyof FormDetails];
              const field = document.querySelectorAll(`[name=${item}]`);
              if (val === "") {
                field.forEach((fieldElem) => {
                  fieldElem?.closest(".text-field")?.classList.add("error");
                });
                nextStepForm = false;
              }
            });

            if (nextStepForm) {
              // check if email is in correct format
              const val = completedForm.emailAddress;
              const field = document.querySelector(`[name=emailAddress]`);
              if (val.match(/@\D+.com/g) === null) {
                field?.closest(".text-field")?.classList.add("error");
                nextStepForm = false;

                setToast({
                  ...toast,
                  open: true,
                  severity: "error",
                  message: "Invalid email format",
                });
              }
            } else {
              setToast({
                ...toast,
                open: true,
                severity: "error",
                message: "Please fill up the form",
              });
            }
          }
          break;
        case 2:
          {
            const { billingType } = completedForm;
            const pricingListItem = pricingList.find(
              (n) => n.type.toLowerCase() === billingType.toLowerCase()
            );
            if (pricingListItem) {
              handleChangeBillingType(
                billingType,
                pricingListItem.monthly,
                pricingListItem.yearly
              );
            }
          }
          break;
        case 3:
          {
            if (completedForm.addOns.length === 0) {
              nextStepForm = false;

              setToast({
                ...toast,
                open: true,
                severity: "error",
                message: "Select at least one add-on",
              });
            }
          }
          break;
        default:
          break;
      }
      if (nextStepForm) setStep((n) => n + 1);
    } else {
      // if last step
      setDisplayThankyouSection(true);
    }
  };

  const handleGoBack = () => {
    if (step !== 1) {
      setStep((n) => n - 1);
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    console.info(event);
    setToast({ ...toast, open: false });
  };

  return (
    <>
      <Paper className="step-form" elevation={0}>
        <List className="step-navigation">
          {steps.map((item) => (
            <ListItem key={item.num}>
              <ListItemAvatar className="step-item-number-cont">
                <Avatar
                  className={`step-item-number-avatar ${
                    item.num === step ? "selected" : ""
                  }`}
                >
                  {item.num}
                </Avatar>
              </ListItemAvatar>
              <ListItemText className="step-item-text">
                <Typography
                  variant="subtitle2"
                  className="step-item-number"
                >{`Step ${item.num}`}</Typography>
                <Typography variant="subtitle1" className="step-item-title">
                  {item.title}
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
        {displayThankyouSection === false ? (
          <Box className="form-cont">
            <Box className="form-content">
              <Box className="form-header">
                <Typography variant="h4" className="title">
                  {handleGetTitleSubtitle(step).form_title}
                </Typography>
                <Typography variant="subtitle1" className="subtitle">
                  {handleGetTitleSubtitle(step).form_subtitle}
                </Typography>
              </Box>
              {handleGetCurrentStepForm(step)}
            </Box>
            <Box
              className={`form-actions ${step === 1 ? "end" : "space-between"}`}
            >
              {step > 1 && (
                <Button
                  variant="outlined"
                  disableElevation
                  className="back"
                  onClick={handleGoBack}
                >
                  Go Back
                </Button>
              )}
              <Button
                variant="contained"
                disableElevation
                className={step === steps.length ? "confirm" : "next"}
                onClick={handleSubmitForm}
              >
                {step === steps.length ? "Confirm" : "Next Step"}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box className="thank-you-section">
            <img src={ThankYouIcon} alt="" />
            <Typography variant="h4" className="title">
              Thank you!
            </Typography>
            <Typography variant="body1" className="description">
              Thanks for confirming your subscription! We hope you have fun
              using our platform. If you ever need support, please fell free to
              email us at support@loregaming.com.
            </Typography>
          </Box>
        )}
      </Paper>
      <Box className="step-form-mobile">
        <Box className="banner-top"></Box>
        <List className="step-navigation-mobile">
          {steps.map((item) => (
            <ListItem key={item.num}>
              <ListItemAvatar className="step-item-number-cont">
                <Avatar
                  className={`step-item-number-avatar ${
                    item.num === step ? "selected" : ""
                  }`}
                >
                  {item.num}
                </Avatar>
              </ListItemAvatar>
            </ListItem>
          ))}
        </List>
        <Paper className="step-form-mobile-cont" elevation={0}>
          {displayThankyouSection === false ? (
            <Box className="form-content">
              <Box className="form-header">
                <Typography variant="h4" className="title">
                  {handleGetTitleSubtitle(step).form_title}
                </Typography>
                <Typography variant="subtitle1" className="subtitle">
                  {handleGetTitleSubtitle(step).form_subtitle}
                </Typography>
              </Box>
              {handleGetCurrentStepForm(step)}
            </Box>
          ) : (
            <Box className="thank-you-section">
              <img src={ThankYouIcon} alt="" />
              <Typography variant="h4" className="title">
                Thank you!
              </Typography>
              <Typography variant="body1" className="description">
                Thanks for confirming your subscription! We hope you have fun
                using our platform. If you ever need support, please fell free
                to email us at support@loregaming.com.
              </Typography>
            </Box>
          )}
        </Paper>
        {displayThankyouSection === false && (
          <Box
            className={`form-actions-mobile ${
              step === 1 ? "end" : "space-between"
            }`}
          >
            {step > 1 && (
              <Button
                variant="outlined"
                disableElevation
                className="back"
                onClick={handleGoBack}
              >
                Go Back
              </Button>
            )}
            <Button
              variant="contained"
              disableElevation
              className={step === steps.length ? "confirm" : "next"}
              onClick={handleSubmitForm}
            >
              {step === steps.length ? "Confirm" : "Next Step"}
            </Button>
          </Box>
        )}
      </Box>
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handleClose}
      >
        <Alert severity={toast?.severity || "info"} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
