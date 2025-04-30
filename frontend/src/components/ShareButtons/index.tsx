"use client";

import React, { useState } from "react";
import styles from "./ShareButtons.module.scss";
import {
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaTelegram,
  FaLinkedin,
  FaReddit,
  FaShareAlt,
} from "react-icons/fa";
import { useTranslations } from "next-intl";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
  const [isOpen, setIsOpen] = useState(false); // Состояние для открытия/закрытия списка
  const t = useTranslations();
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Facebook",
      icon: <FaFacebook className={styles.icon} />, // Используем иконки
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "Twitter",
      icon: <FaTwitter className={styles.icon} />,
      link: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className={styles.icon} />,
      link: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "Telegram",
      icon: <FaTelegram className={styles.icon} />,
      link: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className={styles.icon} />,
      link: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      name: "Reddit",
      icon: <FaReddit className={styles.icon} />,
      link: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (link: string) => {
    window.open(link, "_blank");
    setIsOpen(false); // Закрываем список после выбора
  };

  return (
    <div className={styles.shareSelect}>
      <button
        className={styles.selectButton}
        onClick={toggleDropdown}
        aria-label={t("share")}
      >
        <FaShareAlt className={styles.shareIcon} />
        {t("share")}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {shareLinks.map(({ name, icon, link }) => (
            <div
              key={name}
              className={styles.option}
              onClick={() => handleOptionClick(link)}
            >
              {icon}
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShareButtons;
