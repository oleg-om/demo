import styles from "./Navbar.module.scss";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.content}>
        <Link href={ROUTES.HOME}>
          <Image src="/logo.png" alt="logo" width={120} height={22} />
          44
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
