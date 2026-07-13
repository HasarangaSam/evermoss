import SocialButtons from "./SocialButtons";
export default function Footer() {
  return (
    <footer>
      <div className="brand">
        <span>✦</span> Evermoss
      </div>
      <p>For the love of green spaces.</p>
      <SocialButtons compact />
      <small>© {new Date().getFullYear()} Evermoss · Gampaha</small>
    </footer>
  );
}
