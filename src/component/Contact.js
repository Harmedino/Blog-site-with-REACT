import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import classes from "./Contact.module.css";
import { publicRequest } from "../request";
import Message from "../UI/Message";

const Contact = () => {
  const publicReq = publicRequest();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", message: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setIsSubmitting(true);
      publicReq.post("/message", values)
        .then((response) => {
          setMessage(response.data.message);
          resetForm();
        })
        .catch((error) => {
          setMessage(error.message);
        })
        .finally(() => {
          setIsSubmitting(false);
          setTimeout(() => setMessage(""), 3000);
        });
    },
  });

  return (
    <div className={classes.contactPage}>
      {message && <Message message={message} />}

      <div className={classes.hero}>
        <div className={classes.heroContent}>
          <span className={classes.heroBadge}>Get in Touch</span>
          <h1>We'd Love to Hear From You</h1>
          <p>Have a question, suggestion, or just want to say hello? Drop us a message and we'll get back to you within 24 hours.</p>
        </div>
      </div>

      <div className={classes.contactBody}>
        <div className={classes.container}>
          <div className={classes.contactInfo}>
            <h2>Contact Information</h2>
            <p>Reach out to us through any of the channels below, or fill out the form and we'll respond promptly.</p>

            <div className={classes.infoItems}>
              <div className={classes.infoItem}>
                <span className={classes.infoIcon}>📧</span>
                <div>
                  <strong>Email</strong>
                  <p>hello@harmedino.com</p>
                </div>
              </div>
              <div className={classes.infoItem}>
                <span className={classes.infoIcon}>📍</span>
                <div>
                  <strong>Location</strong>
                  <p>Lagos, Nigeria</p>
                </div>
              </div>
              <div className={classes.infoItem}>
                <span className={classes.infoIcon}>⏰</span>
                <div>
                  <strong>Response Time</strong>
                  <p>Within 24 hours</p>
                </div>
              </div>
            </div>

            <div className={classes.socialLinks}>
              <h3>Follow Us</h3>
              <div className={classes.socials}>
                <a href="#twitter" className={classes.socialBtn}>𝕏</a>
                <a href="#instagram" className={classes.socialBtn}>📷</a>
                <a href="#linkedin" className={classes.socialBtn}>in</a>
              </div>
            </div>
          </div>

          <div className={classes.formWrapper}>
            <h2>Send a Message</h2>
            <form onSubmit={formik.handleSubmit} className={classes.form}>
              <div className={classes.formRow}>
                <div className={classes.formGroup}>
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    {...formik.getFieldProps("name")}
                    className={formik.touched.name && formik.errors.name ? classes.inputError : ""}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <span className={classes.errorMsg}>{formik.errors.name}</span>
                  )}
                </div>
                <div className={classes.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    {...formik.getFieldProps("email")}
                    className={formik.touched.email && formik.errors.email ? classes.inputError : ""}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <span className={classes.errorMsg}>{formik.errors.email}</span>
                  )}
                </div>
              </div>
              <div className={classes.formGroup}>
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Tell us what's on your mind..."
                  {...formik.getFieldProps("message")}
                  className={formik.touched.message && formik.errors.message ? classes.inputError : ""}
                ></textarea>
                {formik.touched.message && formik.errors.message && (
                  <span className={classes.errorMsg}>{formik.errors.message}</span>
                )}
              </div>
              <button type="submit" className={classes.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? (
                  <><span className={classes.btnSpinner}></span> Sending...</>
                ) : (
                  "Send Message →"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
