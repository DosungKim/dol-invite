import { inviteConfig } from '../config';

function Location() {
  return (
    <section className="invitation-card animate-rise" style={{ animationDelay: '0.06s' }}>
      <h2 className="section-title">Location</h2>

      <a href={inviteConfig.kakaoMapUrl} target="_blank" rel="noreferrer" className="mt-4 block overflow-hidden rounded-2xl">
        <img src="/map-placeholder.svg" alt="약도 이미지" className="h-52 w-full object-cover" />
      </a>

      <p className="mt-3 text-xs text-rosewood/70">지도를 눌러 카카오맵에서 길찾기를 확인해 주세요.</p>
    </section>
  );
}

export default Location;
