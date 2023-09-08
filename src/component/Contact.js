import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import classes from "./Contact.module.css";
import { publicRequest } from '../request';
import Message from "../UI/Message";

const Contact = () => {
  const publicReq = publicRequest();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Add a state for submission status

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      message: Yup.string().required("Message is required")
    }),
    onSubmit: (values, { resetForm }) => {
      setIsSubmitting(true); // Set isSubmitting to true when the form is submitted
      publicReq.post("/message", values)
        .then((response) => {
          setMessage(response.data.message);
          resetForm();
        })
        .catch((error) => {
          setMessage(error.message);
        })
        .finally(() => {
          setIsSubmitting(false); // Reset isSubmitting when submission is completed
          setTimeout(() => {
            setMessage("");
          }, 3000);
        });
    }
  });

  return (
    <div>
      <section className={classes.hero}>
        <div className={classes.heroContent}>
          <h1>Contact Us</h1>
          <p>Feel free to reach out to us for any inquiries or feedback.</p>
        </div>
      </section>
      {message && <Message message={message}></Message>}
      
      <section className={classes.contactForm}>
        <h2>Contact Us</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className={classes.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              {...formik.getFieldProps("name")}
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              {...formik.getFieldProps("email")}
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              {...formik.getFieldProps("message")}
            ></textarea>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Contact;
