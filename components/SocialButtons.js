import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa6";
const social = [
  { label: "WhatsApp", href: "https://wa.me/94711056002", Icon: FaWhatsapp },
  {
    label: "Instagram",
    href: "https://www.instagram.com/evermoss.green",
    Icon: FaInstagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61590448841185",
    Icon: FaFacebookF,
  },
];
export default function SocialButtons({ compact = false }) {
  return (
    <div className={`social-buttons ${compact ? "compact" : ""}`}>
      {social.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          title={label}
        >
          <Icon size={compact ? 18 : 20} />
          {!compact && <span>{label}</span>}
        </a>
      ))}
    </div>
  );
}
