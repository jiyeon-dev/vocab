import styles from "./loader.module.css";

export default function Loading() {
  return (
    <div className={styles.loaderBackdrop}>
      <div className={styles.loader}>
        Loading
        <span></span>
      </div>
    </div>
  );
}
