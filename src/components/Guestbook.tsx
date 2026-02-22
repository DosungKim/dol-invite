import { FormEvent, useState } from 'react';

type GuestbookEntry = {
  name: string;
  message: string;
  createdAt: string;
};

type GuestbookProps = {
  onSubmit: (payload: { name: string; message: string }) => void;
};

function Guestbook({ onSubmit }: GuestbookProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage) {
      return;
    }

    const nextEntry: GuestbookEntry = {
      name: trimmedName,
      message: trimmedMessage,
      createdAt: new Date().toLocaleString('ko-KR', { hour12: false }),
    };

    setEntries((prev) => [nextEntry, ...prev]);
    onSubmit({ name: trimmedName, message: trimmedMessage });
    setName('');
    setMessage('');
  };

  return (
    <section className="invitation-card animate-rise" style={{ animationDelay: '0.12s' }}>
      <h2 className="section-title">방명록</h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="block text-sm text-rosewood/90">
          이름
          <input
            className="mt-1 w-full rounded-xl border border-rosewood/20 bg-white px-3 py-2 text-sm"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="성함을 입력해 주세요"
            required
          />
        </label>

        <label className="block text-sm text-rosewood/90">
          메시지
          <textarea
            className="mt-1 min-h-24 w-full rounded-xl border border-rosewood/20 bg-white px-3 py-2 text-sm"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="축하 메시지를 남겨주세요"
            required
          />
        </label>

        <button type="submit" className="w-full rounded-full bg-rosewood py-2 text-sm text-white">
          방명록 남기기
        </button>
      </form>

      {entries.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {entries.map((entry) => (
            <li key={`${entry.createdAt}-${entry.name}`} className="rounded-xl border border-rosewood/15 bg-white/70 p-3">
              <p className="text-sm font-medium text-rosewood">{entry.name}</p>
              <p className="mt-1 whitespace-pre-line text-sm text-rosewood/90">{entry.message}</p>
              <p className="mt-1 text-xs text-rosewood/60">{entry.createdAt}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default Guestbook;
