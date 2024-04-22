import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../utils/AuthContext";
import { loginUser, signUpUser } from "../api/users";

function Authenticate() {
  useEffect(() => {
    // making sure that the top of the page is shown
    window.scrollTo(0, 0);
  }, []);

  const auth = useContext(AuthContext);

  const navigate = useNavigate();

  const [isLoginMode, setLoginMode] = useState(true);

  const switchModeHandler = () => {
    setLoginMode(!isLoginMode);
  };

  const signUpUserMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      console.log(data);
      auth.login(data.id, data.admin, data.token);
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Unexprected error while signing up");
    },
  });

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log(data);
      auth.login(data.id, data.admin, data.token);
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
      if (error instanceof TypeError) {
        toast.error("Failed to connect to the server");
      } else {
        toast.error(`${error}`);
      }
    },
  });

  const onSubmit = (values) => {
    if (isLoginMode) {
      loginUserMutation.mutate({
        email: values.email,
        password: values.password,
      });
    } else {
      signUpUserMutation.mutate({
        name: values.name,
        email: values.email,
        password: values.password,
      });
    }
  };

  const validationSchema = yup.object().shape({
    name: !isLoginMode ? yup.string().required("Name is required") : undefined,
    email: yup.string().email("Invalid email").required("Email is required"),
    password: !isLoginMode
      ? yup.string().min(8).required("Password is required")
      : yup.string().required("Password is required"),
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
      },
      validationSchema,
      onSubmit,
    });

  return (
    <>
      {!isLoginMode ? <h1>Sign Up</h1> : <h1>Login</h1>}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="form-item">
              <TextField
                id="name"
                type="text"
                label="Name"
                placeholder="Enter your name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name && touched.name}
                helperText={errors.name && touched.name ? errors.name : ""}
              />
            </div>
          )}

          <div className="form-item">
            <TextField
              id="email"
              type="text"
              label="Email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email && touched.email}
              helperText={errors.email && touched.email ? errors.email : ""}
            />
          </div>

          <div className="form-item">
            <TextField
              id="password"
              type="password"
              label="Password"
              placeholder="Enter the password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password && touched.password}
              helperText={
                errors.password && touched.password ? errors.password : ""
              }
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            color="warning"
            size="large"
            sx={{ width: "33%" }}
          >
            {isLoginMode ? "Login" : "Signup"}
          </Button>
        </form>

        <div>
          <Button
            type="submit"
            variant="contained"
            size="large"
            onClick={switchModeHandler}
            sx={{ width: "33%", marginTop: "3%" }}
          >
            {isLoginMode ? "Signup instead?" : "Login instead?"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default Authenticate;
