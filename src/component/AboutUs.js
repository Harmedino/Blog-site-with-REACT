import React from "react";
import styles from "./AboutUs.module.css";
import { Link } from "react-router-dom";

const teamMembers = [
  {
    name: "Damilola Adewale",
    role: "Founder & Editor-in-Chief",
    bio: "Passionate about sharing ideas that matter, with 8+ years in digital publishing.",
    avatar: "https://ui-avatars.com/api/?name=Damilola+Adewale&background=060A6B&color=fff&size=256&bold=true&font-size=0.35",
  },
  {
    name: "Sarah Johnson",
    role: "Technology Writer",
    bio: "Software engineer turned writer, covering the intersection of tech and human experience.",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=1a20c4&color=fff&size=256&bold=true&font-size=0.35",
  },
  {
    name: "Marcus Chen",
    role: "Lifestyle & Travel",
    bio: "World traveler and storyteller, documenting culture and adventure across 50+ countries.",
    avatar: "https://ui-avatars.com/api/?name=Marcus+Chen&background=D4A000&color=fff&size=256&bold=true&font-size=0.35",
  },
];

const values = [
  {
    icon: "🎯",
    title: "Authenticity",
    desc: "We believe in honest, well-researched content that respects our readers' intelligence.",
  },
  {
    icon: "🌍",
    title: "Diversity",
    desc: "We amplify voices from all walks of life, bringing fresh perspectives to every topic.",
  },
  {
    icon: "💡",
    title: "Curiosity",
    desc: "We ask the hard questions and dig deep to bring you stories that spark new thinking.",
  },
  {
    icon: "🤝",
    title: "Community",
    desc: "We're more than a blog — we're a growing community of curious, engaged readers.",
  },
];

const AboutUs = () => {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>Our Story</span>
          <h1>We Believe in the Power of a Good Story</h1>
          <p>
            Harmedino started as a passion project and grew into a platform where
            ideas, insights, and stories find their voice. We're built by writers,
            for readers who crave more.
          </p>
          <Link to="/blogList" className={styles.heroBtn}>Explore the Blog</Link>
        </div>
        <div className={styles.heroShape}></div>
      </div>

      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <strong>500+</strong>
            <span>Articles Published</span>
          </div>
          <div className={styles.statCard}>
            <strong>120+</strong>
            <span>Active Writers</span>
          </div>
          <div className={styles.statCard}>
            <strong>10K+</strong>
            <span>Monthly Readers</span>
          </div>
          <div className={styles.statCard}>
            <strong>2019</strong>
            <span>Founded</span>
          </div>
        </div>
      </section>

      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionText}>
            <span className={styles.sectionLabel}>Our Mission</span>
            <h2>Connecting Ideas with the People Who Need Them</h2>
            <p>
              At Harmedino, we believe every person has a story worth telling and every
              reader deserves content that genuinely informs, entertains, and inspires.
              We cut through the noise to bring you articles that are thoughtful,
              well-crafted, and relevant to your life.
            </p>
            <p>
              From technology trends to travel adventures, lifestyle guides to creative
              essays — our writers are experts in their fields and passionate about
              sharing what they know.
            </p>
          </div>
          <div className={styles.missionVisual}>
            <img
              src="https://picsum.photos/seed/harmedino-mission/480/380"
              alt="Our mission"
              className={styles.missionImg}
            />
          </div>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>What We Stand For</span>
            <h2>Our Core Values</h2>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((v) => (
              <div className={styles.valueCard} key={v.title}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>The People Behind the Words</span>
            <h2>Meet the Team</h2>
          </div>
          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <div className={styles.teamCard} key={member.name}>
                <img
                  src={member.avatar}
                  alt={member.name}
                  className={styles.teamAvatar}
                />
                <h3>{member.name}</h3>
                <span className={styles.teamRole}>{member.role}</span>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Ready to Join the Conversation?</h2>
          <p>Start reading, or become a writer and share your perspective with thousands of readers.</p>
          <div className={styles.ctaActions}>
            <Link to="/blogList" className={styles.ctaBtnPrimary}>Browse Articles</Link>
            <Link to="/Auth?mode=signup" className={styles.ctaBtnSecondary}>Become a Writer</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
