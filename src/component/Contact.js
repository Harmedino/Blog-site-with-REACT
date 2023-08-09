import React from "react";
import classes from "./Contact.module.css";

const Contact = () => {
  return (
    <div>
      <section className={classes.hero}>
        <div className={classes.heroContent}>
          <h1>Contact Us</h1>
          <p>Feel free to reach out to us for any inquiries or feedback.</p>
        </div>
      </section>

      <section className={classes.contactForm}>
        <h2>Contact Us</h2>
        <form>
          <div className={classes.formGroup}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows="4"></textarea>
          </div>
          <button type="submit">Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default Contact;
