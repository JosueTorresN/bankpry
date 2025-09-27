import AlertProps from "../../props/prop";
import styles from "./Alert.module.css";

export default function Alert(data: AlertProps) {
  return (
    <div>
      <p className={data.type? styles.error_message  : styles.ok_message}>{data.message}</p>
    </div>
  );
}