import styles from "./Navbar.module.scss";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.content}>
        <Image src="/logo.png" alt="logo" width={120} height={38} />
      </div>
    </nav>
  );
};

export default Navbar;
