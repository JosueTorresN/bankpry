import AlertProps from "../../props/prop";
import styles from "./Alert.module.css";

export default function Alert(data: AlertProps) {
  return (
    <div className={data.type? styles.error_message  : styles.ok_message} role="alert">
      <p>{data.message}</p>
    </div>
  );
}