import styles from "./App.module.css";
import Hero from "./sections/Hero.jsx";

export default function App() {
  return (
    <div className={styles.app}>
      <Hero />
    </div>
  );
}