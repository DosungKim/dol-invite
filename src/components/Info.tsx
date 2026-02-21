import { inviteConfig } from '../config';

type InfoProps = {
  onCopyAddress: () => void;
};

function Info({ onCopyAddress }: InfoProps) {
  return (
    <section className="rounded-3xl bg-cream p-5 shadow-card">
      <h2 className="font-serif text-2xl text-rosewood">Invitation Info</h2>
      <dl className="mt-4 space-y-3 text-sm text-rosewood/85">
        <div>
          <dt className="text-xs uppercase tracking-[0.15em] text-rosewood/60">Venue</dt>
          <dd className="mt-1">{inviteConfig.venueName}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.15em] text-rosewood/60">Address</dt>
          <dd className="mt-1">{inviteConfig.address}</dd>
        </div>
      </dl>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <a
          href={inviteConfig.kakaoMapUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-rosewood/40 px-3 py-2 text-center text-xs text-rosewood"
        >
          Open Naver Map
        </a>
        <button
          type="button"
          onClick={onCopyAddress}
          className="rounded-full bg-rosewood px-3 py-2 text-xs text-white"
        >
          Copy Address
        </button>
      </div>
    </section>
  );
}

export default Info;
