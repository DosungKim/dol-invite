import { inviteConfig } from '../config';

function Footer() {
  return (
    <footer className="pb-8 text-center text-xs text-rosewood/70">
      <p>문의: {inviteConfig.contacts}</p>
      <p className="mt-2">Share this link with family & friends ♡</p>
    </footer>
  );
}

export default Footer;
