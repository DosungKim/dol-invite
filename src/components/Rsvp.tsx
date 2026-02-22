import { FormEvent, useState } from 'react';

type RsvpProps = {
  onSubmit: (payload: { name: string; attendance: 'yes' | 'no'; guests: number }) => void;
};

function Rsvp({ onSubmit }: RsvpProps) {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState<'yes' | 'no'>('yes');
  const [guests, setGuests] = useState(1);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ name, attendance, guests });
    setName('');
    setGuests(1);
    setAttendance('yes');
  };

  return (
    <section className="invitation-card animate-rise" style={{ animationDelay: '0.12s' }}>
      <h2 className="section-title">RSVP</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="block text-sm text-rosewood/90">
          이름
          <input
            className="mt-1 w-full rounded-xl border border-rosewood/20 bg-white px-3 py-2 text-sm"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

        <label className="block text-sm text-rosewood/90">
          참석 여부
          <select
            className="mt-1 w-full rounded-xl border border-rosewood/20 bg-white px-3 py-2 text-sm"
            value={attendance}
            onChange={(event) => setAttendance(event.target.value as 'yes' | 'no')}
          >
            <option value="yes">참석합니다</option>
            <option value="no">참석이 어려워요</option>
          </select>
        </label>

        <label className="block text-sm text-rosewood/90">
          동반 인원
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded-xl border border-rosewood/20 bg-white px-3 py-2 text-sm"
            value={guests}
            onChange={(event) => setGuests(Number(event.target.value))}
            required
          />
        </label>

        <button type="submit" className="w-full rounded-full bg-rosewood py-2 text-sm text-white">
          참석 의사 보내기
        </button>
      </form>
    </section>
  );
}

export default Rsvp;
