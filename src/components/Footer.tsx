import { inviteConfig } from '../config';

type FooterProps = {
  onShare: () => void;
};

function Footer({ onShare }: FooterProps) {
  return (
    <footer className="pb-8 text-center text-xs text-rosewood/75">
      <p>문의: {inviteConfig.contacts}</p>
      <button type="button" onClick={onShare} className="mt-3 rounded-full border border-rosewood/30 px-3 py-1.5">
        Share this link
      </button>
    </footer>
  );
}

export default Footer;
