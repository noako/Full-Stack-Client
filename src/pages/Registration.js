import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Registration() {
  const histroy = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = (data) => {
    axios
      .post(
        "https://full-stack-posts-app-noako-171fec647c1e.herokuapp.com/auth",
        data
      )
      .then(() => {
        console.log(data);
        histroy("/login");
      });
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Username:</label>
          <ErrorMessage name="username" component="span" />
          <Field
            id="inputCreatePost"
            name="username"
            placeholder="(Ex. John...)"
          />
          <label>Password:</label>
          <ErrorMessage name="password" component="span" />
          <Field
            id="inputCreatePost"
            type="password"
            name="password"
            placeholder="(Ex. Password...)"
          />
          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;

//   let navigate = useNavigate();

//   const onSubmit = (data) => {
//     axios.post("http://localhost:3001/posts", data).then((resp) => {
//       console.log("IT WORKED");
//       navigate("/");
//     });
//   };
