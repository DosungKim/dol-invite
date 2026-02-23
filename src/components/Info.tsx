import { inviteConfig } from '../config';

type InfoProps = {
  onCopyAddress: () => void;
};

function Info({ onCopyAddress }: InfoProps) {
  return (
    <section className="invitation-card animate-rise" style={{ animationDelay: '0.04s' }}>
      <h2 className="section-title">어디에서 하나요?</h2>

      <dl className="mt-4 space-y-3 text-sm text-rosewood/85">
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-rosewood/60">장소</dt>
          <dd className="mt-2">{inviteConfig.venueName}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.3em] text-rosewood/60">주소</dt>
          <dd className="mt-2">{inviteConfig.address}</dd>
        </div>
      </dl>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <a
          href={inviteConfig.kakaoMapUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-rosewood/40 px-3 py-2 text-center text-xs text-rosewood"
        >
          지도 열기(네이버)
        </a>
        <button
          type="button"
          onClick={onCopyAddress}
          className="rounded-full bg-rosewood px-3 py-2 text-xs text-white"
        >
          주소 복사하기
        </button>
      </div>
    </section>
  );
}

export default Info;
